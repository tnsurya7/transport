import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { updateBookingStatus } from '@/lib/dataService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus({
      bookingId: params.id,
      status: body.status,
      message: body.message,
      location: body.location,
      updatedBy: auth.admin?.name || 'Admin',
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Status updated to ${body.status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}
