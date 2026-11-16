# MetaPOS — মাল্টি সেলস সল্যুশন

> **Go beyond POS.** আপনার সেলস সিস্টেমের অপারেটিং সিস্টেম।

MetaPOS is a specialized retail and publishing operating system tailored for book publishers, chain bookstores, and Amar Ekushey Boi Mela stalls in Bangladesh.

---

## 🚀 Key Features

- **অফলাইন-ফার্স্ট পিওএস ইঞ্জিন (Offline-First POS)**: Seamless checkout and barcode/ISBN scanning during extreme network congestion at Amar Ekushey Boi Mela.
- **কার্ড, বিকাশ ও নগদ ডায়নামিক QR পেমেন্ট**: Instant split billing with automated transaction reconciliation.
- **লেখক রয়্যালটি ও ফর্মা কস্টিং (Royalties & Title Costing)**: Graduated tiered royalty calculation, advance recoupment, and Bangla PDF royalty statements.
- **ডেলিভারি ও অনলাইন অর্ডার ইন্টিগ্রেশন**: Automated order dispatch with Steadfast, Pathao, and RedX APIs.
- **Banglabazar Distributor Dues**: Consignment tracking and credit ledger for regional book markets and online retailers.
- **Bengali-First Interface**: Built with high contrast palette (Editorial Navy `#0B192C`, Deep Emerald `#064E3B`, Warm Amber `#D97706`/Burgundy `#831843`) and Google Font `Noto Serif Bengali`.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/metakave/metapos.git
cd metapos

# Install dependencies
npm install

# Start the site + API + admin dashboard (http://localhost:5173)
npm run dev

# Build for production (type-checks site and server, then bundles)
npm run build

# Run the production server (serves dist/ and the API on one port)
npm start
```

Requires **Node.js 22.18+** (uses the built-in `node:sqlite` and runs the TypeScript server directly).

---

## 🗄 Backend & Admin Dashboard

The `server/` folder is a small Express API with a SQLite database. In development it also runs Vite, so the website, API and dashboard all share one port.

| What | Where |
|---|---|
| Admin dashboard | `/admin` — overview charts, demo requests, bookings & support tickets, live chat inbox, user accounts, plan prices |
| API | `/api/*` (see `server/routes/public.ts` and `server/routes/admin.ts`) |
| Database | `server/data/metapos.db` (git-ignored; back this file up) |

**What the website forms now do**

- **ফ্রি ডেমো বুক করুন** (demo modal) → saved as a demo request (`POST /api/leads`)
- **Contact / schedule page** → saved as a booking; already-booked slots are disabled (`POST /api/bookings`)
- **Chat widget** → saved conversation; replies sent from the dashboard appear in the visitor's chat
- **লগইন** → real sign-in for publisher and admin accounts (created in the dashboard); admins are sent to `/admin`
- **Pricing** → prices come from the dashboard (falls back to `src/data/publisherData.ts`)

**First admin login:** on first start the server creates `admin@metapos.local` with a random password and prints it once in the terminal. Change it under *আমার পাসওয়ার্ড*. To choose it yourself, set `ADMIN_EMAIL` / `ADMIN_PASSWORD` before the first start.

**Environment variables (all optional)**

| Variable | Default | Purpose |
|---|---|---|
| `PORT` / `HOST` | `5173` / `localhost` | Where the server listens (use `HOST=0.0.0.0` on a server) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | generated | First admin account (only used when no admin exists) |
| `METAPOS_DATA_DIR` | `server/data` | Folder for the SQLite database |
| `TRUST_PROXY` | off | Set to `1` behind nginx/Caddy so rate limits and secure cookies see the real client |

**Security notes:** passwords are hashed with scrypt; sessions are random tokens in an HttpOnly, SameSite=Lax cookie (Secure over HTTPS); every non-GET API call must send `X-Requested-With: metapos` (CSRF guard); public forms and login are rate-limited per IP. Serve it over HTTPS in production.

---

## 📄 License

Proprietary © MetaPOS. All rights reserved.
