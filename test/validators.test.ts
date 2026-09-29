import { describe, it, expect } from 'vitest';
import {
  isValidPhone,
  isValidEmail,
  cleanPhone,
  sanitizePhoneInput,
  PHONE_REGEX,
  EMAIL_REGEX,
} from '../lib/validators';

describe('Validators: Strict 10-digit Phone and Email Validation', () => {
  describe('Phone Validation (Strict 10-Digit Indian Mobile)', () => {
    it('should validate 10-digit Indian mobile numbers starting with 6, 7, 8, 9', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('8765432109')).toBe(true);
      expect(isValidPhone('7654321098')).toBe(true);
      expect(isValidPhone('6543210987')).toBe(true);
      expect(isValidPhone('+919876543210')).toBe(true);
      expect(isValidPhone('09876543210')).toBe(true);
      expect(isValidPhone('98765 43210')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('1234567890')).toBe(false); // starts with 1
      expect(isValidPhone('5234567890')).toBe(false); // starts with 5
      expect(isValidPhone('987654321')).toBe(false); // 9 digits
      expect(isValidPhone('9876543210123')).toBe(false); // too long
      expect(isValidPhone('abcdefghij')).toBe(false);
      expect(isValidPhone(null)).toBe(false);
      expect(isValidPhone(undefined)).toBe(false);
    });

    it('should clean and sanitize phone inputs cleanly', () => {
      expect(cleanPhone('+91 98765-43210')).toBe('9876543210');
      expect(cleanPhone('09876543210')).toBe('9876543210');
      expect(sanitizePhoneInput('98a76b54c32109999')).toBe('9876543210');
      expect(sanitizePhoneInput('abc')).toBe('');
    });
  });

  describe('Email Validation (RFC Standard)', () => {
    it('should validate valid email addresses', () => {
      expect(isValidEmail('admin@erodetransport.in')).toBe(true);
      expect(isValidEmail('customer.service@domain.co.in')).toBe(true);
      expect(isValidEmail('test+orders@sub.domain.com')).toBe(true);
      expect(isValidEmail('driver123@transport.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('missingatsign.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user@domain.c')).toBe(false); // TLD too short
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });
});
