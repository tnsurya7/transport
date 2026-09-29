import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  signAdminJwt,
  verifyAdminJwt,
  checkLoginRateLimit,
} from '../lib/auth';

describe('Security and JWT Authentication', () => {
  it('hashes and verifies passwords securely', async () => {
    const plain = 'SecretAdminPassword123';
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    const matches = await verifyPassword(plain, hash);
    expect(matches).toBe(true);

    const wrong = await verifyPassword('WrongPassword', hash);
    expect(wrong).toBe(false);
  });

  it('signs and validates admin JWT tokens', async () => {
    const payload = {
      id: 'adm-001',
      email: 'admin@erodetransport.in',
      name: 'Operations Manager',
      role: 'SUPER_ADMIN',
    };

    const token = await signAdminJwt(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifyAdminJwt(token);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe(payload.role);
  });

  it('enforces brute force rate limiting on repeated failed logins', () => {
    const testIp = `test-ip-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const allowed = checkLoginRateLimit(testIp, 5);
      expect(allowed).toBe(true);
    }

    // 6th attempt should be blocked
    const blocked = checkLoginRateLimit(testIp, 5);
    expect(blocked).toBe(false);
  });
});
