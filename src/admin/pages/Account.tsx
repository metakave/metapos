import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { api, errorMessage } from '../../lib/api';
import { useAdmin } from '../AdminApp';
import { Card, Field, PageHeader, btn, inputCls } from '../ui';

export function AccountPage() {
  const { user } = useAdmin();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (next !== confirm) {
      setError('নতুন পাসওয়ার্ড দুটি মিলছে না');
      return;
    }
    setBusy(true);
    try {
      await api('/auth/password', { method: 'POST', body: { currentPassword: current, newPassword: next } });
      setCurrent('');
      setNext('');
      setConfirm('');
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="আমার পাসওয়ার্ড" subtitle={`লগইন: ${user.email ?? user.phone}`} />
      <Card className="max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <Field label="বর্তমান পাসওয়ার্ড">
            <input className={inputCls} type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="নতুন পাসওয়ার্ড" hint="কমপক্ষে ৮ অক্ষর। পরিবর্তনের পর অন্য সব ডিভাইস থেকে লগআউট হয়ে যাবে।">
            <input className={inputCls} type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} />
          </Field>
          <Field label="নতুন পাসওয়ার্ড আবার লিখুন">
            <input className={inputCls} type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
          {error && <p role="alert" className="text-xs font-semibold text-[#831843]">{error}</p>}
          {done && <p className="text-xs font-bold text-[#064E3B]">পাসওয়ার্ড পরিবর্তন হয়েছে ✓</p>}
          <button className={btn.primary} disabled={busy}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </form>
      </Card>
    </>
  );
}
