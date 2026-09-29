import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyDriverJwt } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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

    // Fetch ONLY confirmed and assigned bookings for this driver
    const bookings = await prisma.booking.findMany({
      where: {
        AND: [
          // Must NOT be unconfirmed BOOKING_RECEIVED
          {
            status: {
              not: 'BOOKING_RECEIVED',
            },
          },
          // Must be assigned to this driver or driver's assigned vehicle
          {
            OR: [
              { driverId: driver.id },
              ...(vehicleIds.length > 0 ? [{ vehicleId: { in: vehicleIds } }] : []),
              { vehicle: { driverPhone: driver.phone } },
            ],
          },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        vehicle: true,
        trackingEvents: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        driver: {
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          licenseNo: driver.licenseNo,
        },
        bookings,
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch driver bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve assigned trips' },
      { status: 500 }
    );
  }
}
