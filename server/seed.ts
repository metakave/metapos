/**
 * Demo data for the MetaPOS backend.
 *
 *   npm run seed          insert demo data (refuses if demo data already exists)
 *   npm run seed:clear    remove demo data only (rows flagged is_demo = 1)
 *
 * All names are fictional, phone numbers use the 01700000xxx placeholder range
 * and emails use example.com. Dates are generated relative to "now", so the
 * dashboard always shows recent activity.
 */
import { db, tx } from './db.ts';
import { hashPassword } from './auth.ts';

const args = process.argv.slice(2);
const DEMO_PUBLISHER_PASSWORD = 'demo-publisher-123';

const countDemo = () =>
  ['leads', 'bookings', 'chat_conversations', 'users']
    .map((t) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE is_demo = 1`).get() as { n: number }).n)
    .reduce((a, b) => a + b, 0);

function clearDemo() {
  tx(() => {
    db.prepare('DELETE FROM leads WHERE is_demo = 1').run();
    db.prepare('DELETE FROM bookings WHERE is_demo = 1').run();
    db.prepare('DELETE FROM chat_conversations WHERE is_demo = 1').run(); // messages cascade
    db.prepare('DELETE FROM users WHERE is_demo = 1').run(); // sessions cascade
  });
}

if (args.includes('--clear')) {
  const n = countDemo();
  clearDemo();
  console.log(n ? `ডেমো ডেটা মুছে ফেলা হয়েছে (${n}টি রেকর্ড)।` : 'মুছে ফেলার মতো কোনো ডেমো ডেটা নেই।');
  process.exit(0);
}

if (countDemo() > 0) {
  console.log('ডেমো ডেটা আগেই যোগ করা আছে। নতুন করে যোগ করতে আগে `npm run seed:clear` চালান।');
  process.exit(0);
}

// ---------- deterministic randomness (same data every run) ----------

let state = 20261116;
const rand = () => {
  state = (state * 1103515245 + 12345) % 2 ** 31;
  return state / 2 ** 31;
};
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const weighted = <T>(items: readonly (readonly [T, number])[]): T => {
  let r = rand() * items.reduce((s, [, w]) => s + w, 0);
  for (const [item, w] of items) if ((r -= w) <= 0) return item;
  return items[items.length - 1][0];
};

// ---------- time helpers (Asia/Dhaka, UTC+6, no DST) ----------

const DAY = 86_400_000;
const OFFSET = 6 * 3_600_000;
const nowMs = Date.now();
/** ISO timestamp `daysAgo` days back, at a Dhaka business hour. */
const dhakaTime = (daysAgo: number, hourMin = 9, hourMax = 21) => {
  const dhakaMidnight = Math.floor((nowMs + OFFSET) / DAY) * DAY - OFFSET;
  const t = dhakaMidnight - daysAgo * DAY + int(hourMin, hourMax) * 3_600_000 + int(0, 59) * 60_000;
  return new Date(Math.min(t, nowMs - int(5, 90) * 60_000)).toISOString();
};
const dhakaDate = (ms: number) => new Date(ms + OFFSET).toISOString().slice(0, 10);
const addMinutes = (iso: string, min: number) => new Date(Date.parse(iso) + min * 60_000).toISOString();

// ---------- vocabulary (fictional) ----------

const PEOPLE = [
  'মো. রাশেদুল করিম', 'সুমাইয়া রহমান', 'তানজিম হোসেন', 'নুসরাত জাহান', 'মাহবুব আলম', 'ফারজানা হক',
  'রাকিবুল হাসান', 'শারমিন সুলতানা', 'আবির চৌধুরী', 'মেহেদী হাসান', 'সাদিয়া ইসলাম', 'ইমরান খান',
  'তাহমিনা আক্তার', 'জাহিদুল ইসলাম', 'রুমানা পারভীন', 'কামরুল হাসান', 'নাফিসা তাবাসসুম', 'আরিফ মাহমুদ',
];
const PRESSES = [
  'নীলাচল প্রকাশন', 'শব্দঘর বুকস', 'কলমকথা প্রকাশনী', 'অক্ষরবৃত্ত', 'পাতাবাহার প্রকাশ', 'বর্ণমালা বুক হাউস',
  'জোনাকি প্রকাশনী', 'মৃত্তিকা পাবলিকেশন্স', 'দিগন্ত বইঘর', 'সপ্তর্ষি প্রকাশন', 'বইবাড়ি অনলাইন', 'চিরকুট প্রকাশনী',
  'একাডেমিক প্রেস ঢাকা', 'নদী ও নৌকা বুকস', 'পাঠশালা বুক ক্যাফে', 'অরণ্য প্রকাশ',
];
const PRESS_TYPES: [string, number][] = [
  ['বাংলাবাজার সৃজনশীল প্রকাশনী', 5],
  ['বুকস্টোর ও শোরুম (আউটলেট)', 3],
  ['অনলাইন বুকশপ ও বুক ক্যাফে', 2],
  ['বিশ্ববিদ্যালয় / একাডেমিক প্রেস', 1],
  ['একক লেখক / লিটলম্যাগ', 1],
];
const TITLES = ['৫০টির নিচে', '৫০ - ২০০টি বই', '২০০ - ১,০০০টি বই', '১,০০০ - ৫,০০০+ বই'];
const PLANS: [string, number][] = [
  ['Spark', 5],
  ['Nexus', 4],
  ['Rise', 2],
  ['Titan', 1],
];
const LEAD_NOTES = [
  'বইমেলার স্টলে ইন্টারনেট থাকে না, অফলাইন বিলিং জরুরি।',
  'লেখক রয়্যালটি হিসাব এখন এক্সেলে করি, অটোমেট করতে চাই।',
  'বিকাশ ও নগদ QR পেমেন্ট একসাথে লাগবে।',
  'তিনটি আউটলেটের স্টক এক জায়গায় দেখতে চাই।',
  'Steadfast কুরিয়ারের সাথে অর্ডার ডেলিভারি ইন্টিগ্রেশন দরকার।',
  'বাংলাবাজারের ডিস্ট্রিবিউটরদের বকেয়া ট্র্যাক করতে চাই।',
  'ব্লুটুথ থার্মাল প্রিন্টারে মেমো প্রিন্ট হবে কি না জানতে চাই।',
  null,
  null,
];
const ADMIN_NOTES: Record<string, string[]> = {
  contacted: ['ফোনে কথা হয়েছে, প্রাইসিং পাঠানো হয়েছে।', 'হোয়াটসঅ্যাপে ব্রোশিওর পাঠানো হয়েছে, ফলো-আপ বাকি।'],
  scheduled: ['গুগল মিটে ডেমো নির্ধারিত।', 'বাংলাবাজার অফিসে সরাসরি ডেমো দেওয়া হবে।'],
  won: ['Growth প্ল্যানে ৩০ দিনের ট্রায়াল শুরু, এরপর পেইড।', 'বার্ষিক বিলিং বেছে নিয়েছেন।'],
  lost: ['বাজেট এই মুহূর্তে নেই, বইমেলার পরে আবার যোগাযোগ।', 'অন্য সফটওয়্যার বেছে নিয়েছেন।'],
};
const MEETING_FORMATS = [
  'গুগল মিট অনলাইন (Google Meet)',
  'বাংলাবাজার প্রধান অফিসে সরাসরি',
  'কাওরান বাজার টেকনোলজি অফিসে',
  'ফোনে সরাসরি বিস্তারিত আলোচনা',
];
const BOOKING_TIMES = ['10:30 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'];

let phoneSeq = 100;
const fakePhone = () => `01700000${String(phoneSeq++).padStart(3, '0')}`;
const fakeEmail = (i: number) => (rand() < 0.45 ? `contact${i}@example.com` : null);

// ---------- generate ----------

const insertLead = db.prepare(
  `INSERT INTO leads (name, phone, email, press_name, press_type, active_titles, preferred_date, plan, notes,
                      status, admin_notes, created_at, updated_at, is_demo)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
);
const insertBooking = db.prepare(
  `INSERT INTO bookings (kind, booking_date, booking_time, name, phone, email, press_name, meeting_format, notes,
                         status, admin_notes, created_at, updated_at, is_demo)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
);
const insertConversation = db.prepare(
  `INSERT INTO chat_conversations (id, status, unread_admin, created_at, last_message_at, is_demo) VALUES (?, ?, ?, ?, ?, 1)`,
);
const insertMessage = db.prepare(
  `INSERT INTO chat_messages (conversation_id, sender, text, created_at) VALUES (?, ?, ?, ?)`,
);
const insertUser = db.prepare(
  `INSERT INTO users (name, email, phone, press_name, role, password_hash, active, created_at, last_login_at, is_demo)
   VALUES (?, ?, ?, ?, 'publisher', ?, ?, ?, ?, 1)`,
);

const summary = { leads: 0, bookings: 0, chats: 0, publishers: 0 };

tx(() => {
  // Demo requests: ~45 days, gently rising toward today, quieter on Fridays.
  for (let daysAgo = 44; daysAgo >= 0; daysAgo--) {
    const dayMs = nowMs - daysAgo * DAY;
    const isFriday = new Date(dayMs + OFFSET).getUTCDay() === 5;
    const base = 0.6 + (44 - daysAgo) * 0.05;
    const n = Math.max(0, Math.round(base + rand() * 2 - 0.8 - (isFriday ? 1 : 0)));
    for (let k = 0; k < n; k++) {
      const created = dhakaTime(daysAgo);
      const status =
        daysAgo < 3
          ? weighted([['new', 6], ['contacted', 1]] as const)
          : daysAgo < 12
          ? weighted([['new', 2], ['contacted', 3], ['scheduled', 3], ['won', 1]] as const)
          : weighted([['contacted', 2], ['scheduled', 2], ['won', 3], ['lost', 2], ['new', 1]] as const);
      const updated = status === 'new' ? created : addMinutes(created, int(60, Math.max(61, daysAgo * 1200)));
      const preferred = dhakaDate(Date.parse(created) + int(2, 7) * DAY);
      insertLead.run(
        pick(PEOPLE),
        fakePhone(),
        fakeEmail(summary.leads),
        pick(PRESSES),
        weighted(PRESS_TYPES),
        pick(TITLES),
        preferred,
        weighted(PLANS),
        pick(LEAD_NOTES),
        status,
        status === 'new' ? null : pick(ADMIN_NOTES[status]),
        created,
        updated < new Date(nowMs).toISOString() ? updated : created,
      );
      summary.leads++;
    }
  }

  // Bookings: past ones (done / cancelled) and upcoming ones (pending / confirmed), no double-booked slots.
  const taken = new Set(
    (db.prepare(`SELECT booking_date || '|' || booking_time AS k FROM bookings WHERE status != 'cancelled'`).all() as {
      k: string;
    }[]).map((r) => r.k),
  );
  const today = dhakaDate(nowMs);
  for (let i = 0; i < 24; i++) {
    const offsetDays = i < 12 ? -int(1, 30) : int(1, 12);
    const date = dhakaDate(nowMs + offsetDays * DAY);
    const time = pick(BOOKING_TIMES);
    if (taken.has(`${date}|${time}`)) continue;
    const past = date < today;
    const status = past
      ? weighted([['done', 5], ['cancelled', 1]] as const)
      : weighted([['pending', 3], ['confirmed', 4], ['cancelled', 1]] as const);
    if (status !== 'cancelled') taken.add(`${date}|${time}`);
    const kind = weighted([['demo', 6], ['meeting', 3], ['problem', 2]] as const);
    // Booked a few days before the session; upcoming ones were booked over the last ~10 days.
    const createdDaysAgo = offsetDays < 0 ? -offsetDays + int(1, 6) : int(0, 10);
    const created = dhakaTime(Math.min(createdDaysAgo, 40));
    insertBooking.run(
      kind,
      date,
      time,
      pick(PEOPLE),
      fakePhone(),
      fakeEmail(100 + i),
      pick(PRESSES),
      pick(MEETING_FORMATS),
      kind === 'problem' ? pick(['প্রিন্টারে বাংলা ফন্ট ভেঙে যাচ্ছে।', 'অফলাইনে করা বিক্রি সিঙ্ক হচ্ছে না।']) : pick(LEAD_NOTES),
      status,
      status === 'done' ? 'সেশন সম্পন্ন, ফলো-আপ ইমেইল পাঠানো হয়েছে।' : status === 'confirmed' ? 'ফোনে নিশ্চিত করা হয়েছে।' : null,
      created,
      created,
    );
    summary.bookings++;
  }

  // Chats: scripted conversations; unread = visitor messages after the last team reply.
  const BOT =
    'ধন্যবাদ মেসেজের জন্য! আমাদের প্রকাশনা টিম সরাসরি আপনার সাথে ফোনে বা অফিসে কথা বলে একটি ফ্রি ডেমো দিতে পারে। আপনি কি একটি ডেমো কল বুক করতে চান?';
  type Turn = ['visitor' | 'admin', string, number]; // sender, text, minutes after previous
  const scripts: { daysAgo: number; status: 'open' | 'closed'; turns: Turn[] }[] = [
    {
      daysAgo: 0,
      status: 'open',
      turns: [
        ['visitor', 'বইমেলার স্টলে ইন্টারনেট না থাকলে কি বিল করা যাবে?', 0],
        ['visitor', 'আমাদের স্টলে দুইটা কাউন্টার থাকবে।', 2],
      ],
    },
    {
      daysAgo: 0,
      status: 'open',
      turns: [['visitor', 'Growth প্ল্যানে কয়টা আউটলেট যোগ করা যায়?', 0]],
    },
    {
      daysAgo: 1,
      status: 'open',
      turns: [
        ['visitor', 'লেখকদের রয়্যালটি স্টেটমেন্ট কি বাংলায় PDF হবে?', 0],
        ['admin', 'জি, সম্পূর্ণ বাংলায় PDF স্টেটমেন্ট তৈরি হয় এবং লেখককে ইমেইলও করা যায়।', 25],
        ['visitor', 'অগ্রিম রয়্যালটি কেটে রাখার হিসাবও কি হয়?', 10],
      ],
    },
    {
      daysAgo: 3,
      status: 'closed',
      turns: [
        ['visitor', 'বিকাশ পেমেন্টের চার্জ কি আলাদা দিতে হবে?', 0],
        ['admin', 'MetaPOS কোনো অতিরিক্ত চার্জ নেয় না; শুধু বিকাশের নিজস্ব মার্চেন্ট চার্জ প্রযোজ্য।', 40],
        ['visitor', 'ধন্যবাদ, বুঝতে পেরেছি।', 5],
      ],
    },
    {
      daysAgo: 6,
      status: 'closed',
      turns: [
        ['visitor', 'পুরনো এক্সেল থেকে বইয়ের তালিকা ইমপোর্ট করা যাবে?', 0],
        ['admin', 'হ্যাঁ, এক্সেল/CSV থেকে ISBN সহ পুরো ক্যাটালগ ইমপোর্ট করা যায়। আমরা সেটআপে সাহায্য করি।', 90],
      ],
    },
    {
      daysAgo: 9,
      status: 'closed',
      turns: [
        ['visitor', 'আপনাদের অফিস কোথায়?', 0],
        ['admin', 'বাংলাবাজার ও কাওরান বাজারে আমাদের অফিস আছে। চাইলে সরাসরি ডেমো দেখতে আসতে পারেন।', 15],
      ],
    },
  ];
  for (const script of scripts) {
    const id = crypto.randomUUID();
    let t = dhakaTime(script.daysAgo, 10, 20);
    const firstAt = t;
    let unread = 0;
    script.turns.forEach(([sender, text, gap], idx) => {
      t = addMinutes(t, gap);
      if (idx === 0) {
        insertConversation.run(id, script.status, 0, firstAt, firstAt);
        insertMessage.run(id, 'visitor', text, t);
        insertMessage.run(id, 'bot', BOT, t);
      } else {
        insertMessage.run(id, sender, text, t);
      }
      unread = sender === 'admin' ? 0 : unread + 1;
    });
    db.prepare('UPDATE chat_conversations SET unread_admin = ?, last_message_at = ? WHERE id = ?').run(
      script.status === 'closed' ? 0 : unread,
      t,
      id,
    );
    summary.chats++;
  }

  // Publisher login accounts (one deactivated, to show that state).
  const hash = hashPassword(DEMO_PUBLISHER_PASSWORD);
  const publishers: [string, string | null, string | null, string, number][] = [
    ['রাশেদুল করিম', 'demo.nilachal@example.com', '01700000901', 'নীলাচল প্রকাশন', 1],
    ['নুসরাত জাহান', 'demo.shobdoghor@example.com', null, 'শব্দঘর বুকস', 1],
    ['মাহবুব আলম', null, '01700000903', 'কলমকথা প্রকাশনী', 0],
  ];
  for (const [name, email, phone, press, active] of publishers) {
    const created = dhakaTime(int(10, 40));
    insertUser.run(name, email, phone, press, hash, active, created, active ? dhakaTime(int(0, 5)) : null);
    summary.publishers++;
  }
});

console.log('\n  ডেমো ডেটা যোগ করা হয়েছে:');
console.log(`  • ডেমো রিকোয়েস্ট: ${summary.leads}`);
console.log(`  • বুকিং ও টিকিট:  ${summary.bookings}`);
console.log(`  • চ্যাট:           ${summary.chats}`);
console.log(`  • প্রকাশক অ্যাকাউন্ট: ${summary.publishers} (পাসওয়ার্ড: ${DEMO_PUBLISHER_PASSWORD})`);
console.log('\n  মুছে ফেলতে: npm run seed:clear\n');
