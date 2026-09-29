export interface PricingCalculationInput {
  distanceKm: number;
  ratePerKm: number;
  minDistanceKm?: number;
  minCharge?: number;
  loadingCharge?: number;
  unloadingCharge?: number;
  tollCharge?: number;
  waitingCharge?: number;
  otherCharges?: number;
  discount?: number;
}

export interface PricingBreakdown {
  billableDistanceKm: number;
  ratePerKm: number;
  baseAmount: number;
  loadingCharge: number;
  unloadingCharge: number;
  tollCharge: number;
  waitingCharge: number;
  otherCharges: number;
  discount: number;
  totalEstimatedAmount: number;
}

/**
 * Calculates transport pricing based on distance, rate per KM, and configurable charges
 */
export function calculateTransportPrice(input: PricingCalculationInput): PricingBreakdown {
  const minDistance = input.minDistanceKm ?? 0;
  const billableDistanceKm = Math.max(input.distanceKm, minDistance);
  const rawBase = Math.round(billableDistanceKm * input.ratePerKm);
  const minCharge = input.minCharge ?? 0;
  const baseAmount = Math.max(rawBase, minCharge);

  const loadingCharge = Math.max(input.loadingCharge ?? 0, 0);
  const unloadingCharge = Math.max(input.unloadingCharge ?? 0, 0);
  const tollCharge = Math.max(input.tollCharge ?? 0, 0);
  const waitingCharge = Math.max(input.waitingCharge ?? 0, 0);
  const otherCharges = Math.max(input.otherCharges ?? 0, 0);
  const discount = Math.max(input.discount ?? 0, 0);

  const subtotal = baseAmount + loadingCharge + unloadingCharge + tollCharge + waitingCharge + otherCharges;
  const totalEstimatedAmount = Math.max(subtotal - discount, 0);

  return {
    billableDistanceKm,
    ratePerKm: input.ratePerKm,
    baseAmount,
    loadingCharge,
    unloadingCharge,
    tollCharge,
    waitingCharge,
    otherCharges,
    discount,
    totalEstimatedAmount,
  };
}

/**
 * Finds the matching pricing rule for a service based on load capacity, rule name, or rule type
 */
export function matchPricingRule(
  rules: Array<{
    id: string;
    name: string;
    minLoad: number | null;
    maxLoad: number | null;
    ratePerKm: number;
    minDistanceKm: number;
    minCharge: number;
    isActive: boolean;
  }>,
  requestedLoadCapacity?: number | string
) {
  const activeRules = rules.filter((r) => r.isActive);
  if (activeRules.length === 0) return null;

  if (requestedLoadCapacity !== undefined && requestedLoadCapacity !== null) {
    const raw = String(requestedLoadCapacity).trim();

    // 1. Direct ID or Name Match
    const directMatch = activeRules.find(
      (r) => r.id === raw || r.name.toLowerCase().includes(raw.toLowerCase()) || raw.toLowerCase().includes(r.name.toLowerCase())
    );
    if (directMatch) return directMatch;

    // 2. Numeric range matching
    const numericCapacity =
      typeof requestedLoadCapacity === 'number'
        ? requestedLoadCapacity
        : parseFloat(raw);

    if (!isNaN(numericCapacity)) {
      const matched = activeRules.find((r) => {
        const minOk = r.minLoad === null || numericCapacity >= r.minLoad;
        const maxOk = r.maxLoad === null || numericCapacity <= r.maxLoad;
        return minOk && maxOk;
      });
      if (matched) return matched;
    }
  }

  // Fallback to first active rule
  return activeRules[0];
}

