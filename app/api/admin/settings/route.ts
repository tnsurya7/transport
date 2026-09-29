import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/adminAuthCheck';
import { getBusinessSettings, updateBusinessSettings } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const settings = await getBusinessSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await authenticateAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const updated = await updateBusinessSettings(body);
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Business settings updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
