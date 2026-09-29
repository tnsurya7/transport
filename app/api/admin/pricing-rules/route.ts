import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { savePricingRule } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body.serviceId || !body.name || body.ratePerKm === undefined) {
      return NextResponse.json(
        { success: false, error: 'Service ID, rule name, and rate per KM are required' },
        { status: 400 }
      );
    }

    const created = await savePricingRule({
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
      data: created,
      message: 'Pricing rule created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create pricing rule' },
      { status: 500 }
    );
  }
}
