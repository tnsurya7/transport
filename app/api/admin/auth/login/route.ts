import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, verifyPassword, signAdminJwt, checkLoginRateLimit, resetLoginRateLimit } from '@/lib/auth';
import prisma from '@/lib/prisma';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Fallback admin credentials from environment
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sarisantransport.in';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const cleanEmail = email.trim().toLowerCase();
    let adminRecord: any = null;

    try {
      adminRecord = await prisma.admin.findUnique({
        where: { email: cleanEmail },
      });
    } catch {
      // Prisma offline/fallback
    }

    let isValid = false;
    let adminPayload: any = null;

    if (adminRecord) {
      isValid = await verifyPassword(password, adminRecord.passwordHash);
      if (isValid) {
        adminPayload = {
          id: adminRecord.id,
          email: adminRecord.email,
          name: adminRecord.name,
          role: adminRecord.role,
        };
      }
    } else if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
      // Seed default admin
      isValid = true;
      adminPayload = {
        id: 'admin-seed-01',
        email: DEFAULT_ADMIN_EMAIL,
        name: 'Master Admin (Erode)',
        role: 'SUPER_ADMIN',
      };
    }

    if (!isValid || !adminPayload) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    resetLoginRateLimit(ip);

    const token = await signAdminJwt(adminPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: adminPayload,
    });

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
