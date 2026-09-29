import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { getAdminBookings } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const result = await getAdminBookings({ status, search, page, limit });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
