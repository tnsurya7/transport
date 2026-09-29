import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { assignVehicleToBooking } from '@/lib/dataService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body.vehicleId) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const updated = await assignVehicleToBooking(params.id, body.vehicleId);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Vehicle assigned successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to assign vehicle' },
      { status: 500 }
    );
  }
}
