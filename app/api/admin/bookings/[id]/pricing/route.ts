import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { updateBookingPricing } from '@/lib/dataService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const updated = await updateBookingPricing(params.id, {
      loadingCharge: body.loadingCharge !== undefined ? parseFloat(body.loadingCharge) : undefined,
      unloadingCharge: body.unloadingCharge !== undefined ? parseFloat(body.unloadingCharge) : undefined,
      tollCharge: body.tollCharge !== undefined ? parseFloat(body.tollCharge) : undefined,
      waitingCharge: body.waitingCharge !== undefined ? parseFloat(body.waitingCharge) : undefined,
      otherCharges: body.otherCharges !== undefined ? parseFloat(body.otherCharges) : undefined,
      discount: body.discount !== undefined ? parseFloat(body.discount) : undefined,
      finalAmount: body.finalAmount !== undefined ? parseFloat(body.finalAmount) : undefined,
      adminNotes: body.adminNotes,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Pricing and additional charges updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update pricing' },
      { status: 500 }
    );
  }
}
