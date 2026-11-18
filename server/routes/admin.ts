import { Router } from 'express';
import { db, now, tx } from '../db.ts';
import { checkPasswordStrength, endAllSessionsFor, hashPassword, requireRole } from '../auth.ts';
import { HttpError, email, intParam, likeTerm, oneOf, paging, phone, reqStr, str } from '../http.ts';

export const adminRouter = Router();
adminRouter.use(requireRole('admin'));

const LEAD_STATUSES = ['new', 'contacted', 'scheduled', 'won', 'lost'] as const;
const BOOKING_STATUSES = ['pending', 'confirmed', 'done', 'cancelled'] as const;
const BOOKING_KINDS = ['demo', 'meeting', 'problem'] as const;

const DHAKA_OFFSET_MS = 6 * 3_600_000;
const dhakaDate = (ms: number) => new Date(ms + DHAKA_OFFSET_MS).toISOString().slice(0, 10);
const count = (sql: string, ...params: (string | number)[]) =>
  (db.prepare(sql).get(...params) as { n: number }).n;

// ---------- overview ----------

adminRouter.get('/stats', (req, res) => {
  const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
  const todayMs = Date.now();
  const dates = Array.from({ length: days }, (_, i) => dhakaDate(todayMs - (days - 1 - i) * 86_400_000));
  const since = new Date(Date.parse(`${dates[0]}T00:00:00+06:00`)).toISOString();

  const perDay = (table: 'leads' | 'bookings') =>
    new Map(
      (
        db
          .prepare(
            `SELECT date(created_at, '+6 hours') AS d, COUNT(*) AS n FROM ${table} WHERE created_at >= ? GROUP BY d`,
          )
          .all(since) as { d: string; n: number }[]
      ).map((r) => [r.d, r.n]),
    );
  const leadsByDay = perDay('leads');
  const bookingsByDay = perDay('bookings');
  const today = dhakaDate(todayMs);

  res.json({
    days,
    totals: {
      leadsNew: count(`SELECT COUNT(*) AS n FROM leads WHERE status = 'new'`),
      leadsPeriod: count(`SELECT COUNT(*) AS n FROM leads WHERE created_at >= ?`, since),
      leadsWonPeriod: count(`SELECT COUNT(*) AS n FROM leads WHERE status = 'won' AND created_at >= ?`, since),
      bookingsUpcoming: count(
        `SELECT COUNT(*) AS n FROM bookings WHERE status IN ('pending','confirmed') AND booking_date >= ?`,
        today,
      ),
      bookingsPending: count(`SELECT COUNT(*) AS n FROM bookings WHERE status = 'pending'`),
      chatsUnread: count(`SELECT COUNT(*) AS n FROM chat_conversations WHERE unread_admin > 0`),
      publishersActive: count(`SELECT COUNT(*) AS n FROM users WHERE role = 'publisher' AND active = 1`),
    },
    daily: dates.map((d) => ({ date: d, leads: leadsByDay.get(d) ?? 0, bookings: bookingsByDay.get(d) ?? 0 })),
    leadsByPlan: db
      .prepare(
        `SELECT COALESCE(plan, 'অনির্ধারিত') AS label, COUNT(*) AS value FROM leads
          WHERE created_at >= ? GROUP BY label ORDER BY value DESC`,
      )
      .all(since),
    leadsByStatus: db
      .prepare(`SELECT status AS label, COUNT(*) AS value FROM leads WHERE created_at >= ? GROUP BY status`)
      .all(since),
    leadsByPressType: db
      .prepare(
        `SELECT COALESCE(press_type, 'অনির্ধারিত') AS label, COUNT(*) AS value FROM leads
          WHERE created_at >= ? GROUP BY label ORDER BY value DESC`,
      )
      .all(since),
    upcomingBookings: db
      .prepare(
        `SELECT id, kind, booking_date AS date, booking_time AS time, name, press_name AS pressName, status
           FROM bookings WHERE status IN ('pending','confirmed') AND booking_date >= ?
          ORDER BY booking_date, booking_time LIMIT 6`,
      )
      .all(today),
  });
});

// ---------- leads ----------

const LEAD_COLS = `id, name, phone, email, press_name AS pressName, press_type AS pressType,
  active_titles AS activeTitles, preferred_date AS preferredDate, plan, notes, status,
  admin_notes AS adminNotes, created_at AS createdAt, updated_at AS updatedAt`;

adminRouter.get('/leads', (req, res) => {
  const { limit, offset, page, pageSize } = paging(req.query);
  const where: string[] = [];
  const params: string[] = [];
  if (typeof req.query.status === 'string' && req.query.status) {
    where.push('status = ?');
    params.push(oneOf(req.query.status, LEAD_STATUSES, 'স্ট্যাটাস'));
  }
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    where.push(`(name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR press_name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\')`);
    const t = likeTerm(req.query.q.trim());
    params.push(t, t, t, t);
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  res.json({
    items: db.prepare(`SELECT ${LEAD_COLS} FROM leads ${w} ORDER BY id DESC LIMIT ? OFFSET ?`).all(...params, limit, offset),
    total: count(`SELECT COUNT(*) AS n FROM leads ${w}`, ...params),
    page,
    pageSize,
  });
});

adminRouter.patch('/leads/:id', (req, res) => {
  const id = intParam(req.params.id);
  const status = req.body.status === undefined ? undefined : oneOf(req.body.status, LEAD_STATUSES, 'স্ট্যাটাস');
  const adminNotes = req.body.adminNotes === undefined ? undefined : str(req.body, 'adminNotes', { max: 4000 });
  const r = db
    .prepare(
      `UPDATE leads SET status = COALESCE(?, status),
              admin_notes = CASE WHEN ? THEN ? ELSE admin_notes END, updated_at = ? WHERE id = ?`,
    )
    .run(status ?? null, adminNotes !== undefined ? 1 : 0, adminNotes ?? null, now(), id);
  if (!r.changes) throw new HttpError(404, 'লিড পাওয়া যায়নি');
  res.json({ item: db.prepare(`SELECT ${LEAD_COLS} FROM leads WHERE id = ?`).get(id) });
});

adminRouter.delete('/leads/:id', (req, res) => {
  const r = db.prepare('DELETE FROM leads WHERE id = ?').run(intParam(req.params.id));
  if (!r.changes) throw new HttpError(404, 'লিড পাওয়া যায়নি');
  res.json({ ok: true });
});

// ---------- bookings ----------

const BOOKING_COLS = `id, kind, booking_date AS date, booking_time AS time, name, phone, email,
  press_name AS pressName, meeting_format AS meetingFormat, notes, status,
  admin_notes AS adminNotes, created_at AS createdAt, updated_at AS updatedAt`;

adminRouter.get('/bookings', (req, res) => {
  const { limit, offset, page, pageSize } = paging(req.query);
  const where: string[] = [];
  const params: string[] = [];
  if (typeof req.query.status === 'string' && req.query.status) {
    where.push('status = ?');
    params.push(oneOf(req.query.status, BOOKING_STATUSES, 'স্ট্যাটাস'));
  }
  if (typeof req.query.kind === 'string' && req.query.kind) {
    where.push('kind = ?');
    params.push(oneOf(req.query.kind, BOOKING_KINDS, 'ধরন'));
  }
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    where.push(`(name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR press_name LIKE ? ESCAPE '\\')`);
    const t = likeTerm(req.query.q.trim());
    params.push(t, t, t);
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  res.json({
    items: db
      .prepare(`SELECT ${BOOKING_COLS} FROM bookings ${w} ORDER BY booking_date DESC, booking_time DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset),
    total: count(`SELECT COUNT(*) AS n FROM bookings ${w}`, ...params),
    page,
    pageSize,
  });
});

adminRouter.patch('/bookings/:id', (req, res) => {
  const id = intParam(req.params.id);
  const status = req.body.status === undefined ? undefined : oneOf(req.body.status, BOOKING_STATUSES, 'স্ট্যাটাস');
  const adminNotes = req.body.adminNotes === undefined ? undefined : str(req.body, 'adminNotes', { max: 4000 });
  const r = db
    .prepare(
      `UPDATE bookings SET status = COALESCE(?, status),
              admin_notes = CASE WHEN ? THEN ? ELSE admin_notes END, updated_at = ? WHERE id = ?`,
    )
    .run(status ?? null, adminNotes !== undefined ? 1 : 0, adminNotes ?? null, now(), id);
  if (!r.changes) throw new HttpError(404, 'বুকিং পাওয়া যায়নি');
  res.json({ item: db.prepare(`SELECT ${BOOKING_COLS} FROM bookings WHERE id = ?`).get(id) });
});

adminRouter.delete('/bookings/:id', (req, res) => {
  const r = db.prepare('DELETE FROM bookings WHERE id = ?').run(intParam(req.params.id));
  if (!r.changes) throw new HttpError(404, 'বুকিং পাওয়া যায়নি');
  res.json({ ok: true });
});

// ---------- chat ----------

adminRouter.get('/chats', (req, res) => {
  const status = req.query.status === 'closed' ? 'closed' : req.query.status === 'all' ? null : 'open';
  const rows = db
    .prepare(
      `SELECT c.id, c.status, c.unread_admin AS unread, c.created_at AS createdAt, c.last_message_at AS lastMessageAt,
              (SELECT text FROM chat_messages m WHERE m.conversation_id = c.id AND m.sender != 'bot' ORDER BY m.id DESC LIMIT 1) AS lastText,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) AS messageCount
         FROM chat_conversations c
        ${status ? 'WHERE c.status = ?' : ''}
        ORDER BY c.last_message_at DESC LIMIT 200`,
    )
    .all(...(status ? [status] : []));
  res.json({ items: rows });
});

const UUID_RE = /^[0-9a-f-]{36}$/;
function conversationOr404(id: string) {
  if (!UUID_RE.test(id)) throw new HttpError(404, 'কথোপকথন পাওয়া যায়নি');
  const row = db
    .prepare('SELECT id, status, created_at AS createdAt FROM chat_conversations WHERE id = ?')
    .get(id);
  if (!row) throw new HttpError(404, 'কথোপকথন পাওয়া যায়নি');
  return row;
}

adminRouter.get('/chats/:id', (req, res) => {
  const conversation = conversationOr404(req.params.id);
  db.prepare('UPDATE chat_conversations SET unread_admin = 0 WHERE id = ?').run(req.params.id);
  const messages = db
    .prepare(
      `SELECT id, sender, text, created_at AS createdAt FROM chat_messages WHERE conversation_id = ? ORDER BY id`,
    )
    .all(req.params.id);
  res.json({ conversation, messages });
});

adminRouter.post('/chats/:id/messages', (req, res) => {
  conversationOr404(req.params.id);
  const text = reqStr(req.body, 'text', { max: 2000, label: 'মেসেজ' });
  const t = now();
  const id = tx(() => {
    const r = db
      .prepare(`INSERT INTO chat_messages (conversation_id, sender, text, created_at) VALUES (?, 'admin', ?, ?)`)
      .run(req.params.id, text, t);
    db.prepare(`UPDATE chat_conversations SET last_message_at = ?, unread_admin = 0, status = 'open' WHERE id = ?`).run(
      t,
      req.params.id,
    );
    return Number(r.lastInsertRowid);
  });
  res.status(201).json({ message: { id, sender: 'admin', text, createdAt: t } });
});

adminRouter.patch('/chats/:id', (req, res) => {
  conversationOr404(req.params.id);
  const status = oneOf(req.body.status, ['open', 'closed'] as const, 'স্ট্যাটাস');
  db.prepare('UPDATE chat_conversations SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

adminRouter.delete('/chats/:id', (req, res) => {
  conversationOr404(req.params.id);
  db.prepare('DELETE FROM chat_conversations WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- user accounts ----------

const USER_COLS = `id, name, email, phone, press_name AS pressName, role, active,
  created_at AS createdAt, last_login_at AS lastLoginAt`;

adminRouter.get('/users', (_req, res) => {
  res.json({ items: db.prepare(`SELECT ${USER_COLS} FROM users ORDER BY role, name`).all() });
});

function uniqueOr409(fn: () => void) {
  try {
    fn();
  } catch (err) {
    if (err instanceof Error && /UNIQUE constraint failed: users\.(email|phone)/.test(err.message)) {
      throw new HttpError(409, 'এই ইমেইল বা মোবাইল নম্বর দিয়ে আগেই একটি অ্যাকাউন্ট আছে');
    }
    throw err;
  }
}

adminRouter.post('/users', (req, res) => {
  const b = req.body;
  const userEmail = email(b, 'email');
  const userPhone = phone(b, 'phone', false);
  if (!userEmail && !userPhone) throw new HttpError(400, 'ইমেইল অথবা মোবাইল নম্বর — অন্তত একটি দিন');
  const role = oneOf(b.role ?? 'publisher', ['admin', 'publisher'] as const, 'ভূমিকা');
  const password = checkPasswordStrength(b.password);

  let id = 0;
  uniqueOr409(() => {
    id = Number(
      db
        .prepare(
          `INSERT INTO users (name, email, phone, press_name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          reqStr(b, 'name', { max: 120, label: 'নাম' }),
          userEmail,
          userPhone,
          str(b, 'pressName', { max: 200 }),
          role,
          hashPassword(password),
          now(),
        ).lastInsertRowid,
    );
  });
  res.status(201).json({ item: db.prepare(`SELECT ${USER_COLS} FROM users WHERE id = ?`).get(id) });
});

const activeAdmins = () => count(`SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND active = 1`);

adminRouter.patch('/users/:id', (req, res) => {
  const id = intParam(req.params.id);
  const b = req.body;
  const existing = db.prepare('SELECT id, role, active, email, phone FROM users WHERE id = ?').get(id) as
    | { id: number; role: string; active: number; email: string | null; phone: string | null }
    | undefined;
  if (!existing) throw new HttpError(404, 'অ্যাকাউন্ট পাওয়া যায়নি');

  const role = b.role === undefined ? existing.role : oneOf(b.role, ['admin', 'publisher'] as const, 'ভূমিকা');
  const active = b.active === undefined ? existing.active : b.active ? 1 : 0;
  const isSelf = id === req.user!.id;
  if (isSelf && (role !== 'admin' || !active)) {
    throw new HttpError(400, 'নিজের অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয় বা পরিবর্তন করা যাবে না');
  }
  if (existing.role === 'admin' && existing.active && (role !== 'admin' || !active) && activeAdmins() <= 1) {
    throw new HttpError(400, 'অন্তত একজন সক্রিয় অ্যাডমিন থাকতে হবে');
  }

  const userEmail = b.email === undefined ? existing.email : email(b, 'email');
  const userPhone = b.phone === undefined ? existing.phone : phone(b, 'phone', false);
  if (!userEmail && !userPhone) throw new HttpError(400, 'ইমেইল অথবা মোবাইল নম্বর — অন্তত একটি দিন');

  uniqueOr409(() =>
    tx(() => {
      db.prepare(
        `UPDATE users SET name = COALESCE(?, name), email = ?, phone = ?,
                press_name = CASE WHEN ? THEN ? ELSE press_name END, role = ?, active = ? WHERE id = ?`,
      ).run(
        str(b, 'name', { max: 120, label: 'নাম' }),
        userEmail,
        userPhone,
        b.pressName !== undefined ? 1 : 0,
        str(b, 'pressName', { max: 200 }),
        role,
        active,
        id,
      );
      if (b.password) {
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
          hashPassword(checkPasswordStrength(b.password)),
          id,
        );
      }
    }),
  );
  // A password reset or deactivation signs the user out everywhere.
  if ((b.password || !active) && !isSelf) endAllSessionsFor(id);
  res.json({ item: db.prepare(`SELECT ${USER_COLS} FROM users WHERE id = ?`).get(id) });
});

adminRouter.delete('/users/:id', (req, res) => {
  const id = intParam(req.params.id);
  if (id === req.user!.id) throw new HttpError(400, 'নিজের অ্যাকাউন্ট মুছে ফেলা যাবে না');
  const existing = db.prepare('SELECT role, active FROM users WHERE id = ?').get(id) as
    | { role: string; active: number }
    | undefined;
  if (!existing) throw new HttpError(404, 'অ্যাকাউন্ট পাওয়া যায়নি');
  if (existing.role === 'admin' && existing.active && activeAdmins() <= 1) {
    throw new HttpError(400, 'অন্তত একজন সক্রিয় অ্যাডমিন থাকতে হবে');
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ ok: true });
});

// ---------- plan prices ----------

adminRouter.get('/plans', (_req, res) => {
  res.json({
    items: db
      .prepare(
        `SELECT id, name, price_monthly AS priceMonthly, price_yearly AS priceYearly, updated_at AS updatedAt
           FROM plans ORDER BY sort_order`,
      )
      .all(),
  });
});

adminRouter.put('/plans/:id', (req, res) => {
  const price = (v: unknown, label: string) => {
    const n = Number(v);
    // -1 means "custom quote" (Enterprise).
    if (!Number.isInteger(n) || (n < 0 && n !== -1) || n > 10_000_000) throw new HttpError(400, `${label} সঠিক নয়`);
    return n;
  };
  const monthly = price(req.body.priceMonthly, 'মাসিক মূল্য');
  const yearly = price(req.body.priceYearly, 'বার্ষিক মূল্য');
  const r = db
    .prepare('UPDATE plans SET price_monthly = ?, price_yearly = ?, updated_at = ? WHERE id = ?')
    .run(monthly, yearly, now(), req.params.id);
  if (!r.changes) throw new HttpError(404, 'প্ল্যান পাওয়া যায়নি');
  res.json({ ok: true });
});
