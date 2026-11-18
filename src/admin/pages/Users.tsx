import React, { useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../../lib/api';
import { useAdmin } from '../AdminApp';
import { Badge, Drawer, Empty, ErrorBanner, Field, PageHeader, Spinner, btn, fmtDateTime, inputCls, useApi } from '../ui';

interface Account {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  pressName: string | null;
  role: 'admin' | 'publisher';
  active: number;
  createdAt: string;
  lastLoginAt: string | null;
}

export function UsersPage() {
  const { user } = useAdmin();
  const { data, error, loading, reload } = useApi<{ items: Account[] }>('/admin/users');
  const [editing, setEditing] = useState<Account | 'new' | null>(null);

  return (
    <>
      <PageHeader
        title="অ্যাকাউন্ট"
        subtitle="প্রকাশকরা ওয়েবসাইটের লগইন বাটন দিয়ে এই অ্যাকাউন্টে প্রবেশ করেন; অ্যাডমিনরা এই ড্যাশবোর্ডে"
        actions={
          <button className={btn.primary} onClick={() => setEditing('new')}>
            <Plus className="h-3.5 w-3.5" /> নতুন অ্যাকাউন্ট
          </button>
        }
      />
      <ErrorBanner message={error} onRetry={() => reload()} />
      <div className="rounded-2xl border border-[#0B192C]/10 bg-white">
        {loading && !data ? (
          <Spinner />
        ) : !data?.items.length ? (
          <Empty>কোনো অ্যাকাউন্ট নেই</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-[#0B192C]/10 text-[#0B192C]/60">
                <tr>
                  <th className="px-4 py-2.5 font-bold">নাম</th>
                  <th className="px-4 py-2.5 font-bold">লগইন</th>
                  <th className="px-4 py-2.5 font-bold">ভূমিকা</th>
                  <th className="px-4 py-2.5 font-bold">শেষ লগইন</th>
                  <th className="px-4 py-2.5 font-bold">অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((a) => (
                  <tr
                    key={a.id}
                    tabIndex={0}
                    onClick={() => setEditing(a)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(a)}
                    className="cursor-pointer border-b border-[#0B192C]/5 last:border-0 hover:bg-[#FAF9F5] focus:bg-[#FAF9F5] focus:outline-none"
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-bold">
                        {a.name} {a.id === user.id && <span className="font-medium text-[#0B192C]/50">(আপনি)</span>}
                      </div>
                      {a.pressName && <div className="text-[#0B192C]/60">{a.pressName}</div>}
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      {a.email && <div>{a.email}</div>}
                      {a.phone && <div>{a.phone}</div>}
                    </td>
                    <td className="px-4 py-2.5">
                      {a.role === 'admin' ? <Badge tone="violet">অ্যাডমিন</Badge> : <Badge tone="blue">প্রকাশক</Badge>}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{fmtDateTime(a.lastLoginAt)}</td>
                    <td className="px-4 py-2.5">
                      {a.active ? <Badge tone="green">সক্রিয়</Badge> : <Badge tone="gray">নিষ্ক্রিয়</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        open={editing !== null}
        title={editing === 'new' ? 'নতুন অ্যাকাউন্ট' : editing ? editing.name : ''}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <AccountForm
            key={editing === 'new' ? 'new' : editing.id}
            account={editing === 'new' ? null : editing}
            isSelf={editing !== 'new' && editing.id === user.id}
            onDone={() => {
              setEditing(null);
              reload(true);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

function AccountForm({ account, isSelf, onDone }: { account: Account | null; isSelf: boolean; onDone: () => void }) {
  const [form, setForm] = useState({
    name: account?.name ?? '',
    email: account?.email ?? '',
    phone: account?.phone ?? '',
    pressName: account?.pressName ?? '',
    role: account?.role ?? 'publisher',
    active: account ? !!account.active : true,
    password: '',
  });
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('save');
    setError(null);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        pressName: form.pressName,
        role: form.role,
        active: form.active,
      };
      if (form.password) body.password = form.password;
      if (account) await api(`/admin/users/${account.id}`, { method: 'PATCH', body });
      else await api('/admin/users', { method: 'POST', body: { ...body, password: form.password } });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!account || !window.confirm(`${account.name}-এর অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলবেন?`)) return;
    setBusy('delete');
    try {
      await api(`/admin/users/${account.id}`, { method: 'DELETE' });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(null);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <Field label="নাম *">
        <input className={inputCls} required maxLength={120} value={form.name} onChange={set('name')} />
      </Field>
      <Field label="প্রকাশনীর নাম">
        <input className={inputCls} maxLength={200} value={form.pressName} onChange={set('pressName')} />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="ইমেইল">
          <input className={inputCls} type="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="মোবাইল">
          <input className={inputCls} type="tel" value={form.phone} onChange={set('phone')} placeholder="017xxxxxxxx" />
        </Field>
      </div>
      <p className="-mt-2 text-[11px] font-medium text-[#0B192C]/50">ইমেইল বা মোবাইল — যেকোনোটি দিয়ে লগইন করা যাবে। অন্তত একটি দিন।</p>
      <Field label="ভূমিকা">
        <select className={inputCls} value={form.role} onChange={set('role')} disabled={isSelf}>
          <option value="publisher">প্রকাশক (ওয়েবসাইট লগইন)</option>
          <option value="admin">অ্যাডমিন (ড্যাশবোর্ডে পূর্ণ প্রবেশাধিকার)</option>
        </select>
      </Field>
      <Field
        label={account ? 'নতুন পাসওয়ার্ড' : 'পাসওয়ার্ড *'}
        hint={account ? 'পরিবর্তন করতে না চাইলে খালি রাখুন। পরিবর্তন করলে ব্যবহারকারী সব ডিভাইস থেকে লগআউট হবেন।' : 'কমপক্ষে ৮ অক্ষর'}
      >
        <input
          className={inputCls}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required={!account}
          value={form.password}
          onChange={set('password')}
        />
      </Field>
      {!isSelf && (
        <label className="flex items-center gap-2 text-xs font-bold">
          <input type="checkbox" checked={form.active} onChange={set('active')} className="h-4 w-4 accent-[#064E3B]" />
          অ্যাকাউন্ট সক্রিয়
        </label>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-[#831843]">{error}</p>}
      <div className="flex items-center justify-between gap-2 pt-2">
        {account && !isSelf ? (
          <button type="button" className={btn.danger} onClick={remove} disabled={!!busy}>
            {busy === 'delete' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            মুছুন
          </button>
        ) : (
          <span />
        )}
        <button className={btn.primary} disabled={!!busy}>
          {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {account ? 'সংরক্ষণ করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
        </button>
      </div>
    </form>
  );
}
