import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { getAdminDashboardStats } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const data = await getAdminDashboardStats();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load dashboard metrics' },
      { status: 500 }
    );
  }
}
