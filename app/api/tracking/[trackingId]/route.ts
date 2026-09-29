import { NextRequest, NextResponse } from 'next/server';
import { getPublicTracking } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = params;
    if (!trackingId || trackingId.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID or Booking number is required' },
        { status: 400 }
      );
    }

    const trackingData = await getPublicTracking(trackingId);

    if (!trackingData) {
      return NextResponse.json(
        { success: false, error: 'No shipment found matching the provided ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trackingData });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve tracking data' },
      { status: 500 }
    );
  }
}
