import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { saveService, deleteService } from '@/lib/dataService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const updated = await saveService({
      id: params.id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      pricingType: body.pricingType,
      isActive: body.isActive,
      displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Service updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update service' },
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
    await deleteService(params.id);
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}
