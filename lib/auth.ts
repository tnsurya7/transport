import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'transport_super_secret_jwt_key_erode_tamilnadu_2026_production';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface AdminJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface DriverJwtPayload {
  id: string;
  phone: string;
  name: string;
  role: string;
}

export async function signAdminJwt(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyAdminJwt(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function signDriverJwt(payload: DriverJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyDriverJwt(token: string): Promise<DriverJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as DriverJwtPayload;
  } catch {
    return null;
  }
}

// In-memory rate limiting map for login attempts
const loginAttemptsMap = new Map<string, { count: number; firstAttempt: number }>();

export function checkLoginRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = loginAttemptsMap.get(ip);

  if (!entry) {
    loginAttemptsMap.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - entry.firstAttempt > windowMs) {
    loginAttemptsMap.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false; // Rate limit exceeded
  }

  entry.count += 1;
  return true;
}

export function resetLoginRateLimit(ip: string): void {
  loginAttemptsMap.delete(ip);
}
