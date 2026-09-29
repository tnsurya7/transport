import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errorHandler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            licenseNo: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch transport fleet vehicles.');
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { vehicleNumber, vehicleType, capacity, driverId, isActive } = body;

    if (!vehicleNumber || !vehicleType) {
      return NextResponse.json(
        { success: false, error: 'Vehicle registration number and type/model are required.' },
        { status: 400 }
      );
    }

    let driverName = null;
    let driverPhone = null;

    if (driverId && driverId.trim() !== '') {
      const driver = await prisma.driver.findUnique({ where: { id: driverId } });
      if (driver) {
        driverName = driver.name;
        driverPhone = driver.phone;
      }
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType: vehicleType.trim(),
        capacity: capacity ? capacity.trim() : null,
        driverId: driverId && driverId.trim() !== '' ? driverId : null,
        driverName: driverName || body.driverName || null,
        driverPhone: driverPhone || body.driverPhone || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error: any) {
    return handleApiError(error, 'Failed to register fleet vehicle.');
  }
}

