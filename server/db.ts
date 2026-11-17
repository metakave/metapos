import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { PRICING_PLANS } from '../src/data/publisherData.ts';

const DATA_DIR = path.resolve(process.env.METAPOS_DATA_DIR ?? 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const DB_PATH = path.join(DATA_DIR, 'metapos.db');
export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE,
    phone         TEXT UNIQUE,
    press_name    TEXT,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'publisher')),
    password_hash TEXT NOT NULL,
    active        INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL,
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leads (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    phone          TEXT NOT NULL,
    email          TEXT,
    press_name     TEXT NOT NULL,
    press_type     TEXT,
    active_titles  TEXT,
    preferred_date TEXT,
    plan           TEXT,
    notes          TEXT,
    status         TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'scheduled', 'won', 'lost')),
    admin_notes    TEXT,
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    kind           TEXT NOT NULL CHECK (kind IN ('demo', 'meeting', 'problem')),
    booking_date   TEXT NOT NULL,
    booking_time   TEXT NOT NULL,
    name           TEXT NOT NULL,
    phone          TEXT NOT NULL,
    email          TEXT,
    press_name     TEXT NOT NULL,
    meeting_format TEXT,
    notes          TEXT,
    status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'done', 'cancelled')),
    admin_notes    TEXT,
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chat_conversations (
    id              TEXT PRIMARY KEY,
    status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    unread_admin    INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL,
    last_message_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender          TEXT NOT NULL CHECK (sender IN ('visitor', 'admin', 'bot')),
    text            TEXT NOT NULL,
    created_at      TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plans (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    price_monthly INTEGER NOT NULL,
    price_yearly  INTEGER NOT NULL,
    sort_order    INTEGER NOT NULL,
    updated_at    TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_leads_created    ON leads(created_at);
  CREATE INDEX IF NOT EXISTS idx_bookings_slot    ON bookings(booking_date, booking_time);
  CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);
  CREATE INDEX IF NOT EXISTS idx_chat_msg_conv    ON chat_messages(conversation_id, id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id);
`);

// Migration: rows created by `npm run seed` are flagged so `npm run seed:clear`
// can remove exactly those and never touch real data.
for (const table of ['users', 'leads', 'bookings', 'chat_conversations']) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === 'is_demo')) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0`);
  }
}

export const now = () => new Date().toISOString();

// Seed plan prices from the site's static data the first time only;
// after that the dashboard owns the prices.
const insertPlan = db.prepare(
  `INSERT OR IGNORE INTO plans (id, name, price_monthly, price_yearly, sort_order, updated_at)
   VALUES (?, ?, ?, ?, ?, ?)`,
);
PRICING_PLANS.forEach((p, i) => insertPlan.run(p.id, p.name, p.priceMonthly, p.priceYearly, i, now()));

/** Run fn inside a transaction. */
export function tx<T>(fn: () => T): T {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
