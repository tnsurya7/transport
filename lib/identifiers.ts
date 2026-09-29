/**
 * Formats a sequential or timestamped booking number
 * Example: BK-2026-000001
 */
export function generateBookingNumber(sequenceNumber?: number): string {
  const year = new Date().getFullYear();
  if (sequenceNumber !== undefined && sequenceNumber > 0) {
    const padded = String(sequenceNumber).padStart(6, '0');
    return `BK-${year}-${padded}`;
  }
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `BK-${year}-${randomSuffix}`;
}

/**
 * Formats a unique tracking ID upon admin booking confirmation
 * Example: TRP-ERD-2026-000001
 */
export function generateTrackingId(sequenceNumber?: number): string {
  const year = new Date().getFullYear();
  if (sequenceNumber !== undefined && sequenceNumber > 0) {
    const padded = String(sequenceNumber).padStart(6, '0');
    return `TRP-ERD-${year}-${padded}`;
  }
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `TRP-ERD-${year}-${randomSuffix}`;
}
