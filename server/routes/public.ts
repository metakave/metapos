import crypto from 'node:crypto';
import { Router } from 'express';
import { db, now, tx } from '../db.ts';
import { sendDemoStoreCreatedEmail, sendNotificationEmail } from '../email.ts';
import { createTenantStore, isSubdomainAvailable, validateSubdomain } from '../tenant.ts';
import {
  burnPasswordCheck,
  checkPasswordStrength,
  endAllSessionsFor,
  endSession,
  hashPassword,
  requireRole,
  startSession,
  verifyPassword,
} from '../auth.ts';
import { HttpError, email, normalizePhone, oneOf, phone, rateLimit, reqStr, str } from '../http.ts';

export const publicRouter = Router();

const submitLimit = rateLimit('submit', 10, 10 * 60_000);
const loginLimit = rateLimit('login', 10, 15 * 60_000);
const chatLimit = rateLimit('chat', 30, 5 * 60_000);
const createStoreLimit = rateLimit('create_store', 6, 15 * 60_000);

const BOOKING_KINDS = ['demo', 'meeting', 'problem'] as const;
const BOOKING_TIMES = ['10:30 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'] as const;

const BOT_REPLY =
  'ধন্যবাদ মেসেজের জন্য! আমাদের প্রকাশনা টিম সরাসরি আপনার সাথে ফোনে বা অফিসে কথা বলে একটি ফ্রি ডেমো দিতে পারে। আপনি কি একটি ডেমো কল বুক করতে চান?';

// ---------- auth ----------

publicRouter.post('/auth/login', loginLimit, (req, res) => {
  const identifier = reqStr(req.body, 'identifier', { max: 200, label: 'ইমেইল বা মোবাইল' });
  const password = reqStr(req.body, 'password', { max: 200, label: 'পাসওয়ার্ড' });

  const byEmail = identifier.includes('@');
  const key = byEmail ? identifier.toLowerCase() : normalizePhone(identifier);
  const user = db
    .prepare(`SELECT id, password_hash, active FROM users WHERE ${byEmail ? 'email' : 'phone'} = ?`)
    .get(key) as { id: number; password_hash: string; active: number } | undefined;

  let ok = false;
  if (user) ok = verifyPassword(password, user.password_hash);
  else burnPasswordCheck(password); // keep timing similar for unknown users
  if (!user || !ok) throw new HttpError(401, 'ইমেইল/মোবাইল বা পাসওয়ার্ড সঠিক নয়');
  if (!user.active) throw new HttpError(403, 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা আছে। সাপোর্টে যোগাযোগ করুন।');

  startSession(res, user.id, req.secure);
  const me = db.prepare('SELECT id, name, email, phone, press_name, role FROM users WHERE id = ?').get(user.id);
  res.json({ user: me });
});

publicRouter.post('/auth/logout', (req, res) => {
  endSession(req, res);
  res.json({ ok: true });
});

publicRouter.get('/auth/me', (req, res) => {
  res.json({ user: req.user ?? null });
});

publicRouter.post('/auth/password', requireRole('admin', 'publisher'), (req, res) => {
  const current = reqStr(req.body, 'currentPassword', { max: 200, label: 'বর্তমান পাসওয়ার্ড' });
  const next = checkPasswordStrength(req.body.newPassword);
  const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user!.id) as { password_hash: string };
  if (!verifyPassword(current, row.password_hash)) throw new HttpError(400, 'বর্তমান পাসওয়ার্ড সঠিক নয়');

  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(next), req.user!.id);
  endAllSessionsFor(req.user!.id);
  startSession(res, req.user!.id, req.secure);
  res.json({ ok: true });
});

// ---------- plans ----------

publicRouter.get('/plans', (_req, res) => {
  const rows = db
    .prepare('SELECT id, price_monthly AS priceMonthly, price_yearly AS priceYearly FROM plans ORDER BY sort_order')
    .all();
  res.json({ plans: rows });
});

// ---------- demo requests (DemoModal) ----------

publicRouter.post('/leads', submitLimit, (req, res) => {
  const b = req.body;
  const t = now();
  const preferredDate = str(b, 'preferredDate', { max: 10, label: 'তারিখ' });
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) throw new HttpError(400, 'তারিখ সঠিক নয়');

  const leadName = reqStr(b, 'name', { max: 120, label: 'নাম' });
  const leadPhone = phone(b, 'phone');
  const leadEmail = email(b, 'email');
  const pressName = reqStr(b, 'pressName', { max: 200, label: 'প্রকাশনীর নাম' });
  const pressType = str(b, 'pressType', { max: 120 });
  const activeTitles = str(b, 'activeTitles', { max: 60 });
  const plan = str(b, 'plan', { max: 60 });
  const notes = str(b, 'notes', { max: 2000, label: 'নোট' });

  const result = db
    .prepare(
      `INSERT INTO leads (name, phone, email, press_name, press_type, active_titles, preferred_date, plan, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      leadName,
      leadPhone,
      leadEmail,
      pressName,
      pressType,
      activeTitles,
      preferredDate,
      plan,
      notes,
      t,
      t,
    );

  // Send SMTP notification in background
  sendNotificationEmail({
    formType: 'demo',
    name: leadName,
    phone: leadPhone,
    email: leadEmail,
    pressName,
    pressType: pressType ?? null,
    plan: plan ?? null,
    catalogSize: activeTitles ?? null,
    selectedDate: preferredDate ?? null,
    notes: notes ?? null,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown',
  }).catch((err) => console.error('[SMTP Error on Lead]:', err));

  res.status(201).json({ id: Number(result.lastInsertRowid), success: true });
});

// ---------- bookings (ContactPage) ----------

/** Slots already taken, so the booking form can disable them. No personal data. */
publicRouter.get('/bookings/taken', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT booking_date AS date, booking_time AS time FROM bookings
        WHERE status != 'cancelled' AND booking_date >= date('now', '+6 hours')`,
    )
    .all();
  res.json({ slots: rows });
});

publicRouter.post('/bookings', submitLimit, (req, res) => {
  const b = req.body;
  const kind = oneOf(b.kind, BOOKING_KINDS, 'বুকিংয়ের ধরন');
  const date = reqStr(b, 'date', { max: 10, label: 'তারিখ' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new HttpError(400, 'তারিখ সঠিক নয়');
  const time = oneOf(b.time, BOOKING_TIMES, 'সময়');

  const values = {
    name: reqStr(b, 'name', { max: 120, label: 'নাম' }),
    phone: phone(b, 'phone'),
    email: email(b, 'email'),
    pressName: reqStr(b, 'pressName', { max: 200, label: 'প্রকাশনীর নাম' }),
    meetingFormat: str(b, 'meetingFormat', { max: 120 }),
    notes: str(b, 'notes', { max: 2000, label: 'নোট' }),
  };

  const id = tx(() => {
    const clash = db
      .prepare(
        `SELECT 1 FROM bookings WHERE booking_date = ? AND booking_time = ? AND status != 'cancelled' LIMIT 1`,
      )
      .get(date, time);
    if (clash) throw new HttpError(409, 'এই সময়টি ইতিমধ্যে বুক হয়ে গেছে। অনুগ্রহ করে অন্য সময় বেছে নিন।');

    const t = now();
    return db
      .prepare(
        `INSERT INTO bookings (kind, booking_date, booking_time, name, phone, email, press_name, meeting_format, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(kind, date, time, values.name, values.phone, values.email, values.pressName, values.meetingFormat, values.notes, t, t)
      .lastInsertRowid;
  });

  // Send SMTP notification in background
  sendNotificationEmail({
    formType: kind,
    name: values.name,
    phone: values.phone,
    email: values.email,
    pressName: values.pressName,
    meetingFormat: values.meetingFormat ?? null,
    selectedDate: date,
    selectedTime: time,
    notes: values.notes ?? null,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown',
  }).catch((err) => console.error('[SMTP Error on Booking]:', err));

  res.status(201).json({ id: Number(id), success: true });
});

// ---------- contact & legacy endpoint ----------
publicRouter.post(['/contact', '/send-email'], submitLimit, async (req, res) => {
  const b = req.body;
  const formType = (b.formType as string) || 'contact';
  const name = reqStr(b, 'name', { max: 120, label: 'নাম' });
  const userPhone = phone(b, 'phone');
  const userEmail = email(b, 'email');
  const pressName = reqStr(b, 'pressName', { max: 200, label: 'প্রকাশনীর নাম' });
  const notes = str(b, 'notes', { max: 2000, label: 'নোট' });

  const t = now();
  const result = db
    .prepare(
      `INSERT INTO leads (name, phone, email, press_name, press_type, active_titles, preferred_date, plan, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      name,
      userPhone,
      userEmail,
      pressName,
      str(b, 'pressType', { max: 120 }),
      str(b, 'catalogSize', { max: 60 }) || str(b, 'activeTitles', { max: 60 }),
      str(b, 'selectedDate', { max: 10 }),
      str(b, 'plan', { max: 60 }),
      notes,
      t,
      t,
    );

  await sendNotificationEmail({
    formType,
    name,
    phone: userPhone,
    email: userEmail,
    pressName,
    pressType: str(b, 'pressType', { max: 120 }),
    plan: str(b, 'plan', { max: 60 }),
    catalogSize: str(b, 'catalogSize', { max: 60 }) || str(b, 'activeTitles', { max: 60 }),
    selectedDate: str(b, 'selectedDate', { max: 10 }),
    selectedTime: str(b, 'selectedTime', { max: 20 }),
    notes,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown',
  });

  res.status(200).json({ success: true, id: Number(result.lastInsertRowid) });
});

// ---------- chat (ChatButton) ----------
// The conversation id is a random UUID and acts as the visitor's access key.

const UUID_RE = /^[0-9a-f-]{36}$/;

function messagesAfter(conversationId: string, afterId: number) {
  return db
    .prepare(
      `SELECT id, sender, text, created_at AS createdAt FROM chat_messages
        WHERE conversation_id = ? AND id > ? ORDER BY id`,
    )
    .all(conversationId, afterId);
}

publicRouter.post('/chat', chatLimit, (req, res) => {
  const text = reqStr(req.body, 'text', { max: 1000, label: 'মেসেজ' });
  let conversationId = typeof req.body.conversationId === 'string' ? req.body.conversationId : null;
  const afterId = Number(req.body.afterId) || 0;

  tx(() => {
    const t = now();
    const exists =
      conversationId && UUID_RE.test(conversationId)
        ? db.prepare('SELECT 1 FROM chat_conversations WHERE id = ?').get(conversationId)
        : undefined;
    const isNew = !exists;
    if (isNew) {
      conversationId = crypto.randomUUID();
      db.prepare('INSERT INTO chat_conversations (id, created_at, last_message_at) VALUES (?, ?, ?)').run(
        conversationId,
        t,
        t,
      );
    }
    db.prepare(`INSERT INTO chat_messages (conversation_id, sender, text, created_at) VALUES (?, 'visitor', ?, ?)`).run(
      conversationId,
      text,
      t,
    );
    db.prepare(
      `UPDATE chat_conversations SET last_message_at = ?, unread_admin = unread_admin + 1, status = 'open' WHERE id = ?`,
    ).run(t, conversationId);
    // Auto-reply once per conversation; after that the team answers from the dashboard.
    if (isNew) {
      db.prepare(`INSERT INTO chat_messages (conversation_id, sender, text, created_at) VALUES (?, 'bot', ?, ?)`).run(
        conversationId,
        BOT_REPLY,
        t,
      );
    }
  });

  res.status(201).json({ conversationId, messages: messagesAfter(conversationId!, afterId) });
});

publicRouter.get('/chat/:id', (req, res) => {
  const id = req.params.id;
  if (!UUID_RE.test(id) || !db.prepare('SELECT 1 FROM chat_conversations WHERE id = ?').get(id)) {
    throw new HttpError(404, 'কথোপকথন পাওয়া যায়নি');
  }
  res.json({ messages: messagesAfter(id, Number(req.query.after) || 0) });
});

// ---------- instant demo store creation (metapos-tenant) ----------

publicRouter.get('/tenants/check', async (req, res) => {
  const subdomain = String(req.query.subdomain || '');
  const result = await isSubdomainAvailable(subdomain);
  res.json(result);
});

publicRouter.post(['/tenants/create', '/demo/create-store'], createStoreLimit, async (req, res) => {
  const b = req.body;
  const subdomain = reqStr(b, 'subdomain', { max: 30, label: 'সাবডোমেন' }).toLowerCase().trim();
  const shopName = reqStr(b, 'shopName', { max: 100, label: 'দোকান বা প্রকাশনীর নাম' });
  const ownerEmail = email(b, 'ownerEmail') || email(b, 'email');
  if (!ownerEmail) {
    throw new HttpError(400, 'সঠিক ইমেইল ঠিকানা প্রদান করুন');
  }
  const ownerName = str(b, 'ownerName', { max: 100 }) || str(b, 'name', { max: 100 }) || shopName;
  const ownerPhone = phone(b, 'phone');

  const check = await isSubdomainAvailable(subdomain);
  if (!check.available) {
    throw new HttpError(400, check.reason || 'সাবডোমেনটি গ্রহণযোগ্য নয় বা ইতিমধ্যে ব্যবহৃত হয়েছে।');
  }

  const creds = await createTenantStore({
    subdomain,
    shopName,
    ownerEmail,
    ownerName,
    phone: ownerPhone ?? undefined,
  });

  const t = now();
  // Record in demo_stores table
  db.prepare(
    `INSERT INTO demo_stores (subdomain, shop_name, owner_name, owner_email, owner_phone, store_url, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
  ).run(subdomain, shopName, ownerName, ownerEmail, ownerPhone ?? null, creds.url, t, t);

  // Also record in leads table for admin visibility
  db.prepare(
    `INSERT INTO leads (name, phone, email, press_name, press_type, plan, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'তাত্ক্ষণিক ডেমো স্টোর', 'Trial (7 Days)', ?, ?, ?)`,
  ).run(
    ownerName,
    ownerPhone,
    ownerEmail,
    shopName,
    `লাইভ ডেমো স্টোর তৈরি করা হয়েছে: ${creds.url} | সাবডোমেন: ${subdomain}`,
    t,
    t,
  );

  // Send Email with credentials to requester, CCing business@, coo@, sales@
  sendDemoStoreCreatedEmail({
    shopName,
    subdomain,
    storeUrl: creds.url,
    ownerName,
    ownerEmail,
    ownerPassword: creds.ownerPassword,
    adminLogin: creds.adminLogin,
    adminPassword: creds.adminPassword,
    phone: ownerPhone ?? undefined,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown',
  }).catch((err) => console.error('[Demo Store Email Error]:', err));

  res.status(201).json({
    success: true,
    url: creds.url,
    shop: creds.shop,
    ownerLogin: creds.ownerLogin,
    ownerPassword: creds.ownerPassword,
    created: creds.created,
  });
});
