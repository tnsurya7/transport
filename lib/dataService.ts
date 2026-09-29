import prisma from './prisma';
import { generateBookingNumber, generateTrackingId } from './identifiers';
import { calculateTransportPrice, matchPricingRule } from './pricing';
import { calculateRouteDistance, LocationInfo } from './googleMaps';
import {
  sendBookingEmails,
  sendConfirmationEmail,
  sendDriverAssignmentEmail,
  sendDeliveryCompletedEmail,
} from './email';


export interface ServiceWithRules {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  pricingType: 'PER_KM' | 'LOAD_BASED' | 'FLAT';
  isActive: boolean;
  displayOrder: number;
  pricingRules: {
    id: string;
    serviceId: string;
    name: string;
    minLoad: number | null;
    maxLoad: number | null;
    loadUnit: string | null;
    ratePerKm: number;
    minDistanceKm: number;
    minCharge: number;
    isActive: boolean;
  }[];
}

// Initial in-memory seed stores for seamless operation and testing
let inMemoryServices: ServiceWithRules[] = [
  {
    id: 'srv-home-01',
    name: 'Home Shifting',
    slug: 'home-shifting',
    description: 'Safe and hassle-free household goods transportation with careful handling.',
    icon: 'Home',
    pricingType: 'PER_KM',
    isActive: true,
    displayOrder: 1,
    pricingRules: [
      {
        id: 'rule-home-01',
        serviceId: 'srv-home-01',
        name: 'Standard Home Shifting',
        minLoad: null,
        maxLoad: null,
        loadUnit: 'Ton',
        ratePerKm: 40,
        minDistanceKm: 20,
        minCharge: 800,
        isActive: true,
      },
    ],
  },
  {
    id: 'srv-office-02',
    name: 'Office Shifting',
    slug: 'office-shifting',
    description: 'Specialized commercial relocation for computers, furniture, and documents.',
    icon: 'Building2',
    pricingType: 'PER_KM',
    isActive: true,
    displayOrder: 2,
    pricingRules: [
      {
        id: 'rule-office-01',
        serviceId: 'srv-office-02',
        name: 'Standard Office Shifting',
        minLoad: null,
        maxLoad: null,
        loadUnit: 'Ton',
        ratePerKm: 40,
        minDistanceKm: 20,
        minCharge: 800,
        isActive: true,
      },
    ],
  },
  {
    id: 'srv-cargo-03',
    name: 'Cargo / Goods Transportation',
    slug: 'cargo-transport',
    description: 'Heavy duty, bulk goods, and commercial raw material logistics.',
    icon: 'Truck',
    pricingType: 'LOAD_BASED',
    isActive: true,
    displayOrder: 3,
    pricingRules: [
      {
        id: 'rule-cargo-01',
        serviceId: 'srv-cargo-03',
        name: '2.5–5 Ton Capacity',
        minLoad: 2.5,
        maxLoad: 5.0,
        loadUnit: 'Ton',
        ratePerKm: 40,
        minDistanceKm: 25,
        minCharge: 1000,
        isActive: true,
      },
      {
        id: 'rule-cargo-02',
        serviceId: 'srv-cargo-03',
        name: '5–10 Ton Capacity',
        minLoad: 5.1,
        maxLoad: 10.0,
        loadUnit: 'Ton',
        ratePerKm: 45,
        minDistanceKm: 25,
        minCharge: 1125,
        isActive: true,
      },
    ],
  },
];

let inMemoryBookings: any[] = [];
let inMemoryTrackingEvents: any[] = [];
let inMemoryVehicles: any[] = [
  {
    id: 'veh-01',
    vehicleNumber: 'TN 33 BK 8844',
    vehicleType: 'Eicher 17ft',
    capacity: '5 Ton',
    driverName: 'Karthik V.',
    driverPhone: '+919443210987',
    isActive: true,
  },
  {
    id: 'veh-02',
    vehicleNumber: 'TN 33 CX 5512',
    vehicleType: 'Tata 407',
    capacity: '2.5 Ton',
    driverName: 'Ramesh Kumar',
    driverPhone: '+919876543211',
    isActive: true,
  },
];

let inMemorySettings: Record<string, string> = {
  business_name: 'Sabarisan Transport',
  business_address: 'Near Bus Stand, Bhavani Main Road, Erode, Tamil Nadu 638004',
  owner_email: 'owner@erodetransport.in',
  owner_phone: '+919876543210',
  owner_whatsapp: '919876543210',
  service_areas: 'Tamil Nadu, Karnataka, Kerala',
  minimum_charge: '800',
};

/**
 * Fetch all active services with their pricing rules
 */
export async function getActiveServices(): Promise<ServiceWithRules[]> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        pricingRules: {
          where: { isActive: true },
          orderBy: { ratePerKm: 'asc' },
        },
      },
    });

    if (services && services.length > 0) {
      return services as unknown as ServiceWithRules[];
    }
  } catch (err) {
    // Database fallback
  }

  return inMemoryServices.filter((s) => s.isActive);
}

/**
 * Fetch all services for admin (including inactive)
 */
export async function getAllServicesAdmin(): Promise<ServiceWithRules[]> {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        pricingRules: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (services && services.length > 0) {
      return services as unknown as ServiceWithRules[];
    }
  } catch (err) {
    // Database fallback
  }

  return inMemoryServices;
}

/**
 * Create or update service in Admin
 */
export async function saveService(serviceData: {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  icon?: string;
  pricingType: 'PER_KM' | 'LOAD_BASED' | 'FLAT';
  isActive: boolean;
  displayOrder?: number;
}) {
  const slug =
    serviceData.slug ||
    serviceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    if (serviceData.id) {
      const updated = await prisma.service.update({
        where: { id: serviceData.id },
        data: {
          name: serviceData.name,
          slug,
          description: serviceData.description,
          icon: serviceData.icon || 'Truck',
          pricingType: serviceData.pricingType,
          isActive: serviceData.isActive,
          displayOrder: serviceData.displayOrder ?? 0,
        },
        include: { pricingRules: true },
      });
      return updated;
    } else {
      const created = await prisma.service.create({
        data: {
          name: serviceData.name,
          slug,
          description: serviceData.description,
          icon: serviceData.icon || 'Truck',
          pricingType: serviceData.pricingType,
          isActive: serviceData.isActive,
          displayOrder: serviceData.displayOrder ?? 0,
        },
        include: { pricingRules: true },
      });
      return created;
    }
  } catch (err) {
    // Fallback store
    if (serviceData.id) {
      const idx = inMemoryServices.findIndex((s) => s.id === serviceData.id);
      if (idx !== -1) {
        inMemoryServices[idx] = {
          ...inMemoryServices[idx],
          name: serviceData.name,
          slug,
          description: serviceData.description,
          icon: serviceData.icon || inMemoryServices[idx].icon,
          pricingType: serviceData.pricingType,
          isActive: serviceData.isActive,
          displayOrder: serviceData.displayOrder ?? inMemoryServices[idx].displayOrder,
        };
        return inMemoryServices[idx];
      }
    }
    const newService: ServiceWithRules = {
      id: `srv-${Date.now()}`,
      name: serviceData.name,
      slug,
      description: serviceData.description,
      icon: serviceData.icon || 'Truck',
      pricingType: serviceData.pricingType,
      isActive: serviceData.isActive,
      displayOrder: serviceData.displayOrder ?? inMemoryServices.length + 1,
      pricingRules: [],
    };
    inMemoryServices.push(newService);
    return newService;
  }
}

/**
 * Delete service
 */
export async function deleteService(serviceId: string) {
  try {
    await prisma.service.delete({ where: { id: serviceId } });
    return true;
  } catch (err) {
    inMemoryServices = inMemoryServices.filter((s) => s.id !== serviceId);
    return true;
  }
}

/**
 * Save / Update Pricing Rule
 */
export async function savePricingRule(ruleData: {
  id?: string;
  serviceId: string;
  name: string;
  minLoad?: number | null;
  maxLoad?: number | null;
  loadUnit?: string;
  ratePerKm: number;
  minDistanceKm?: number;
  minCharge?: number;
  isActive: boolean;
}) {
  try {
    if (ruleData.id) {
      return await prisma.pricingRule.update({
        where: { id: ruleData.id },
        data: {
          name: ruleData.name,
          minLoad: ruleData.minLoad ?? null,
          maxLoad: ruleData.maxLoad ?? null,
          loadUnit: ruleData.loadUnit ?? 'Ton',
          ratePerKm: ruleData.ratePerKm,
          minDistanceKm: ruleData.minDistanceKm ?? 0,
          minCharge: ruleData.minCharge ?? 0,
          isActive: ruleData.isActive,
        },
      });
    } else {
      return await prisma.pricingRule.create({
        data: {
          serviceId: ruleData.serviceId,
          name: ruleData.name,
          minLoad: ruleData.minLoad ?? null,
          maxLoad: ruleData.maxLoad ?? null,
          loadUnit: ruleData.loadUnit ?? 'Ton',
          ratePerKm: ruleData.ratePerKm,
          minDistanceKm: ruleData.minDistanceKm ?? 0,
          minCharge: ruleData.minCharge ?? 0,
          isActive: ruleData.isActive,
        },
      });
    }
  } catch (err) {
    const srv = inMemoryServices.find((s) => s.id === ruleData.serviceId);
    if (!srv) throw new Error('Service not found');

    if (ruleData.id) {
      const ruleIdx = srv.pricingRules.findIndex((r) => r.id === ruleData.id);
      if (ruleIdx !== -1) {
        srv.pricingRules[ruleIdx] = {
          ...srv.pricingRules[ruleIdx],
          name: ruleData.name,
          minLoad: ruleData.minLoad ?? null,
          maxLoad: ruleData.maxLoad ?? null,
          loadUnit: ruleData.loadUnit ?? 'Ton',
          ratePerKm: ruleData.ratePerKm,
          minDistanceKm: ruleData.minDistanceKm ?? 0,
          minCharge: ruleData.minCharge ?? 0,
          isActive: ruleData.isActive,
        };
        return srv.pricingRules[ruleIdx];
      }
    }

    const newRule = {
      id: `rule-${Date.now()}`,
      serviceId: ruleData.serviceId,
      name: ruleData.name,
      minLoad: ruleData.minLoad ?? null,
      maxLoad: ruleData.maxLoad ?? null,
      loadUnit: ruleData.loadUnit ?? 'Ton',
      ratePerKm: ruleData.ratePerKm,
      minDistanceKm: ruleData.minDistanceKm ?? 0,
      minCharge: ruleData.minCharge ?? 0,
      isActive: ruleData.isActive,
    };
    srv.pricingRules.push(newRule);
    return newRule;
  }
}

/**
 * Delete Pricing Rule
 */
export async function deletePricingRule(ruleId: string) {
  try {
    await prisma.pricingRule.delete({ where: { id: ruleId } });
    return true;
  } catch (err) {
    for (const s of inMemoryServices) {
      s.pricingRules = s.pricingRules.filter((r) => r.id !== ruleId);
    }
    return true;
  }
}

/**
 * Quotation Calculation Service
 */
export async function calculateQuote(params: {
  pickup: LocationInfo;
  destination: LocationInfo;
  serviceId: string;
  loadCapacity?: number | string;
}) {
  const services = await getActiveServices();
  const service = services.find((s) => s.id === params.serviceId || s.slug === params.serviceId);

  if (!service) {
    throw new Error('Service not found or currently inactive');
  }

  const matchedRule = matchPricingRule(service.pricingRules, params.loadCapacity);
  if (!matchedRule) {
    throw new Error('No pricing rule found for selected service and load configuration');
  }

  const route = await calculateRouteDistance(params.pickup, params.destination);
  const pricing = calculateTransportPrice({
    distanceKm: route.distanceKm,
    ratePerKm: matchedRule.ratePerKm,
    minDistanceKm: matchedRule.minDistanceKm,
    minCharge: matchedRule.minCharge,
  });

  return {
    service: {
      id: service.id,
      name: service.name,
      slug: service.slug,
      icon: service.icon,
    },
    pricingRule: {
      id: matchedRule.id,
      name: matchedRule.name,
      ratePerKm: matchedRule.ratePerKm,
      minDistanceKm: matchedRule.minDistanceKm,
    },
    pickup: params.pickup,
    destination: params.destination,
    distanceKm: route.distanceKm,
    durationText: route.durationText,
    isRoadDistance: route.isRoadDistance,
    breakdown: pricing,
    estimatedAmount: pricing.totalEstimatedAmount,
  };
}

/**
 * Create Guest Booking with rate snapshot & automated emails
 */
export async function createBooking(data: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerLanguage?: string;
  serviceId: string;
  pricingRuleId?: string;
  loadCapacity?: number | string;
  pickup: LocationInfo;
  destination: LocationInfo;
  customerNotes?: string;
}) {
  const quote = await calculateQuote({
    pickup: data.pickup,
    destination: data.destination,
    serviceId: data.serviceId,
    loadCapacity: data.loadCapacity,
  });

  const bookingNumber = generateBookingNumber();
  const lang = data.customerLanguage || 'en';

  const bookingRecord = {
    id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookingNumber,
    trackingId: null,
    customer: {
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
    },
    serviceId: quote.service.id,
    pricingRuleId: quote.pricingRule.id,
    pickupAddress: data.pickup.address || `${data.pickup.city}, ${data.pickup.state}`,
    pickupCity: data.pickup.city,
    pickupDistrict: data.pickup.district,
    pickupState: data.pickup.state,
    pickupPincode: data.pickup.pincode,
    pickupLatitude: data.pickup.latitude ?? null,
    pickupLongitude: data.pickup.longitude ?? null,

    destinationAddress: data.destination.address || `${data.destination.city}, ${data.destination.state}`,
    destinationCity: data.destination.city,
    destinationDistrict: data.destination.district,
    destinationState: data.destination.state,
    destinationPincode: data.destination.pincode,
    destinationLatitude: data.destination.latitude ?? null,
    destinationLongitude: data.destination.longitude ?? null,

    distanceKm: quote.distanceKm,
    serviceNameSnapshot: quote.service.name,
    rateSnapshot: quote.pricingRule.ratePerKm,
    pricingRuleSnapshot: quote.pricingRule.name,

    baseAmount: quote.breakdown.baseAmount,
    loadingCharge: 0,
    unloadingCharge: 0,
    tollCharge: 0,
    waitingCharge: 0,
    otherCharges: 0,
    discount: 0,
    estimatedAmount: quote.estimatedAmount,
    finalAmount: null,

    customerLanguage: lang,
    status: 'BOOKING_RECEIVED',
    customerNotes: data.customerNotes || null,
    adminNotes: null,
    vehicleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    // Check or create customer in Prisma
    let customer = await prisma.customer.findFirst({
      where: { phone: data.customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail,
        },
      });
    }

    const created = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        serviceId: quote.service.id,
        pricingRuleId: quote.pricingRule.id,
        pickupAddress: bookingRecord.pickupAddress,
        pickupCity: bookingRecord.pickupCity,
        pickupDistrict: bookingRecord.pickupDistrict,
        pickupState: bookingRecord.pickupState,
        pickupPincode: bookingRecord.pickupPincode,
        pickupLatitude: bookingRecord.pickupLatitude,
        pickupLongitude: bookingRecord.pickupLongitude,
        destinationAddress: bookingRecord.destinationAddress,
        destinationCity: bookingRecord.destinationCity,
        destinationDistrict: bookingRecord.destinationDistrict,
        destinationState: bookingRecord.destinationState,
        destinationPincode: bookingRecord.destinationPincode,
        destinationLatitude: bookingRecord.destinationLatitude,
        destinationLongitude: bookingRecord.destinationLongitude,
        distanceKm: bookingRecord.distanceKm,
        serviceNameSnapshot: bookingRecord.serviceNameSnapshot,
        rateSnapshot: bookingRecord.rateSnapshot,
        pricingRuleSnapshot: bookingRecord.pricingRuleSnapshot,
        baseAmount: bookingRecord.baseAmount,
        estimatedAmount: bookingRecord.estimatedAmount,
        customerLanguage: lang,
        status: 'BOOKING_RECEIVED',
        customerNotes: bookingRecord.customerNotes,
      },
      include: {
        customer: true,
        service: true,
        pricingRule: true,
      },
    });

    // Send emails asynchronously
    sendBookingEmails(created).catch((err) => console.error('Booking email error:', err));
    return created;
  } catch (err) {
    // Save to in-memory store
    inMemoryBookings.unshift(bookingRecord);
    sendBookingEmails(bookingRecord).catch((err) => console.error('Booking email error:', err));
    return bookingRecord;
  }
}

/**
 * Confirm Booking & Generate Unique Tracking ID
 */
export async function confirmBooking(bookingId: string, adminNotes?: string) {
  const trackingId = generateTrackingId();

  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        trackingId,
        adminNotes: adminNotes ?? undefined,
        trackingEvents: {
          create: {
            status: 'CONFIRMED',
            message: 'Your transport booking has been confirmed by the transport team.',
            location: 'Erode Operations Hub',
            updatedBy: 'Admin',
          },
        },
      },
      include: {
        customer: true,
        service: true,
        trackingEvents: true,
      },
    });

    sendConfirmationEmail(updated).catch((err) => console.error('Confirmation email error:', err));
    return updated;
  } catch (err) {
    const idx = inMemoryBookings.findIndex((b) => b.id === bookingId || b.bookingNumber === bookingId);
    if (idx !== -1) {
      inMemoryBookings[idx].status = 'CONFIRMED';
      inMemoryBookings[idx].trackingId = trackingId;
      if (adminNotes) inMemoryBookings[idx].adminNotes = adminNotes;

      const event = {
        id: `evt-${Date.now()}`,
        bookingId: inMemoryBookings[idx].id,
        status: 'CONFIRMED',
        message: 'Your transport booking has been confirmed by the transport team.',
        location: 'Erode Operations Hub',
        updatedBy: 'Admin',
        createdAt: new Date(),
      };
      inMemoryTrackingEvents.push(event);
      inMemoryBookings[idx].trackingEvents = [event];

      sendConfirmationEmail(inMemoryBookings[idx]).catch((err) => console.error('Confirmation email error:', err));
      return inMemoryBookings[idx];
    }
    throw new Error('Booking not found');
  }
}

/**
 * Update Booking Status & Add Tracking Event
 */
export async function updateBookingStatus(params: {
  bookingId: string;
  status: any;
  message?: string;
  location?: string;
  updatedBy?: string;
}) {
  const defaultMessages: Record<string, string> = {
    BOOKING_RECEIVED: 'Booking request received.',
    CONFIRMED: 'Booking confirmed.',
    VEHICLE_ASSIGNED: 'Vehicle and driver have been assigned.',
    PICKUP_COMPLETED: 'Goods loaded and pickup completed.',
    IN_TRANSIT: 'Shipment is currently in transit.',
    OUT_FOR_DELIVERY: 'Vehicle has reached destination city and is out for delivery.',
    DELIVERED: 'Shipment delivered safely.',
    CANCELLED: 'Booking was cancelled.',
  };

  const message = params.message || defaultMessages[params.status] || `Status updated to ${params.status}`;

  try {
    const updated = await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        status: params.status,
        trackingEvents: {
          create: {
            status: params.status,
            message,
            location: params.location || 'In Transit',
            updatedBy: params.updatedBy || 'Admin',
          },
        },
      },
      include: {
        customer: true,
        vehicle: true,
        driver: true,
        trackingEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (params.status === 'DELIVERED' && updated.customer?.email) {
      sendDeliveryCompletedEmail(updated).catch(() => {});
    }

    return updated;
  } catch (err) {
    const idx = inMemoryBookings.findIndex((b) => b.id === params.bookingId);
    if (idx !== -1) {
      inMemoryBookings[idx].status = params.status;
      const evt = {
        id: `evt-${Date.now()}`,
        bookingId: params.bookingId,
        status: params.status,
        message,
        location: params.location || 'In Transit',
        updatedBy: params.updatedBy || 'Admin',
        createdAt: new Date(),
      };
      inMemoryTrackingEvents.push(evt);
      if (!inMemoryBookings[idx].trackingEvents) inMemoryBookings[idx].trackingEvents = [];
      inMemoryBookings[idx].trackingEvents.unshift(evt);

      if (params.status === 'DELIVERED' && inMemoryBookings[idx].customer?.email) {
        sendDeliveryCompletedEmail(inMemoryBookings[idx]).catch(() => {});
      }

      return inMemoryBookings[idx];
    }
    throw new Error('Booking not found');
  }
}

/**
 * Update Final Pricing with additional charges
 */
export async function updateBookingPricing(
  bookingId: string,
  charges: {
    loadingCharge?: number;
    unloadingCharge?: number;
    tollCharge?: number;
    waitingCharge?: number;
    otherCharges?: number;
    discount?: number;
    finalAmount?: number;
    adminNotes?: string;
  }
) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    const loading = charges.loadingCharge ?? booking.loadingCharge;
    const unloading = charges.unloadingCharge ?? booking.unloadingCharge;
    const toll = charges.tollCharge ?? booking.tollCharge;
    const waiting = charges.waitingCharge ?? booking.waitingCharge;
    const other = charges.otherCharges ?? booking.otherCharges;
    const discount = charges.discount ?? booking.discount;

    const subtotal = booking.baseAmount + loading + unloading + toll + waiting + other;
    const finalAmount = charges.finalAmount ?? Math.max(subtotal - discount, 0);

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        loadingCharge: loading,
        unloadingCharge: unloading,
        tollCharge: toll,
        waitingCharge: waiting,
        otherCharges: other,
        discount: discount,
        finalAmount: finalAmount,
        adminNotes: charges.adminNotes ?? booking.adminNotes,
      },
    });
  } catch (err) {
    const idx = inMemoryBookings.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      const b = inMemoryBookings[idx];
      b.loadingCharge = charges.loadingCharge ?? b.loadingCharge;
      b.unloadingCharge = charges.unloadingCharge ?? b.unloadingCharge;
      b.tollCharge = charges.tollCharge ?? b.tollCharge;
      b.waitingCharge = charges.waitingCharge ?? b.waitingCharge;
      b.otherCharges = charges.otherCharges ?? b.otherCharges;
      b.discount = charges.discount ?? b.discount;
      const subtotal = b.baseAmount + b.loadingCharge + b.unloadingCharge + b.tollCharge + b.waitingCharge + b.otherCharges;
      b.finalAmount = charges.finalAmount ?? Math.max(subtotal - b.discount, 0);
      if (charges.adminNotes) b.adminNotes = charges.adminNotes;
      return b;
    }
    throw new Error('Booking not found');
  }
}

/**
 * Assign Vehicle to Booking
 */
export async function assignVehicleToBooking(bookingId: string, vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { driver: true },
    });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        vehicleId,
        driverId: vehicle?.driverId || null,
        status: 'VEHICLE_ASSIGNED',
        trackingEvents: {
          create: {
            status: 'VEHICLE_ASSIGNED',
            message: vehicle ? `Vehicle ${vehicle.vehicleNumber} assigned with driver ${vehicle.driver?.name || vehicle.driverName || 'assigned driver'}.` : 'Vehicle assigned for this shipment.',
            updatedBy: 'Admin',
          },
        },
      },
      include: { vehicle: true, driver: true, customer: true },
    });

    if (vehicle?.driver?.email) {
      sendDriverAssignmentEmail(updated, vehicle.driver, vehicle).catch(() => {});
    }

    return updated;
  } catch (err) {
    const idx = inMemoryBookings.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      inMemoryBookings[idx].vehicleId = vehicleId;
      inMemoryBookings[idx].status = 'VEHICLE_ASSIGNED';
      const veh = inMemoryVehicles.find((v) => v.id === vehicleId);
      inMemoryBookings[idx].vehicle = veh;
      return inMemoryBookings[idx];
    }
    throw new Error('Booking not found');
  }
}

/**
 * Public Shipment Tracking Lookup (by Tracking ID or Booking Number)
 * Strips sensitive customer contact details for privacy
 */
export async function getPublicTracking(identifier: string) {
  const clean = identifier.trim().toUpperCase();

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ trackingId: clean }, { bookingNumber: clean }],
      },
      include: {
        trackingEvents: {
          orderBy: { createdAt: 'desc' },
        },
        vehicle: {
          select: {
            vehicleType: true,
            vehicleNumber: true,
          },
        },
      },
    });

    if (booking) {
      return sanitizeTrackingOutput(booking);
    }
  } catch (err) {
    // Database fallback
  }

  const found = inMemoryBookings.find(
    (b) => (b.trackingId && b.trackingId.toUpperCase() === clean) || b.bookingNumber.toUpperCase() === clean
  );

  if (found) {
    const events = inMemoryTrackingEvents
      .filter((e) => e.bookingId === found.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return sanitizeTrackingOutput({ ...found, trackingEvents: events });
  }

  return null;
}

function sanitizeTrackingOutput(booking: any) {
  return {
    bookingNumber: booking.bookingNumber,
    trackingId: booking.trackingId,
    status: booking.status,
    serviceName: booking.serviceNameSnapshot,
    pickupCity: booking.pickupCity,
    pickupState: booking.pickupState,
    destinationCity: booking.destinationCity,
    destinationState: booking.destinationState,
    distanceKm: booking.distanceKm,
    estimatedAmount: booking.finalAmount ?? booking.estimatedAmount,
    vehicle: booking.vehicle ? { vehicleType: booking.vehicle.vehicleType } : null,
    trackingEvents: booking.trackingEvents || [],
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

/**
 * Admin Bookings List with filtering and pagination
 */
export async function getAdminBookings(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { bookingNumber: { contains: params.search, mode: 'insensitive' } },
        { trackingId: { contains: params.search, mode: 'insensitive' } },
        { customer: { name: { contains: params.search, mode: 'insensitive' } } },
        { customer: { phone: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          service: true,
          vehicle: true,
          trackingEvents: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  } catch (err) {
    let list = [...inMemoryBookings];
    if (params.status && params.status !== 'ALL') {
      list = list.filter((b) => b.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(q) ||
          (b.trackingId && b.trackingId.toLowerCase().includes(q)) ||
          b.customer?.name?.toLowerCase().includes(q) ||
          b.customer?.phone?.includes(q)
      );
    }
    const paginated = list.slice(skip, skip + limit);
    return {
      bookings: paginated,
      total: list.length,
      page,
      totalPages: Math.ceil(list.length / limit),
    };
  }
}

/**
 * Admin Dashboard Stats
 */
export async function getAdminDashboardStats() {
  try {
    const [total, received, confirmed, inTransit, delivered, recentBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'BOOKING_RECEIVED' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'IN_TRANSIT' } }),
      prisma.booking.count({ where: { status: 'DELIVERED' } }),
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { customer: true, service: true },
      }),
    ]);

    return {
      stats: { total, received, confirmed, inTransit, delivered },
      recentBookings,
    };
  } catch (err) {
    return {
      stats: {
        total: inMemoryBookings.length,
        received: inMemoryBookings.filter((b) => b.status === 'BOOKING_RECEIVED').length,
        confirmed: inMemoryBookings.filter((b) => b.status === 'CONFIRMED').length,
        inTransit: inMemoryBookings.filter((b) => b.status === 'IN_TRANSIT').length,
        delivered: inMemoryBookings.filter((b) => b.status === 'DELIVERED').length,
      },
      recentBookings: inMemoryBookings.slice(0, 6),
    };
  }
}

/**
 * Vehicles List
 */
export async function getVehicles() {
  try {
    const list = await prisma.vehicle.findMany({
      where: { isActive: true },
      orderBy: { vehicleNumber: 'asc' },
    });
    if (list && list.length > 0) return list;
  } catch (err) {
    // Fallback
  }
  return inMemoryVehicles;
}

/**
 * Settings Get and Update
 */
export async function getBusinessSettings() {
  try {
    const settings = await prisma.setting.findMany();
    if (settings && settings.length > 0) {
      const map: Record<string, string> = {};
      settings.forEach((s) => (map[s.key] = s.value));
      return map;
    }
  } catch (err) {
    // Fallback
  }
  return inMemorySettings;
}

export async function updateBusinessSettings(updates: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(updates)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  } catch (err) {
    // Fallback
  }
  inMemorySettings = { ...inMemorySettings, ...updates };
  return inMemorySettings;
}
