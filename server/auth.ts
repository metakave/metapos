import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db, now } from './db.ts';
import { HttpError } from './http.ts';

export type Role = 'admin' | 'publisher';

export interface SessionUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  press_name: string | null;
  role: Role;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}

const COOKIE = 'metapos_sid';
const SESSION_DAYS = 7;
const SCRYPT_KEYLEN = 64;

// ---------- passwords ----------

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, saltHex, hashHex] = stored.split('$');
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// Used when a login names an unknown user, so response time doesn't reveal it.
const DUMMY_HASH = hashPassword(crypto.randomBytes(16).toString('hex'));
export const burnPasswordCheck = (password: string) => verifyPassword(password, DUMMY_HASH);

export function checkPasswordStrength(password: unknown) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new HttpError(400, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
  }
  if (password.length > 200) throw new HttpError(400, 'পাসওয়ার্ড অনেক লম্বা');
  return password;
}

// ---------- sessions ----------

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

function parseCookies(header: string | undefined) {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function startSession(res: Response, userId: number, secure: boolean) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(
    sha256(token),
    userId,
    expires.toISOString(),
    now(),
  );
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(now(), userId);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    expires,
    path: '/',
  });
}

export function endSession(req: Request, res: Response) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
}

export function endAllSessionsFor(userId: number) {
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

/** Attach req.user when a valid session cookie is present. Never rejects. */
export function loadUser(req: Request, _res: Response, next: NextFunction) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) {
    const row = db
      .prepare(
        `SELECT u.id, u.name, u.email, u.phone, u.press_name, u.role
           FROM sessions s JOIN users u ON u.id = s.user_id
          WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1`,
      )
      .get(sha256(token), now()) as SessionUser | undefined;
    if (row) req.user = row;
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, 'লগইন করা প্রয়োজন'));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, 'এই কাজের অনুমতি নেই'));
    next();
  };
}

export function purgeExpiredSessions() {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
}

// ---------- first admin ----------

/**
 * Make sure at least one admin exists. On first run this creates one from
 * ADMIN_EMAIL / ADMIN_PASSWORD, or generates a password and prints it once.
 */
export function ensureAdmin() {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get() as { n: number }).n;
  if (count > 0) return;

  const email = (process.env.ADMIN_EMAIL ?? 'admin@metapos.local').toLowerCase();
  const generated = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD ?? crypto.randomBytes(9).toString('base64url');
  db.prepare(
    `INSERT INTO users (name, email, role, password_hash, created_at) VALUES (?, ?, 'admin', ?, ?)`,
  ).run('MetaPOS অ্যাডমিন', email, hashPassword(password), now());

  console.log('\n  ┌─ MetaPOS: প্রথম অ্যাডমিন অ্যাকাউন্ট তৈরি হয়েছে');
  console.log(`  │  ইমেইল:    ${email}`);
  if (generated) console.log(`  │  পাসওয়ার্ড: ${password}`);
  console.log('  └─ /admin এ লগইন করে পাসওয়ার্ড পরিবর্তন করুন\n');
}
