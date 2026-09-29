import { describe, it, expect } from 'vitest';
import { calculateTransportPrice, matchPricingRule } from '../lib/pricing';

describe('Transport Pricing Engine', () => {
  it('calculates standard distance price correctly', () => {
    // Erode to Coimbatore = 105 KM @ ₹40/KM
    const result = calculateTransportPrice({
      distanceKm: 105,
      ratePerKm: 40,
    });

    expect(result.billableDistanceKm).toBe(105);
    expect(result.ratePerKm).toBe(40);
    expect(result.baseAmount).toBe(4200);
    expect(result.totalEstimatedAmount).toBe(4200);
  });

  it('enforces minimum distance and minimum charge', () => {
    // 10 KM trip with min distance 25 KM and min charge 1000 @ ₹40/KM
    const result = calculateTransportPrice({
      distanceKm: 10,
      ratePerKm: 40,
      minDistanceKm: 25,
      minCharge: 1000,
    });

    expect(result.billableDistanceKm).toBe(25);
    expect(result.baseAmount).toBe(1000);
    expect(result.totalEstimatedAmount).toBe(1000);
  });

  it('calculates additional charges and discounts accurately', () => {
    // Base: 100 KM @ ₹40 = ₹4000
    // + Loading 500 + Unloading 500 + Toll 300 + Waiting 200 - Discount 200 = ₹5300
    const result = calculateTransportPrice({
      distanceKm: 100,
      ratePerKm: 40,
      loadingCharge: 500,
      unloadingCharge: 500,
      tollCharge: 300,
      waitingCharge: 200,
      discount: 200,
    });

    expect(result.baseAmount).toBe(4000);
    expect(result.loadingCharge).toBe(500);
    expect(result.unloadingCharge).toBe(500);
    expect(result.tollCharge).toBe(300);
    expect(result.waitingCharge).toBe(200);
    expect(result.discount).toBe(200);
    expect(result.totalEstimatedAmount).toBe(5300);
  });

  it('correctly matches cargo pricing rule based on load capacity', () => {
    const rules = [
      {
        id: 'rule-1',
        name: '2.5–5 Ton',
        minLoad: 2.5,
        maxLoad: 5.0,
        ratePerKm: 40,
        minDistanceKm: 25,
        minCharge: 1000,
        isActive: true,
      },
      {
        id: 'rule-2',
        name: '5–10 Ton',
        minLoad: 5.1,
        maxLoad: 10.0,
        ratePerKm: 45,
        minDistanceKm: 25,
        minCharge: 1125,
        isActive: true,
      },
    ];

    const matchLow = matchPricingRule(rules, 3.5);
    expect(matchLow?.name).toBe('2.5–5 Ton');
    expect(matchLow?.ratePerKm).toBe(40);

    const matchHigh = matchPricingRule(rules, 7.5);
    expect(matchHigh?.name).toBe('5–10 Ton');
    expect(matchHigh?.ratePerKm).toBe(45);
  });
});
