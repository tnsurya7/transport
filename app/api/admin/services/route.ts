import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { getAllServicesAdmin, saveService } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const services = await getAllServicesAdmin();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const created = await saveService({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon || 'Truck',
      pricingType: body.pricingType || 'PER_KM',
      isActive: body.isActive !== undefined ? body.isActive : true,
      displayOrder: body.displayOrder ? parseInt(body.displayOrder, 10) : 0,
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Service created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}
