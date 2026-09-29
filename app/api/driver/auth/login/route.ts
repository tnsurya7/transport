import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signDriverJwt, checkLoginRateLimit, resetLoginRateLimit } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkLoginRateLimit(`driver_${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone number and password are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const driver = await prisma.driver.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { phone: `+91${cleanPhone}` },
          { phone: phone.trim() },
        ],
      },
    });

    if (!driver || !driver.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid driver phone number or account is disabled.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, driver.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password credentials.' },
        { status: 401 }
      );
    }

    resetLoginRateLimit(`driver_${ip}`);

    // Update last login timestamp
    await prisma.driver.update({
      where: { id: driver.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await signDriverJwt({
      id: driver.id,
      phone: driver.phone,
      name: driver.name,
      role: 'DRIVER',
    });

    const response = NextResponse.json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        licenseNo: driver.licenseNo,
      },
    });

    response.cookies.set('driver_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Driver login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
