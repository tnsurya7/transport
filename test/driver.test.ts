import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword, signDriverJwt, verifyDriverJwt } from '../lib/auth';

describe('Driver Portal & Fleet Assignment Lifecycle', () => {
  let testDriver: any;
  let testVehicle: any;
  let testCustomer: any;
  let testBooking: any;

  beforeAll(async () => {
    // 1. Create a test driver
    const pwdHash = await hashPassword('Driver@2026');
    testDriver = await prisma.driver.create({
      data: {
        name: 'Murugan Test Driver',
        phone: '9876599999',
        email: 'murugan.test@sarisantransport.in',
        passwordHash: pwdHash,
        licenseNo: 'TN33-2022-009988',
        isActive: true,
      },
    });

    // 2. Create a test vehicle linked to driver
    testVehicle = await prisma.vehicle.create({
      data: {
        vehicleNumber: 'TN 33 TEST 9999',
        vehicleType: 'Eicher 19ft Closed Container',
        capacity: '6 Ton',
        driverId: testDriver.id,
        driverName: testDriver.name,
        driverPhone: testDriver.phone,
        isActive: true,
      },
    });

    // 3. Create test customer
    testCustomer = await prisma.customer.create({
      data: {
        name: 'Kumar Consignee',
        phone: '+919876511111',
        email: 'kumar@example.com',
      },
    });

    // 4. Fetch an active service
    const service = await prisma.service.findFirst({ where: { isActive: true } });

    // 5. Create a booking in BOOKING_RECEIVED state
    testBooking = await prisma.booking.create({
      data: {
        bookingNumber: 'BK-2026-TESTDRIVER',
        customerId: testCustomer.id,
        serviceId: service!.id,
        pickupAddress: 'Bhavani Road Industrial Estate',
        pickupCity: 'Erode',
        pickupDistrict: 'Erode',
        pickupState: 'Tamil Nadu',
        pickupPincode: '638004',
        destinationAddress: 'Electronic City Phase 1',
        destinationCity: 'Bengaluru',
        destinationDistrict: 'Bengaluru Urban',
        destinationState: 'Karnataka',
        destinationPincode: '560100',
        distanceKm: 260,
        serviceNameSnapshot: service!.name,
        rateSnapshot: 40,
        baseAmount: 10400,
        estimatedAmount: 10400,
        status: 'BOOKING_RECEIVED',
        vehicleId: testVehicle.id,
        driverId: testDriver.id,
      },
    });
  });

  afterAll(async () => {
    if (testBooking) {
      await prisma.trackingEvent.deleteMany({ where: { bookingId: testBooking.id } });
      await prisma.booking.delete({ where: { id: testBooking.id } });
    }
    if (testVehicle) {
      await prisma.vehicle.delete({ where: { id: testVehicle.id } });
    }
    if (testDriver) {
      await prisma.driver.delete({ where: { id: testDriver.id } });
    }
    if (testCustomer) {
      await prisma.customer.delete({ where: { id: testCustomer.id } });
    }
  });

  it('verifies driver credentials and generates valid driver JWT session', async () => {
    const isMatch = await verifyPassword('Driver@2026', testDriver.passwordHash);
    expect(isMatch).toBe(true);

    const token = await signDriverJwt({
      id: testDriver.id,
      phone: testDriver.phone,
      name: testDriver.name,
      role: 'DRIVER',
    });

    const payload = await verifyDriverJwt(token);
    expect(payload).not.toBeNull();
    expect(payload?.id).toBe(testDriver.id);
    expect(payload?.phone).toBe('9876599999');
  });

  it('hides unconfirmed BOOKING_RECEIVED orders from driver trip list', async () => {
    const unconfirmedOrders = await prisma.booking.findMany({
      where: {
        driverId: testDriver.id,
        status: { not: 'BOOKING_RECEIVED' },
      },
    });

    // Unconfirmed order should NOT be returned
    expect(unconfirmedOrders.length).toBe(0);
  });

  it('shows order to driver once confirmed by admin and allows checkpoint location updates', async () => {
    // Admin confirms order
    await prisma.booking.update({
      where: { id: testBooking.id },
      data: {
        status: 'CONFIRMED',
        trackingId: 'TRP-ERD-2026-TEST99',
      },
    });

    // Driver fetches assigned trips
    const assignedTrips = await prisma.booking.findMany({
      where: {
        driverId: testDriver.id,
        status: { not: 'BOOKING_RECEIVED' },
      },
      include: { customer: true, vehicle: true },
    });

    expect(assignedTrips.length).toBe(1);
    expect(assignedTrips[0].customer.name).toBe('Kumar Consignee');
    expect(assignedTrips[0].pickupCity).toBe('Erode');
    expect(assignedTrips[0].destinationCity).toBe('Bengaluru');

    // Driver updates status to IN_TRANSIT with location checkpoint
    await prisma.booking.update({
      where: { id: testBooking.id },
      data: { status: 'IN_TRANSIT' },
    });

    const evt = await prisma.trackingEvent.create({
      data: {
        bookingId: testBooking.id,
        status: 'IN_TRANSIT',
        location: 'Salem - Dharmapuri Toll Plaza Checkpoint',
        message: 'Goods in transit on NH44 highway corridor.',
        updatedBy: `Driver: ${testDriver.name}`,
      },
    });

    expect(evt.location).toBe('Salem - Dharmapuri Toll Plaza Checkpoint');
    expect(evt.updatedBy).toBe('Driver: Murugan Test Driver');
  });
});
