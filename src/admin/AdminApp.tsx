import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { NavLink, Route, Routes, Navigate, Link } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Inbox,
  CalendarClock,
  MessagesSquare,
  Users,
  Tags,
  KeyRound,
  LogOut,
  ExternalLink,
  Loader2,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import { api, errorMessage, type User } from '../lib/api';
import { fmtNum, inputCls, useInterval } from './ui';
import { Overview } from './pages/Overview';
import { LeadsPage } from './pages/Leads';
import { BookingsPage } from './pages/Bookings';
import { ChatsPage } from './pages/Chats';
import { UsersPage } from './pages/Users';
import { PlansPage } from './pages/Plans';
import { AccountPage } from './pages/Account';

interface Counts {
  leadsNew: number;
  bookingsPending: number;
  chatsUnread: number;
}

interface AdminCtx {
  user: User;
  logout: () => Promise<void>;
  counts: Counts | null;
  refreshCounts: () => void;
}

const Ctx = createContext<AdminCtx | null>(null);
export const useAdmin = () => useContext(Ctx)!;

function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await api<{ user: User }>('/auth/login', { method: 'POST', body: { identifier, password } });
      if (user.role !== 'admin') {
        await api('/auth/logout', { method: 'POST' });
        throw new Error('এই অ্যাকাউন্টের ড্যাশবোর্ডে প্রবেশের অনুমতি নেই');
      }
      onLogin(user);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4F0] p-4 text-[#0B192C]">
      <form onSubmit={submit} className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#0B192C]/10 bg-white shadow-xl">
        <div className="flex items-center gap-2.5 bg-[#0B192C] px-6 py-4 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#064E3B]">
            <BookOpen className="h-4 w-4 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-sm font-bold">MetaPOS অ্যাডমিন</h1>
            <p className="text-[11px] text-slate-300">ড্যাশবোর্ডে প্রবেশ করুন</p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">ইমেইল বা মোবাইল</span>
            <input className={inputCls} required autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">পাসওয়ার্ড</span>
            <input
              className={inputCls}
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-[#831843]/30 bg-[#FDF2F8] p-2.5 text-[11px] font-semibold text-[#831843]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#064E3B] py-2.5 text-xs font-bold text-white hover:bg-[#043E2F] disabled:opacity-70"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            লগইন করুন
          </button>
          <Link to="/" className="block text-center text-[11px] font-bold text-[#064E3B] hover:underline">
            ← মূল ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </form>
    </div>
  );
}

const NAV = [
  { to: '/admin', end: true, label: 'ওভারভিউ', icon: LayoutDashboard },
  { to: '/admin/leads', label: 'ডেমো রিকোয়েস্ট', icon: Inbox, count: 'leadsNew' as const },
  { to: '/admin/bookings', label: 'বুকিং ও টিকিট', icon: CalendarClock, count: 'bookingsPending' as const },
  { to: '/admin/chats', label: 'চ্যাট', icon: MessagesSquare, count: 'chatsUnread' as const },
  { to: '/admin/users', label: 'অ্যাকাউন্ট', icon: Users },
  { to: '/admin/plans', label: 'প্ল্যান ও মূল্য', icon: Tags },
  { to: '/admin/account', label: 'আমার পাসওয়ার্ড', icon: KeyRound },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, counts } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const n = item.count && counts ? counts[item.count] : 0;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                isActive ? 'bg-[#064E3B] text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {n > 0 && (
              <span className="rounded-full bg-[#D97706] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {fmtNum(n)}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-white/10 pt-3">
      <div className="px-3 pb-1 text-[11px] text-slate-400">
        <div className="truncate font-bold text-slate-200">{user.name}</div>
        <div className="truncate">{user.email ?? user.phone}</div>
      </div>
      <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white">
        <ExternalLink className="h-4 w-4" /> ওয়েবসাইট দেখুন
      </a>
      <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white">
        <LogOut className="h-4 w-4" /> লগআউট
      </button>
    </div>
  );

  const brand = (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#064E3B]">
        <BookOpen className="h-4 w-4 text-emerald-300" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold text-white">MetaPOS</div>
        <div className="text-[10px] font-semibold text-emerald-400">অ্যাডমিন ড্যাশবোর্ড</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#0B192C]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col justify-between bg-[#0B192C] p-4 lg:flex">
        <div className="space-y-6">
          {brand}
          {nav}
        </div>
        {footer}
      </aside>

      {/* Mobile top bar + menu */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#0B192C] px-4 py-3 lg:hidden">
        {brand}
        <button onClick={() => setMenuOpen((o) => !o)} aria-label="মেনু" className="rounded-md p-1.5 text-slate-200">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-x-0 top-[56px] z-30 space-y-3 bg-[#0B192C] p-4 shadow-xl lg:hidden">
          {nav}
          {footer}
        </div>
      )}

      <main className="px-4 py-6 sm:px-6 lg:ml-60 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    document.title = 'MetaPOS অ্যাডমিন';
    api<{ user: User | null }>('/auth/me')
      .then(({ user }) => setUser(user?.role === 'admin' ? user : null))
      .catch(() => setUser(null));
  }, []);

  const refreshCounts = useCallback(() => {
    if (!user) return;
    api<{ totals: Counts }>('/admin/stats?days=7')
      .then(({ totals }) => setCounts(totals))
      .catch((err) => {
        if (err.status === 401 || err.status === 403) setUser(null);
      });
  }, [user]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);
  useInterval(refreshCounts, 30_000);

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F0] text-xs font-semibold text-[#0B192C]/60">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> লোড হচ্ছে…
      </div>
    );
  }
  if (!user) return <Login onLogin={setUser} />;

  return (
    <Ctx.Provider value={{ user, logout, counts, refreshCounts }}>
      <Layout>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Layout>
    </Ctx.Provider>
  );
}
