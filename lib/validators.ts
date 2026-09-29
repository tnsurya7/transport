/**
 * Validation utilities for Sabarisan Transport
 * Strict 10-digit Indian phone validation & standard RFC email validation
 */

/**
 * Strict 10-digit Indian Mobile Number:
 * Must start with 6, 7, 8, or 9 and be exactly 10 digits long.
 */
export const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Strict RFC 5322 compatible email regular expression
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Cleans phone string by removing non-digits and removing leading +91 / 0 if present
 */
export function cleanPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Formats user input on-the-fly for phone inputs to allow only up to 10 digits
 */
export function sanitizePhoneInput(val: string): string {
  return val.replace(/\D/g, '').slice(0, 10);
}

/**
 * Validates strictly 10-digit mobile number starting with 6, 7, 8, or 9
 */
export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const cleaned = cleanPhone(phone);
  return PHONE_REGEX.test(cleaned);
}

/**
 * Validates email format strictly
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  return EMAIL_REGEX.test(trimmed);
}
