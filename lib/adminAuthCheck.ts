import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminJwt, AdminJwtPayload } from './auth';

export async function authenticateAdminRequest(
  request: NextRequest
): Promise<{ error?: NextResponse; admin?: AdminJwtPayload }> {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication token required' },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyAdminJwt(token);
  if (!payload) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  return { admin: payload };
}
