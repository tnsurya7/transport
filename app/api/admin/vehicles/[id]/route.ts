import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { vehicleNumber, vehicleType, capacity, driverId, isActive } = body;

    let driverName = body.driverName;
    let driverPhone = body.driverPhone;

    if (driverId !== undefined) {
      if (driverId === null || driverId === '') {
        driverName = null;
        driverPhone = null;
      } else {
        const driver = await prisma.driver.findUnique({ where: { id: driverId } });
        if (driver) {
          driverName = driver.name;
          driverPhone = driver.phone;
        }
      }
    }

    const updated = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        ...(vehicleNumber ? { vehicleNumber: vehicleNumber.trim().toUpperCase() } : {}),
        ...(vehicleType ? { vehicleType: vehicleType.trim() } : {}),
        ...(capacity !== undefined ? { capacity: capacity ? capacity.trim() : null } : {}),
        ...(driverId !== undefined ? { driverId: driverId && driverId.trim() !== '' ? driverId : null } : {}),
        ...(driverName !== undefined ? { driverName } : {}),
        ...(driverPhone !== undefined ? { driverPhone } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      include: {
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return handleApiError(error, 'Failed to update fleet vehicle.');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await prisma.vehicle.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    return handleApiError(error, 'Failed to delete vehicle.');
  }
}
