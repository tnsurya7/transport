import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { savePricingRule, deletePricingRule } from '@/lib/dataService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const updated = await savePricingRule({
      id: params.id,
      serviceId: body.serviceId,
      name: body.name,
      minLoad: body.minLoad !== undefined && body.minLoad !== '' ? parseFloat(body.minLoad) : null,
      maxLoad: body.maxLoad !== undefined && body.maxLoad !== '' ? parseFloat(body.maxLoad) : null,
      loadUnit: body.loadUnit || 'Ton',
      ratePerKm: parseFloat(body.ratePerKm),
      minDistanceKm: body.minDistanceKm ? parseFloat(body.minDistanceKm) : 0,
      minCharge: body.minCharge ? parseFloat(body.minCharge) : 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Pricing rule updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update pricing rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await deletePricingRule(params.id);
    return NextResponse.json({
      success: true,
      message: 'Pricing rule deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete pricing rule' },
      { status: 500 }
    );
  }
}
