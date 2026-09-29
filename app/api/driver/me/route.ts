import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyDriverJwt } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
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
      include: {
        vehicles: true,
      },
    });

    if (!driver || !driver.isActive) {
      return NextResponse.json({ success: false, error: 'Driver account inactive' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        licenseNo: driver.licenseNo,
        vehicles: driver.vehicles,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch driver profile' }, { status: 500 });
  }
}
