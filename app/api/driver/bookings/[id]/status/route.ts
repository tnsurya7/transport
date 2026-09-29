import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyDriverJwt } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('driver_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyDriverJwt(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: payload.id },
      include: { vehicles: true },
    });

    if (!driver || !driver.isActive) {
      return NextResponse.json({ success: false, error: 'Driver account inactive' }, { status: 401 });
    }

    const vehicleIds = driver.vehicles.map((v) => v.id);

    // Verify booking belongs to this driver
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        AND: [
          { status: { not: 'BOOKING_RECEIVED' } },
          {
            OR: [
              { driverId: driver.id },
              ...(vehicleIds.length > 0 ? [{ vehicleId: { in: vehicleIds } }] : []),
              { vehicle: { driverPhone: driver.phone } },
            ],
          },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Trip not found or not assigned to you' },
        { status: 404 }
      );
    }

    const { status, location, message } = await request.json();

    const allowedStatuses = [
      'PICKUP_COMPLETED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CONFIRMED',
      'VEHICLE_ASSIGNED',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid delivery status value' },
        { status: 400 }
      );
    }

    const newStatus = status || booking.status;
    const defaultMessages: Record<string, string> = {
      PICKUP_COMPLETED: 'Consignment loaded and pickup completed by driver.',
      IN_TRANSIT: 'Shipment is on the highway corridor moving towards destination.',
      OUT_FOR_DELIVERY: 'Vehicle reached destination city and is out for final doorstep delivery.',
      DELIVERED: 'Consignment safely delivered and handed over to consignee.',
    };

    const eventMessage = message || defaultMessages[newStatus] || `Status updated to ${newStatus}`;

    // Update booking and create tracking event in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: newStatus,
          driverId: driver.id, // ensure driverId is linked
        },
        include: {
          customer: true,
          vehicle: true,
          trackingEvents: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      await tx.trackingEvent.create({
        data: {
          bookingId: b.id,
          status: newStatus,
          message: eventMessage,
          location: location || undefined,
          updatedBy: `Driver: ${driver.name}`,
        },
      });

      return b;
    });

    return NextResponse.json({
      success: true,
      message: 'Delivery status & location updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Driver status update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update delivery status' },
      { status: 500 }
    );
  }
}
