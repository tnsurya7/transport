import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBooking } from '@/lib/dataService';

import { PHONE_REGEX, EMAIL_REGEX, cleanPhone } from '@/lib/validators';

const BookingSubmissionSchema = z.object({
  customerName: z.string().min(2, 'Please enter a valid full name (minimum 2 characters)'),
  customerPhone: z
    .string()
    .transform((val) => cleanPhone(val))
    .refine((val) => PHONE_REGEX.test(val), {
      message: 'Please provide a valid 10-digit Indian mobile number starting with 6-9',
    }),
  customerEmail: z
    .string()
    .trim()
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Please provide a valid official email address',
    }),
  customerLanguage: z.string().optional().default('en'),
  serviceId: z.string().min(1, 'Service is required'),
  loadCapacity: z.union([z.number(), z.string()]).optional(),
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
  customerNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = BookingSubmissionSchema.parse(body);

    const booking = await createBooking(validated);

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerName: validated.customerName,
        pickupCity: validated.pickup.city,
        destinationCity: validated.destination.city,
        distanceKm: booking.distanceKm,
        estimatedAmount: booking.estimatedAmount,
        status: booking.status,
        message: 'Booking received successfully. Our team will call you shortly.',
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit booking' },
      { status: 500 }
    );
  }
}
