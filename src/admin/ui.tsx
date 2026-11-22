import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { api, errorMessage } from '../lib/api';

// ---------- formatting ----------

const nf = new Intl.NumberFormat('bn-BD');
export const fmtNum = (n: number) => nf.format(n);
export const fmtTaka = (n: number) => `৳${nf.format(n)}`;

export const fmtDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('bn-BD', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Dhaka',
      })
    : '—';

/** '2026-11-20' → '২০ নভে, ২০২৬' (a calendar date, no timezone shift). */
export const fmtDay = (ymd: string | null, withYear = true) => {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  });
};

// ---------- status vocabularies ----------

type Tone = 'blue' | 'amber' | 'green' | 'gray' | 'red' | 'violet';

export const LEAD_STATUS: Record<string, { label: string; tone: Tone }> = {
  new: { label: 'নতুন', tone: 'blue' },
  contacted: { label: 'যোগাযোগ হয়েছে', tone: 'amber' },
  scheduled: { label: 'ডেমো নির্ধারিত', tone: 'violet' },
  won: { label: 'গ্রাহক হয়েছে', tone: 'green' },
  lost: { label: 'বাতিল', tone: 'gray' },
};

export const BOOKING_STATUS: Record<string, { label: string; tone: Tone }> = {
  pending: { label: 'অপেক্ষমাণ', tone: 'amber' },
  confirmed: { label: 'নিশ্চিত', tone: 'blue' },
  done: { label: 'সম্পন্ন', tone: 'green' },
  cancelled: { label: 'বাতিল', tone: 'gray' },
};

export const BOOKING_KIND: Record<string, string> = {
  demo: 'ফ্রি ডেমো',
  meeting: 'মিটিং',
  problem: 'সাপোর্ট টিকিট',
};

const TONES: Record<Tone, string> = {
  blue: 'bg-[#EAF2FC] text-[#1C5CAB] ring-[#2A78D6]/25',
  amber: 'bg-[#FEF3C7] text-[#92400E] ring-[#D97706]/30',
  green: 'bg-[#E6FBF4] text-[#00875A] ring-[#00D492]/30',
  gray: 'bg-[#F1F3F5] text-[#52514E] ring-[#0B192C]/15',
  red: 'bg-[#FDF2F8] text-[#831843] ring-[#831843]/25',
  violet: 'bg-[#F0EEFC] text-[#4A3AA7] ring-[#6250D6]/25',
};

export const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${TONES[tone]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
    {children}
  </span>
);

export const StatusBadge: React.FC<{ map: Record<string, { label: string; tone: Tone }>; value: string }> = ({ map, value }) => {
  const s = map[value] ?? { label: value, tone: 'gray' as Tone };
  return <Badge tone={s.tone}>{s.label}</Badge>;
};

// ---------- data loading ----------

export function useApi<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!path);
  const seq = useRef(0);

  const load = useCallback(
    async (quiet = false) => {
      if (!path) return;
      const n = ++seq.current;
      if (!quiet) setLoading(true);
      try {
        const result = await api<T>(path);
        if (n === seq.current) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (n === seq.current) setError(errorMessage(err));
      } finally {
        if (n === seq.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, ...deps],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load, setData };
}

/** Re-run fn every ms while the tab is visible. */
export function useInterval(fn: () => void, ms: number) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') saved.current();
    }, ms);
    return () => clearInterval(t);
  }, [ms]);
}

// ---------- layout pieces ----------

export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
    <div>
      <h1 className="text-xl font-bold text-[#0B192C]">{title}</h1>
      {subtitle && <p className="mt-0.5 text-xs font-medium text-[#0B192C]/60">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card: React.FC<{ title?: string; actions?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title,
  actions,
  className = '',
  children,
}) => (
  <section className={`rounded-2xl border border-[#0B192C]/10 bg-white ${className}`}>
    {(title || actions) && (
      <div className="flex items-center justify-between gap-2 border-b border-[#0B192C]/10 px-4 py-3">
        {title && <h2 className="text-sm font-bold text-[#0B192C]">{title}</h2>}
        {actions}
      </div>
    )}
    <div className="p-4">{children}</div>
  </section>
);

export const ErrorBanner: React.FC<{ message: string | null; onRetry?: () => void }> = ({ message, onRetry }) =>
  message ? (
    <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-[#831843]/30 bg-[#FDF2F8] p-3 text-xs font-semibold text-[#831843]">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="underline">
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  ) : null;

export const Spinner: React.FC<{ label?: string }> = ({ label = 'লোড হচ্ছে…' }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-xs font-semibold text-[#0B192C]/60">
    <Loader2 className="h-4 w-4 animate-spin" /> {label}
  </div>
);

export const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-12 text-center text-xs font-semibold text-[#0B192C]/50">{children}</div>
);

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00D492] px-4 py-2 text-xs font-bold text-[#0B192C] hover:bg-[#00B87D] disabled:opacity-60 shadow-xs',
  secondary:
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0B192C]/20 bg-white px-4 py-2 text-xs font-bold text-[#0B192C] hover:bg-[#FAF9F5] disabled:opacity-60',
  danger:
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#831843]/30 bg-white px-4 py-2 text-xs font-bold text-[#831843] hover:bg-[#FDF2F8] disabled:opacity-60',
};

export const inputCls =
  'w-full rounded-lg border border-[#0B192C]/20 bg-white px-3 py-2 text-xs font-medium focus:border-[#00D492] focus:outline-none';

export const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold text-[#0B192C]">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] font-medium text-[#0B192C]/50">{hint}</span>}
  </label>
);

/** Right-hand slide-over panel (full screen on phones). */
export const Drawer: React.FC<{ open: boolean; title: string; onClose: () => void; children: React.ReactNode }> = ({
  open,
  title,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#0B192C]/40" onClick={onClose} aria-hidden />
      <aside role="dialog" aria-modal="true" aria-label={title} className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#0B192C]/10 bg-[#0B192C] px-5 py-3.5 text-white">
          <h2 className="text-sm font-bold">{title}</h2>
          <button onClick={onClose} aria-label="বন্ধ করুন" className="rounded-md p-1 text-slate-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
};

export const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-2 border-b border-[#0B192C]/5 py-2 text-xs">
    <dt className="font-bold text-[#0B192C]/60">{label}</dt>
    <dd className="col-span-2 break-words font-medium text-[#0B192C]">{children || '—'}</dd>
  </div>
);

export const Pagination: React.FC<{ page: number; pageSize: number; total: number; onPage: (p: number) => void }> = ({
  page,
  pageSize,
  total,
  onPage,
}) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 pt-3 text-xs font-semibold text-[#0B192C]/70">
      <span>
        মোট {fmtNum(total)}টি • পৃষ্ঠা {fmtNum(page)}/{fmtNum(pages)}
      </span>
      <div className="flex gap-2">
        <button className={btn.secondary} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          আগের
        </button>
        <button className={btn.secondary} disabled={page >= pages} onClick={() => onPage(page + 1)}>
          পরের
        </button>
      </div>
    </div>
  );
};

/** Download rows as a UTF-8 CSV that Excel opens with Bangla intact. */
export function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    const s = v === null || v === undefined ? '' : String(v);
    // Neutralise spreadsheet formulas in user-supplied text.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const csv = '﻿' + [header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Same look as inputCls but sized to its content (for filter dropdowns). */
export const selectCls = inputCls.replace('w-full ', 'w-auto ');
