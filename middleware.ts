import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'transport_super_secret_jwt_key_erode_tamilnadu_2026_production';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  const driverToken = request.cookies.get('driver_token')?.value;

  // Protect Admin Pages
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(adminToken, SECRET_KEY);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as Admin, redirect /admin/login to /admin/dashboard
  if (pathname === '/admin/login' && adminToken) {
    try {
      await jwtVerify(adminToken, SECRET_KEY);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch {
      // Invalid token, allow access to login
    }
  }

  // Protect Admin APIs (except login/logout)
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth/login')) {
    if (!adminToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin credentials required' },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(adminToken, SECRET_KEY);
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Token is invalid or expired' },
        { status: 401 }
      );
    }
  }

  // Protect Driver Pages
  if (pathname.startsWith('/driver') && pathname !== '/driver/login') {
    if (!driverToken) {
      const loginUrl = new URL('/driver/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(driverToken, SECRET_KEY);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/driver/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as Driver, redirect /driver/login to /driver/dashboard
  if (pathname === '/driver/login' && driverToken) {
    try {
      await jwtVerify(driverToken, SECRET_KEY);
      return NextResponse.redirect(new URL('/driver/dashboard', request.url));
    } catch {
      // Invalid token, allow access to login
    }
  }

  // Protect Driver APIs (except login/logout)
  if (pathname.startsWith('/api/driver') && !pathname.startsWith('/api/driver/auth/login')) {
    if (!driverToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Driver authentication required' },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(driverToken, SECRET_KEY);
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Token is invalid or expired' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/driver/:path*', '/api/driver/:path*'],
};
