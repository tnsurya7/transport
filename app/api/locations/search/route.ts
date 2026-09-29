import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/locations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const results = searchLocations(query);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
