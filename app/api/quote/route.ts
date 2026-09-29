import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateQuote } from '@/lib/dataService';

const QuoteSchema = z.object({
  pickup: z.object({
    address: z.string().optional().default(''),
    city: z.string().min(1, 'Pickup city is required'),
    district: z.string().optional().default(''),
    state: z.string().min(1, 'Pickup state is required'),
    pincode: z.string().optional().default(''),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  destination: z.object({
    address: z.string().optional().default(''),
    city: z.string().min(1, 'Destination city is required'),
    district: z.string().optional().default(''),
    state: z.string().min(1, 'Destination state is required'),
    pincode: z.string().optional().default(''),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  serviceId: z.string().min(1, 'Service is required'),
  loadCapacity: z.union([z.number(), z.string()]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = QuoteSchema.parse(body);

    if (
      validated.pickup.city.toLowerCase() === validated.destination.city.toLowerCase() &&
      validated.pickup.pincode === validated.destination.pincode &&
      validated.pickup.pincode !== ''
    ) {
      return NextResponse.json(
        { success: false, error: 'Pickup and Destination cannot be the exact same location.' },
        { status: 400 }
      );
    }

    const quoteResult = await calculateQuote({
      pickup: validated.pickup,
      destination: validated.destination,
      serviceId: validated.serviceId,
      loadCapacity: validated.loadCapacity,
    });

    return NextResponse.json({ success: true, data: quoteResult });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Invalid quotation parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate quote' },
      { status: 500 }
    );
  }
}
