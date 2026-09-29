import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandler';
import { isValidPhone, isValidEmail, cleanPhone } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const drivers = await prisma.driver.findMany({
      include: {
        vehicles: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch driver accounts.');
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, phone, email, password, licenseNo, isActive } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Driver Name, Phone number (Login ID), and Password are required.' },
        { status: 400 }
      );
    }

    const cleanedPhone = cleanPhone(phone);
    if (!isValidPhone(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.' },
        { status: 400 }
      );
    }

    if (email && email.trim() !== '' && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid official email format.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const driver = await prisma.driver.create({
      data: {
        name: name.trim(),
        phone: cleanedPhone,
        email: email ? email.trim() : null,
        passwordHash,
        licenseNo: licenseNo ? licenseNo.trim() : null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        vehicles: true,
      },
    });

    return NextResponse.json({ success: true, data: driver }, { status: 201 });
  } catch (error: any) {
    return handleApiError(error, 'Failed to create driver login account.');
  }
}
