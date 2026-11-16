import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const toAsciiDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

type Body = Record<string, unknown>;

/** Read a trimmed string field. Throws 400 with a Bangla message when invalid. */
export function str(body: Body, key: string, opts: { required?: boolean; max?: number; label?: string } = {}) {
  const { required = false, max = 500, label = key } = opts;
  const raw = body?.[key];
  if (raw === undefined || raw === null || raw === '') {
    if (required) throw new HttpError(400, `${label} দেওয়া আবশ্যক`);
    return null;
  }
  if (typeof raw !== 'string') throw new HttpError(400, `${label} সঠিক নয়`);
  const value = raw.trim();
  if (!value) {
    if (required) throw new HttpError(400, `${label} দেওয়া আবশ্যক`);
    return null;
  }
  if (value.length > max) throw new HttpError(400, `${label} সর্বোচ্চ ${max} অক্ষর হতে পারে`);
  return value;
}

export function reqStr(body: Body, key: string, opts: { max?: number; label?: string } = {}) {
  return str(body, key, { ...opts, required: true }) as string;
}

/** Normalise a phone number: Bangla digits → ASCII, drop separators, +880 → 0. */
export function normalizePhone(raw: string) {
  let p = toAsciiDigits(raw).replace(/[\s\-().]/g, '');
  if (p.startsWith('+880')) p = '0' + p.slice(4);
  else if (p.startsWith('880') && p.length === 13) p = '0' + p.slice(3);
  return p;
}

export function phone(body: Body, key: string, required = true) {
  const raw = str(body, key, { required, max: 30, label: 'মোবাইল নম্বর' });
  if (!raw) return null;
  const p = normalizePhone(raw);
  if (!/^\+?\d{6,15}$/.test(p)) throw new HttpError(400, 'মোবাইল নম্বর সঠিক নয়');
  return p;
}

export function email(body: Body, key: string, required = false) {
  const raw = str(body, key, { required, max: 200, label: 'ইমেইল' });
  if (!raw) return null;
  const e = raw.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new HttpError(400, 'ইমেইল ঠিকানা সঠিক নয়');
  return e;
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new HttpError(400, `${label} সঠিক নয়`);
  }
  return value as T;
}

export function intParam(value: unknown, label = 'id') {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${label} সঠিক নয়`);
  return n;
}

export function paging(query: Request['query']) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 25));
  return { limit: pageSize, offset: (page - 1) * pageSize, page, pageSize };
}

/** Escape LIKE wildcards in a user search term. */
export const likeTerm = (q: string) => `%${q.replace(/[\\%_]/g, (c) => '\\' + c)}%`;

/**
 * Simple fixed-window, in-memory rate limiter keyed by client IP.
 * Good enough for a single-process deployment.
 */
export function rateLimit(name: string, max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  setInterval(() => {
    const t = Date.now();
    for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
  }, windowMs).unref();

  return (req: Request, _res: Response, next: NextFunction) => {
    const key = `${name}:${req.ip}`;
    const t = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      hits.set(key, { count: 1, resetAt: t + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return next(new HttpError(429, 'অনেক বেশি অনুরোধ এসেছে। কিছুক্ষণ পর আবার চেষ্টা করুন।'));
    }
    next();
  };
}
