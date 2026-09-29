import { NextResponse } from 'next/server';
import { getActiveServices } from '@/lib/dataService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await getActiveServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
