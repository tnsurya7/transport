import { describe, it, expect } from 'vitest';
import { generateBookingNumber, generateTrackingId } from '../lib/identifiers';

describe('Identifier Generation', () => {
  it('generates standard formatted booking numbers', () => {
    const year = new Date().getFullYear();
    const bk1 = generateBookingNumber(1);
    expect(bk1).toBe(`BK-${year}-000001`);

    const bkRandom = generateBookingNumber();
    expect(bkRandom).toMatch(new RegExp(`^BK-${year}-\\d{6}$`));
  });

  it('generates unique tracking IDs for confirmed consignments', () => {
    const year = new Date().getFullYear();
    const tr1 = generateTrackingId(1);
    expect(tr1).toBe(`TRP-ERD-${year}-000001`);

    const trRandom = generateTrackingId();
    expect(trRandom).toMatch(new RegExp(`^TRP-ERD-${year}-\\d{6}$`));
  });
});
