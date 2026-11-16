import React, { useEffect, useState } from 'react';
import { Download, Search, Trash2, Save, Phone, Loader2 } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { useAdmin } from './AdminApp';
import {
  Drawer,
  Empty,
  ErrorBanner,
  Field,
  PageHeader,
  Pagination,
  Spinner,
  StatusBadge,
  btn,
  downloadCsv,
  inputCls,
  selectCls,
  useApi,
  useInterval,
} from './ui';

type Tone = 'blue' | 'amber' | 'green' | 'gray' | 'red' | 'violet';

export interface BaseRecord {
  id: number;
  name: string;
  phone: string;
  status: string;
  adminNotes: string | null;
}

export interface RecordsConfig<T extends BaseRecord> {
  endpoint: string; // e.g. '/admin/leads'
  title: string;
  subtitle: string;
  noun: string; // used in confirmations, e.g. 'রিকোয়েস্ট'
  statusMap: Record<string, { label: string; tone: Tone }>;
  filters?: { key: string; label: string; options: Record<string, string> }[];
  columns: { header: string; render: (row: T) => React.ReactNode; className?: string }[];
  detail: (row: T) => React.ReactNode;
  csv: { filename: string; header: string[]; row: (row: T) => (string | number | null)[] };
}

interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function RecordsPage<T extends BaseRecord>({ config }: { config: RecordsConfig<T> }) {
  const { refreshCounts } = useAdmin();
  const [status, setStatus] = useState('');
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<T | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    setPage(1);
  }, [status, extra, debouncedQ]);

  const query = (p: number, pageSize = 25) => {
    const params = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
    if (status) params.set('status', status);
    if (debouncedQ) params.set('q', debouncedQ);
    for (const [k, v] of Object.entries(extra)) if (v) params.set(k, v);
    return `${config.endpoint}?${params}`;
  };

  const { data, error, loading, reload } = useApi<ListResponse<T>>(query(page));
  useInterval(() => reload(true), 30_000);

  const exportCsv = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const all: T[] = [];
      for (let p = 1; ; p++) {
        const res = await api<ListResponse<T>>(query(p, 100));
        all.push(...res.items);
        if (all.length >= res.total || res.items.length === 0) break;
      }
      downloadCsv(config.csv.filename, config.csv.header, all.map(config.csv.row));
    } catch (err) {
      setExportError(errorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const onSaved = (row: T | null) => {
    setSelected(row);
    reload(true);
    refreshCounts();
  };

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <button className={btn.secondary} onClick={exportCsv} disabled={exporting || !data?.total}>
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            CSV ডাউনলোড
          </button>
        }
      />

      {/* Filters: one row above the table */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
          <input
            className={`${inputCls} pl-8`}
            placeholder="নাম, ফোন বা প্রকাশনী দিয়ে খুঁজুন…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="স্ট্যাটাস">
          <option value="">সব স্ট্যাটাস</option>
          {Object.entries(config.statusMap).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        {config.filters?.map((f) => (
          <select
            key={f.key}
            className={selectCls}
            aria-label={f.label}
            value={extra[f.key] ?? ''}
            onChange={(e) => setExtra((x) => ({ ...x, [f.key]: e.target.value }))}
          >
            <option value="">{f.label}: সব</option>
            {Object.entries(f.options).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        ))}
      </div>

      <ErrorBanner message={error ?? exportError} onRetry={() => reload()} />

      <div className="rounded-2xl border border-[#0B192C]/10 bg-white">
        {loading && !data ? (
          <Spinner />
        ) : !data || data.items.length === 0 ? (
          <Empty>{status || debouncedQ || Object.values(extra).some(Boolean) ? 'এই ফিল্টারে কিছু পাওয়া যায়নি' : `এখনো কোনো ${config.noun} আসেনি`}</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-[#0B192C]/10 text-[#0B192C]/60">
                <tr>
                  {config.columns.map((c) => (
                    <th key={c.header} className={`px-4 py-2.5 font-bold ${c.className ?? ''}`}>
                      {c.header}
                    </th>
                  ))}
                  <th className="px-4 py-2.5 font-bold">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    onClick={() => setSelected(row)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(row)}
                    className="cursor-pointer border-b border-[#0B192C]/5 last:border-0 hover:bg-[#FAF9F5] focus:bg-[#FAF9F5] focus:outline-none"
                  >
                    {config.columns.map((c) => (
                      <td key={c.header} className={`px-4 py-2.5 align-top font-medium ${c.className ?? ''}`}>
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 align-top">
                      <StatusBadge map={config.statusMap} value={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}

      <Drawer open={!!selected} title={selected ? `${selected.name}` : ''} onClose={() => setSelected(null)}>
        {selected && <RecordEditor key={selected.id} row={selected} config={config} onSaved={onSaved} />}
      </Drawer>
    </>
  );
}

function RecordEditor<T extends BaseRecord>({
  row,
  config,
  onSaved,
}: {
  row: T;
  config: RecordsConfig<T>;
  onSaved: (row: T | null) => void;
}) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.adminNotes ?? '');
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState(false);
  const dirty = status !== row.status || notes !== (row.adminNotes ?? '');

  const save = async () => {
    setBusy('save');
    setError(null);
    try {
      const { item } = await api<{ item: T }>(`${config.endpoint}/${row.id}`, {
        method: 'PATCH',
        body: { status, adminNotes: notes },
      });
      setSavedAt(true);
      onSaved(item);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!window.confirm(`এই ${config.noun}টি স্থায়ীভাবে মুছে ফেলবেন?`)) return;
    setBusy('delete');
    setError(null);
    try {
      await api(`${config.endpoint}/${row.id}`, { method: 'DELETE' });
      onSaved(null);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <a href={`tel:${row.phone}`} className={`${btn.primary} w-full`}>
        <Phone className="h-3.5 w-3.5" /> কল করুন: {row.phone}
      </a>
      <dl>{config.detail(row)}</dl>

      <div className="space-y-3 rounded-xl border border-[#0B192C]/10 bg-[#FAF9F5] p-4">
        <Field label="স্ট্যাটাস">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(config.statusMap).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="টিমের অভ্যন্তরীণ নোট" hint="শুধু অ্যাডমিনরা দেখতে পাবেন">
          <textarea className={inputCls} rows={4} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        {error && <p role="alert" className="text-xs font-semibold text-[#831843]">{error}</p>}
        <div className="flex items-center justify-between gap-2">
          <button className={btn.danger} onClick={remove} disabled={!!busy}>
            {busy === 'delete' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            মুছুন
          </button>
          <div className="flex items-center gap-2">
            {savedAt && !dirty && <span className="text-[11px] font-bold text-[#064E3B]">সংরক্ষিত ✓</span>}
            <button className={btn.primary} onClick={save} disabled={!!busy || !dirty}>
              {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

