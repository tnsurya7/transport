import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { LOCATIONS_DATA } from '../lib/locations';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sabarisan Transport Comprehensive Database Seeding...');

  // ==========================================
  // 1. SEED SUPER ADMIN
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL || 'sabarisan5070@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'sabari5070';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Super Admin (Sabarisan Transport)',
      role: 'SUPER_ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
    },
    create: {
      email: adminEmail,
      name: 'Super Admin (Sabarisan Transport)',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
    },
  });
  console.log(`✅ 1. Super Admin Account: ${admin.email}`);

  // ==========================================
  // 2. SEED PREDEFINED SERVICES & PRICING RULES (FIXED AS SPECIFIED)
  // ==========================================
  const servicesData = [
    {
      name: 'Home Shifting',
      slug: 'home-shifting',
      description: 'Safe and hassle-free household goods relocation with careful handling and doorstep delivery.',
      icon: 'Home',
      pricingType: 'PER_KM',
      displayOrder: 1,
      rules: [
        { name: 'Standard Home Shifting', minLoad: null, maxLoad: null, loadUnit: 'Ton', ratePerKm: 40.0, minDistanceKm: 20, minCharge: 800 },
      ],
    },
    {
      name: 'Office Shifting',
      slug: 'office-shifting',
      description: 'Specialized corporate relocation for workstations, computers, office furniture, and documents.',
      icon: 'Building2',
      pricingType: 'PER_KM',
      displayOrder: 2,
      rules: [
        { name: 'Standard Office Shifting', minLoad: null, maxLoad: null, loadUnit: 'Ton', ratePerKm: 40.0, minDistanceKm: 20, minCharge: 800 },
      ],
    },
    {
      name: 'Cargo / Goods Transportation',
      slug: 'cargo-transport',
      description: 'Heavy duty, bulk commercial goods, textiles, agricultural produce, and raw material logistics.',
      icon: 'Truck',
      pricingType: 'LOAD_BASED',
      displayOrder: 3,
      rules: [
        { name: '2.5–5 Ton Capacity', minLoad: 2.5, maxLoad: 5.0, loadUnit: 'Ton', ratePerKm: 40.0, minDistanceKm: 25, minCharge: 1000 },
        { name: '5–10 Ton Capacity', minLoad: 5.1, maxLoad: 10.0, loadUnit: 'Ton', ratePerKm: 45.0, minDistanceKm: 25, minCharge: 1125 },
      ],
    },
  ];

  const seededServices: Record<string, any> = {};

  for (const s of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        icon: s.icon,
        pricingType: s.pricingType,
        displayOrder: s.displayOrder,
        isActive: true,
      },
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        pricingType: s.pricingType,
        displayOrder: s.displayOrder,
        isActive: true,
      },
    });

    seededServices[s.slug] = service;

    await prisma.pricingRule.deleteMany({ where: { serviceId: service.id } });
    for (const r of s.rules) {
      await prisma.pricingRule.create({
        data: {
          serviceId: service.id,
          name: r.name,
          minLoad: r.minLoad,
          maxLoad: r.maxLoad,
          loadUnit: r.loadUnit,
          ratePerKm: r.ratePerKm,
          minDistanceKm: r.minDistanceKm,
          minCharge: r.minCharge,
          isActive: true,
        },
      });
    }
  }
  console.log('✅ 2. Services and Dynamic Pricing Rules Seeded');

  // ==========================================
  // 3. SEED DRIVERS
  // ==========================================
  const driverPassword = 'Driver@2026';
  const driverSalt = await bcrypt.genSalt(10);
  const driverPasswordHash = await bcrypt.hash(driverPassword, driverSalt);

  const driversData = [
    { name: 'K. Senthil', phone: '9876543211', email: 'senthil.driver@sarisantransport.in', licenseNo: 'TN33-2018-0091845' },
    { name: 'M. Murugan', phone: '9876543212', email: 'murugan.driver@sarisantransport.in', licenseNo: 'TN33-2019-0044122' },
    { name: 'R. Selvam', phone: '9876543213', email: 'selvam.driver@sarisantransport.in', licenseNo: 'TN33-2020-0081294' },
    { name: 'P. Arumugam', phone: '9876543214', email: 'arumugam.driver@sarisantransport.in', licenseNo: 'TN33-2021-0033108' },
  ];

  const seededDrivers: any[] = [];
  for (const d of driversData) {
    const driver = await prisma.driver.upsert({
      where: { phone: d.phone },
      update: {
        name: d.name,
        email: d.email,
        passwordHash: driverPasswordHash,
        licenseNo: d.licenseNo,
        isActive: true,
        lastLoginAt: new Date(),
      },
      create: {
        name: d.name,
        phone: d.phone,
        email: d.email,
        passwordHash: driverPasswordHash,
        licenseNo: d.licenseNo,
        isActive: true,
        lastLoginAt: new Date(),
      },
    });
    seededDrivers.push(driver);
  }
  console.log(`✅ 3. ${seededDrivers.length} Professional Drivers Seeded`);

  // ==========================================
  // 4. SEED FLEET VEHICLES
  // ==========================================
  const vehiclesData = [
    { vehicleNumber: 'TN 33 BK 8844', vehicleType: 'Eicher 17ft Closed Container', capacity: '5 Ton', driverIndex: 0 },
    { vehicleNumber: 'TN 33 CX 5512', vehicleType: 'Tata 407 Medium Lorry', capacity: '2.5 Ton', driverIndex: 1 },
    { vehicleNumber: 'TN 33 AA 2026', vehicleType: 'Tata Ace Zip Mini Truck', capacity: '1 Ton', driverIndex: 2 },
    { vehicleNumber: 'TN 33 DL 9901', vehicleType: 'Ashok Leyland 24ft High Deck', capacity: '10 Ton', driverIndex: 3 },
    { vehicleNumber: 'TN 33 EM 7722', vehicleType: 'BharatBenz 28ft Multi-Axle Heavy', capacity: '16 Ton', driverIndex: null },
  ];

  const seededVehicles: any[] = [];
  for (const v of vehiclesData) {
    const assignedDriver = v.driverIndex !== null ? seededDrivers[v.driverIndex] : null;
    const vehicle = await prisma.vehicle.upsert({
      where: { vehicleNumber: v.vehicleNumber },
      update: {
        vehicleType: v.vehicleType,
        capacity: v.capacity,
        driverId: assignedDriver?.id || null,
        driverName: assignedDriver?.name || null,
        driverPhone: assignedDriver?.phone || null,
        isActive: true,
      },
      create: {
        vehicleNumber: v.vehicleNumber,
        vehicleType: v.vehicleType,
        capacity: v.capacity,
        driverId: assignedDriver?.id || null,
        driverName: assignedDriver?.name || null,
        driverPhone: assignedDriver?.phone || null,
        isActive: true,
      },
    });
    seededVehicles.push(vehicle);
  }
  console.log(`✅ 4. ${seededVehicles.length} Fleet Vehicles Seeded`);

  // ==========================================
  // 5. SEED CUSTOMERS
  // ==========================================
  const customersData = [
    { name: 'Surya Kumar', phone: '9876543210', email: 'suryakumar@example.com' },
    { name: 'Anand Natarajan', phone: '9842155432', email: 'anand.textiles@erode.in' },
    { name: 'Kavitha Srinivasan', phone: '9789012345', email: 'kavitha.s@gmail.com' },
    { name: 'Vignesh Balakrishnan', phone: '9443218765', email: 'vignesh.b@outlook.com' },
    { name: 'Lakshmi Priya', phone: '9894011223', email: 'lakshmi.p@yahoo.com' },
  ];

  const seededCustomers: any[] = [];
  for (const c of customersData) {
    let customer = await prisma.customer.findFirst({ where: { phone: c.phone } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: c.name,
          phone: c.phone,
          email: c.email,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { name: c.name, email: c.email },
      });
    }
    seededCustomers.push(customer);
  }
  console.log(`✅ 5. ${seededCustomers.length} Customers Seeded`);

  // ==========================================
  // 6. SEED BOOKINGS & TRACKING EVENTS
  // ==========================================
  const cargoRule = await prisma.pricingRule.findFirst({ where: { serviceId: seededServices['cargo-transport'].id } });
  const homeRule = await prisma.pricingRule.findFirst({ where: { serviceId: seededServices['home-shifting'].id } });
  const officeRule = await prisma.pricingRule.findFirst({ where: { serviceId: seededServices['office-shifting'].id } });

  const sampleBookings = [
    {
      bookingNumber: 'BK-2026-871889',
      trackingId: 'TRP-ERD-2026-762241',
      customer: seededCustomers[0],
      service: seededServices['cargo-transport'],
      pricingRule: cargoRule,
      pickupCity: 'Erode',
      pickupDistrict: 'Erode',
      pickupState: 'Tamil Nadu',
      pickupAddress: 'Perundurai Road, Near Collector Office, Erode',
      pickupPincode: '638011',
      pickupLatitude: 11.341,
      pickupLongitude: 77.7172,
      destinationCity: 'Coimbatore',
      destinationDistrict: 'Coimbatore',
      destinationState: 'Tamil Nadu',
      destinationAddress: 'Avinashi Road, Peelamedu, Coimbatore',
      destinationPincode: '641004',
      destinationLatitude: 11.0168,
      destinationLongitude: 76.9558,
      distanceKm: 105.0,
      serviceNameSnapshot: 'Cargo / Goods Transportation',
      rateSnapshot: 40.0,
      pricingRuleSnapshot: '2.5–5 Ton Capacity',
      baseAmount: 4200.0,
      loadingCharge: 500.0,
      unloadingCharge: 500.0,
      tollCharge: 240.0,
      waitingCharge: 0.0,
      otherCharges: 0.0,
      discount: 0.0,
      estimatedAmount: 4200.0,
      finalAmount: 5440.0,
      customerLanguage: 'ta',
      status: 'IN_TRANSIT',
      customerNotes: 'Ground floor pickup of textile fabric rolls. Urgent delivery required.',
      adminNotes: 'Assigned to Senthil with Eicher 17ft. Advance 50% received.',
      vehicle: seededVehicles[0],
      driver: seededDrivers[0],
      events: [
        { status: 'BOOKING_RECEIVED', message: 'Transport booking submitted by customer online.', location: 'Erode Central Hub', createdAt: new Date(Date.now() - 3600000 * 8) },
        { status: 'CONFIRMED', message: 'Booking confirmed by Operations Manager. Tracking ID issued.', location: 'Erode Central Hub', createdAt: new Date(Date.now() - 3600000 * 6) },
        { status: 'VEHICLE_ASSIGNED', message: 'Vehicle TN 33 BK 8844 and driver K. Senthil assigned.', location: 'Erode Yard', createdAt: new Date(Date.now() - 3600000 * 4) },
        { status: 'PICKUP_COMPLETED', message: 'Consignment loaded and departure from Erode pickup point.', location: 'Perundurai Road, Erode', createdAt: new Date(Date.now() - 3600000 * 2) },
        { status: 'IN_TRANSIT', message: 'Vehicle crossing Vijayamangalam Toll Plaza on NH-544.', location: 'Vijayamangalam Toll, NH-544', createdAt: new Date(Date.now() - 3600000 * 1) },
      ],
    },
    {
      bookingNumber: 'BK-2026-539099',
      trackingId: 'TRP-ERD-2026-775710',
      customer: seededCustomers[1],
      service: seededServices['home-shifting'],
      pricingRule: homeRule,
      pickupCity: 'Erode',
      pickupDistrict: 'Erode',
      pickupState: 'Tamil Nadu',
      pickupAddress: 'Bhavani Main Road, R.N. Pudur, Erode',
      pickupPincode: '638005',
      pickupLatitude: 11.352,
      pickupLongitude: 77.728,
      destinationCity: 'Bengaluru',
      destinationDistrict: 'Bengaluru Urban',
      destinationState: 'Karnataka',
      destinationAddress: 'Electronic City Phase 1, Bengaluru',
      destinationPincode: '560100',
      destinationLatitude: 12.8452,
      destinationLongitude: 77.6602,
      distanceKm: 260.0,
      serviceNameSnapshot: 'Home Shifting',
      rateSnapshot: 40.0,
      pricingRuleSnapshot: 'Standard Home Shifting',
      baseAmount: 10400.0,
      loadingCharge: 1200.0,
      unloadingCharge: 1200.0,
      tollCharge: 480.0,
      waitingCharge: 0.0,
      otherCharges: 0.0,
      discount: 500.0,
      estimatedAmount: 10400.0,
      finalAmount: 12780.0,
      customerLanguage: 'en',
      status: 'CONFIRMED',
      customerNotes: 'Fragile items: 55-inch TV and glass dining table. Extra bubble wrap required.',
      adminNotes: 'Customer requested morning 8 AM packing team.',
      vehicle: seededVehicles[1],
      driver: seededDrivers[1],
      events: [
        { status: 'BOOKING_RECEIVED', message: 'Household shifting inquiry received.', location: 'Erode Hub', createdAt: new Date(Date.now() - 3600000 * 12) },
        { status: 'CONFIRMED', message: 'Schedule finalized for tomorrow morning. Tracking ID issued.', location: 'Erode Hub', createdAt: new Date(Date.now() - 3600000 * 5) },
      ],
    },
    {
      bookingNumber: 'BK-2026-371952',
      trackingId: 'TRP-ERD-2026-470189',
      customer: seededCustomers[2],
      service: seededServices['office-shifting'],
      pricingRule: officeRule,
      pickupCity: 'Salem',
      pickupDistrict: 'Salem',
      pickupState: 'Tamil Nadu',
      pickupAddress: 'Omalur Main Road, Five Roads, Salem',
      pickupPincode: '636004',
      pickupLatitude: 11.6643,
      pickupLongitude: 78.146,
      destinationCity: 'Chennai',
      destinationDistrict: 'Chennai',
      destinationState: 'Tamil Nadu',
      destinationAddress: 'OMR IT Corridor, Thoraipakkam, Chennai',
      destinationPincode: '600097',
      destinationLatitude: 12.9348,
      destinationLongitude: 80.2289,
      distanceKm: 345.0,
      serviceNameSnapshot: 'Office Shifting',
      rateSnapshot: 40.0,
      pricingRuleSnapshot: 'Standard Office Shifting',
      baseAmount: 13800.0,
      loadingCharge: 2000.0,
      unloadingCharge: 2000.0,
      tollCharge: 650.0,
      waitingCharge: 0.0,
      otherCharges: 0.0,
      discount: 1000.0,
      estimatedAmount: 13800.0,
      finalAmount: 17450.0,
      customerLanguage: 'en',
      status: 'DELIVERED',
      customerNotes: '25 desktop computers and office modular tables.',
      adminNotes: 'Completed smoothly on schedule. Full payment cleared.',
      vehicle: seededVehicles[3],
      driver: seededDrivers[3],
      events: [
        { status: 'BOOKING_RECEIVED', message: 'Corporate shifting request logged.', location: 'Salem Yard', createdAt: new Date(Date.now() - 3600000 * 48) },
        { status: 'CONFIRMED', message: 'Order approved and insurance verified.', location: 'Erode Operations Desk', createdAt: new Date(Date.now() - 3600000 * 40) },
        { status: 'VEHICLE_ASSIGNED', message: 'Ashok Leyland 24ft High Deck assigned with P. Arumugam.', location: 'Salem Hub', createdAt: new Date(Date.now() - 3600000 * 36) },
        { status: 'PICKUP_COMPLETED', message: 'Office equipment loaded securely.', location: 'Five Roads, Salem', createdAt: new Date(Date.now() - 3600000 * 24) },
        { status: 'IN_TRANSIT', message: 'Passing Chengalpattu Toll Plaza on GST Road.', location: 'Chengalpattu Toll', createdAt: new Date(Date.now() - 3600000 * 10) },
        { status: 'OUT_FOR_DELIVERY', message: 'Vehicle entered Chennai OMR IT Corridor.', location: 'OMR, Chennai', createdAt: new Date(Date.now() - 3600000 * 4) },
        { status: 'DELIVERED', message: 'Shipment delivered and handed over safely.', location: 'Thoraipakkam, Chennai', createdAt: new Date(Date.now() - 3600000 * 1) },
      ],
    },
    {
      bookingNumber: 'BK-2026-956508',
      trackingId: null,
      customer: seededCustomers[3],
      service: seededServices['cargo-transport'],
      pricingRule: cargoRule,
      pickupCity: 'Tirupur',
      pickupDistrict: 'Tirupur',
      pickupState: 'Tamil Nadu',
      pickupAddress: 'Palladam Road, Veerapandi, Tirupur',
      pickupPincode: '641605',
      pickupLatitude: 11.1085,
      pickupLongitude: 77.3411,
      destinationCity: 'Kochi',
      destinationDistrict: 'Ernakulam',
      destinationState: 'Kerala',
      destinationAddress: 'Willingdon Island, Port Area, Kochi',
      destinationPincode: '682003',
      destinationLatitude: 9.9674,
      destinationLongitude: 76.2711,
      distanceKm: 220.0,
      serviceNameSnapshot: 'Cargo / Goods Transportation',
      rateSnapshot: 45.0,
      pricingRuleSnapshot: '5–10 Ton Capacity',
      baseAmount: 9900.0,
      loadingCharge: 0.0,
      unloadingCharge: 0.0,
      tollCharge: 0.0,
      waitingCharge: 0.0,
      otherCharges: 0.0,
      discount: 0.0,
      estimatedAmount: 9900.0,
      finalAmount: null,
      customerLanguage: 'ml',
      status: 'BOOKING_RECEIVED',
      customerNotes: 'Garment export cartons for port container loading. Needs confirmation call.',
      adminNotes: null,
      vehicle: null,
      driver: null,
      events: [
        { status: 'BOOKING_RECEIVED', message: 'Guest booking received. Operations review pending.', location: 'Tirupur Desk', createdAt: new Date(Date.now() - 3600000 * 2) },
      ],
    },
  ];

  for (const b of sampleBookings) {
    const existing = await prisma.booking.findUnique({ where: { bookingNumber: b.bookingNumber } });
    if (existing) {
      await prisma.trackingEvent.deleteMany({ where: { bookingId: existing.id } });
      await prisma.booking.delete({ where: { id: existing.id } });
    }

    const createdBooking = await prisma.booking.create({
      data: {
        bookingNumber: b.bookingNumber,
        trackingId: b.trackingId,
        customerId: b.customer.id,
        serviceId: b.service.id,
        pricingRuleId: b.pricingRule?.id || null,
        pickupAddress: b.pickupAddress,
        pickupCity: b.pickupCity,
        pickupDistrict: b.pickupDistrict,
        pickupState: b.pickupState,
        pickupPincode: b.pickupPincode,
        pickupLatitude: b.pickupLatitude,
        pickupLongitude: b.pickupLongitude,
        destinationAddress: b.destinationAddress,
        destinationCity: b.destinationCity,
        destinationDistrict: b.destinationDistrict,
        destinationState: b.destinationState,
        destinationPincode: b.destinationPincode,
        destinationLatitude: b.destinationLatitude,
        destinationLongitude: b.destinationLongitude,
        distanceKm: b.distanceKm,
        serviceNameSnapshot: b.serviceNameSnapshot,
        rateSnapshot: b.rateSnapshot,
        pricingRuleSnapshot: b.pricingRuleSnapshot,
        baseAmount: b.baseAmount,
        loadingCharge: b.loadingCharge,
        unloadingCharge: b.unloadingCharge,
        tollCharge: b.tollCharge,
        waitingCharge: b.waitingCharge,
        otherCharges: b.otherCharges,
        discount: b.discount,
        estimatedAmount: b.estimatedAmount,
        finalAmount: b.finalAmount,
        customerLanguage: b.customerLanguage,
        status: b.status,
        customerNotes: b.customerNotes,
        adminNotes: b.adminNotes,
        vehicleId: b.vehicle?.id || null,
        driverId: b.driver?.id || null,
      },
    });

    for (const evt of b.events) {
      await prisma.trackingEvent.create({
        data: {
          bookingId: createdBooking.id,
          status: evt.status,
          message: evt.message,
          location: evt.location,
          updatedBy: 'Operations Dispatch',
          createdAt: evt.createdAt,
        },
      });
    }
  }
  console.log(`✅ 6. Sample Live Bookings & Checkpoint Timeline Events Seeded`);

  // ==========================================
  // 7. SEED BUSINESS SETTINGS
  // ==========================================
  const settingsData = [
    { key: 'business_name', value: process.env.BUSINESS_NAME || 'Sabarisan Transport', description: 'Official Registered Business Name' },
    { key: 'business_address', value: process.env.BUSINESS_ADDRESS || 'Near Bus Stand, Bhavani Main Road, Erode, Tamil Nadu 638004', description: 'Central Headquarters & Yard Address' },
    { key: 'owner_email', value: process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL || 'sabarisan5070@gmail.com', description: 'Primary Owner Notification Email' },
    { key: 'owner_phone', value: process.env.OWNER_PHONE || '+919876543210', description: '24/7 Helpline Phone Number' },
    { key: 'owner_whatsapp', value: process.env.OWNER_WHATSAPP || '919876543210', description: 'Official WhatsApp Business Number' },
    { key: 'service_areas', value: 'Tamil Nadu (All 38 Districts), Karnataka (All 31 Districts), Kerala (All 14 Districts)', description: 'Operational Geographic Coverage' },
    { key: 'gst_number', value: '33AABCU9603R1ZM', description: 'GST Identification Number (Tamil Nadu)' },
    { key: 'support_hours', value: '24 Hours / 7 Days Live Dispatch Support', description: 'Yard Operational Hours' },
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
  }
  console.log('✅ 7. Business Profile & Operational Settings Seeded');

  // ==========================================
  // 8. SEED MAJOR LOCATIONS (TN, KA, KL)
  // ==========================================
  for (const loc of LOCATIONS_DATA) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {
        state: loc.state,
        district: loc.district,
        city: loc.name,
        pincode: loc.pincode,
        latitude: loc.latitude,
        longitude: loc.longitude,
        isActive: true,
      },
      create: {
        id: loc.id,
        state: loc.state,
        district: loc.district,
        city: loc.name,
        pincode: loc.pincode,
        latitude: loc.latitude,
        longitude: loc.longitude,
        isActive: true,
      },
    });
  }
  console.log(`✅ 8. ${LOCATIONS_DATA.length} Regional Hub Locations Seeded`);

  // ==========================================
  // 9. SEED AUDIT LOGS
  // ==========================================
  const sampleAuditLogs = [
    { action: 'ADMIN_LOGIN', entity: 'Admin', entityId: admin.id, metadata: JSON.stringify({ ip: '127.0.0.1', email: admin.email }) },
    { action: 'SYSTEM_INIT', entity: 'System', entityId: null, metadata: JSON.stringify({ version: '1.0.0', fleetUnits: seededVehicles.length }) },
    { action: 'DISPATCH_ASSIGNMENT', entity: 'Booking', entityId: 'BK-2026-871889', metadata: JSON.stringify({ vehicle: 'TN 33 BK 8844', driver: 'K. Senthil' }) },
  ];

  for (const log of sampleAuditLogs) {
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        metadata: log.metadata,
      },
    });
  }
  console.log(`✅ 9. Audit Logs Seeded`);

  // ==========================================
  // 10. SEED EMAIL LOGS
  // ==========================================
  const sampleEmailLogs = [
    { type: 'OWNER_NEW_BOOKING', recipient: adminEmail, status: 'SENT', providerMessageId: 'msg-init-001' },
    { type: 'CUSTOMER_CONFIRMATION', recipient: seededCustomers[0].email, status: 'SENT', providerMessageId: 'msg-init-002' },
  ];

  for (const eml of sampleEmailLogs) {
    await prisma.emailLog.create({
      data: {
        type: eml.type,
        recipient: eml.recipient,
        status: eml.status,
        providerMessageId: eml.providerMessageId,
      },
    });
  }
  console.log(`✅ 10. Email Notification Logs Seeded`);

  console.log('🎉 ==============================================');
  console.log('🎉 ALL DATABASE MODELS & FIELDS SEEDED 100%!');
  console.log('🎉 ==============================================');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
