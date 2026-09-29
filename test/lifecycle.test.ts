import { describe, it, expect } from 'vitest';
import {
  getActiveServices,
  calculateQuote,
  createBooking,
  confirmBooking,
  updateBookingStatus,
  getPublicTracking,
} from '../lib/dataService';

describe('Complete Transport Booking & Tracking Lifecycle', () => {
  it('executes full end-to-end guest booking and tracking flow', async () => {
    // 1. Get active dynamic services
    const services = await getActiveServices();
    expect(services.length).toBeGreaterThan(0);
    const cargoService = services.find((s) => s.slug === 'cargo-transport') || services[0];

    // 2. Calculate instant quote for Erode -> Coimbatore
    const pickup = {
      city: 'Erode',
      district: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638001',
      latitude: 11.341,
      longitude: 77.7172,
    };

    const destination = {
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
      latitude: 11.0168,
      longitude: 76.9558,
    };

    const quote = await calculateQuote({
      pickup,
      destination,
      serviceId: cargoService.id,
      loadCapacity: '2.5–5 Ton',
    });

    expect(quote.distanceKm).toBe(105);
    expect(quote.pricingRule.ratePerKm).toBe(40);
    expect(quote.estimatedAmount).toBe(4200);

    // 3. Guest submits booking
    const booking = await createBooking({
      customerName: 'Surya Kumar',
      customerPhone: '+919876543210',
      customerEmail: 'customer@example.com',
      customerLanguage: 'ta',
      serviceId: cargoService.id,
      pricingRuleId: quote.pricingRule.id,
      loadCapacity: '2.5–5.0 Ton (Medium Truck)',
      pickup,
      destination,
      customerNotes: 'Ground floor pickup',
    });


    expect(booking.bookingNumber).toMatch(/^BK-\d{4}-\w+$/);
    expect(booking.status).toBe('BOOKING_RECEIVED');
    expect(booking.serviceNameSnapshot).toBe(quote.service.name);
    expect(booking.rateSnapshot).toBe(40);
    expect(booking.estimatedAmount).toBe(4200);
    expect(booking.trackingId).toBeNull();

    // 4. Admin reviews and confirms booking -> Generates unique tracking ID
    const confirmed = await confirmBooking(booking.id, 'Confirmed by operations');
    expect(confirmed.status).toBe('CONFIRMED');
    expect(confirmed.trackingId).toMatch(/^TRP-ERD-\d{4}-\w+$/);

    // 5. Admin updates transit status
    const inTransit = await updateBookingStatus({
      bookingId: booking.id,
      status: 'IN_TRANSIT',
      message: 'Vehicle has passed Tirupur Bypass',
      location: 'Tirupur Toll',
    });
    expect(inTransit.status).toBe('IN_TRANSIT');

    // 6. Public Customer queries tracking portal
    const tracking = await getPublicTracking(confirmed.trackingId!);
    expect(tracking).not.toBeNull();
    expect(tracking?.bookingNumber).toBe(booking.bookingNumber);
    expect(tracking?.status).toBe('IN_TRANSIT');
    expect(tracking?.pickupCity).toBe('Erode');
    expect(tracking?.destinationCity).toBe('Coimbatore');
    expect(tracking?.distanceKm).toBe(105);
  });
});
