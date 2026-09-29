import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { confirmBooking } from '@/lib/dataService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const updated = await confirmBooking(params.id, body.adminNotes);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Booking confirmed successfully. Tracking ID generated: ${updated.trackingId}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}
