import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { api, errorMessage } from '../../lib/api';
import { ErrorBanner, PageHeader, Spinner, btn, fmtDateTime, fmtNum, fmtTaka, inputCls, useApi } from '../ui';

interface PlanRow {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  updatedAt: string;
}

export function PlansPage() {
  const { data, error, loading, reload } = useApi<{ items: PlanRow[] }>('/admin/plans');
  return (
    <>
      <PageHeader
        title="প্ল্যান ও মূল্য"
        subtitle="এখানে পরিবর্তন করা মূল্য ওয়েবসাইটের প্রাইসিং সেকশন ও প্রাইসিং পাতায় সাথে সাথে দেখাবে (টাকা/মাস)"
      />
      <ErrorBanner message={error} onRetry={() => reload()} />
      {loading && !data ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.items.map((p) => <PlanCard key={p.id} plan={p} onSaved={() => reload(true)} />)}
        </div>
      )}
    </>
  );
}

function PlanCard({ plan, onSaved }: { plan: PlanRow; onSaved: () => void }) {
  const [custom, setCustom] = useState(plan.priceMonthly === -1);
  const [monthly, setMonthly] = useState(plan.priceMonthly === -1 ? '' : String(plan.priceMonthly));
  const [yearly, setYearly] = useState(plan.priceYearly === -1 ? '' : String(plan.priceYearly));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await api(`/admin/plans/${plan.id}`, {
        method: 'PUT',
        body: custom ? { priceMonthly: -1, priceYearly: -1 } : { priceMonthly: Number(monthly), priceYearly: Number(yearly) },
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const discount =
    !custom && Number(monthly) > 0 && Number(yearly) > 0 ? Math.round((1 - Number(yearly) / Number(monthly)) * 100) : null;

  return (
    <form onSubmit={save} className="space-y-3 rounded-2xl border border-[#0B192C]/10 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold">{plan.name}</h2>
        <span className="text-[11px] font-semibold text-[#0B192C]/50">হালনাগাদ: {fmtDateTime(plan.updatedAt)}</span>
      </div>
      <label className="flex items-center gap-2 text-xs font-bold">
        <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} className="h-4 w-4 accent-[#064E3B]" />
        কাস্টম কোটেশন (মূল্য দেখাবে না)
      </label>
      {!custom && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">মাসিক বিলিং (৳/মাস)</span>
            <input className={inputCls} type="number" min={0} step={1} required value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">বার্ষিক বিলিং (৳/মাস)</span>
            <input className={inputCls} type="number" min={0} step={1} required value={yearly} onChange={(e) => setYearly(e.target.value)} />
          </label>
        </div>
      )}
      {!custom && Number(monthly) >= 0 && monthly !== '' && (
        <p className="text-[11px] font-semibold text-[#0B192C]/60">
          ওয়েবসাইটে দেখাবে: {fmtTaka(Number(monthly))} মাসিক / {fmtTaka(Number(yearly) || 0)} বার্ষিক
          {discount !== null && discount > 0 && ` • বার্ষিক ছাড় ${fmtNum(discount)}%`}
        </p>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-[#831843]">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        {saved && <span className="text-[11px] font-bold text-[#064E3B]">সংরক্ষিত ✓</span>}
        <button className={btn.primary} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          সংরক্ষণ করুন
        </button>
      </div>
    </form>
  );
}
