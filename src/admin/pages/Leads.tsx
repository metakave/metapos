import React from 'react';
import { RecordsPage, type RecordsConfig } from '../RecordsPage';
import { DetailRow, LEAD_STATUS, fmtDateTime, fmtDay } from '../ui';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  pressName: string;
  pressType: string | null;
  activeTitles: string | null;
  preferredDate: string | null;
  plan: string | null;
  notes: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const config: RecordsConfig<Lead> = {
  endpoint: '/admin/leads',
  title: 'ডেমো রিকোয়েস্ট',
  subtitle: 'ওয়েবসাইটের "ফ্রি ডেমো বুক করুন" ফর্ম থেকে আসা রিকোয়েস্ট',
  noun: 'রিকোয়েস্ট',
  statusMap: LEAD_STATUS,
  columns: [
    {
      header: 'নাম ও প্রকাশনী',
      render: (r) => (
        <>
          <div className="font-bold text-[#0B192C]">{r.name}</div>
          <div className="text-[#0B192C]/60">{r.pressName}</div>
        </>
      ),
    },
    { header: 'মোবাইল', render: (r) => r.phone },
    { header: 'প্ল্যান', render: (r) => r.plan ?? '—' },
    { header: 'পছন্দের তারিখ', render: (r) => fmtDay(r.preferredDate) },
    { header: 'এসেছে', render: (r) => fmtDateTime(r.createdAt), className: 'whitespace-nowrap' },
  ],
  detail: (r) => (
    <>
      <DetailRow label="প্রকাশনী">{r.pressName}</DetailRow>
      <DetailRow label="ধরন">{r.pressType}</DetailRow>
      <DetailRow label="বইয়ের সংখ্যা">{r.activeTitles}</DetailRow>
      <DetailRow label="প্ল্যান">{r.plan}</DetailRow>
      <DetailRow label="পছন্দের তারিখ">{fmtDay(r.preferredDate)}</DetailRow>
      <DetailRow label="ইমেইল">{r.email && <a className="text-[#064E3B] underline" href={`mailto:${r.email}`}>{r.email}</a>}</DetailRow>
      <DetailRow label="গ্রাহকের নোট">{r.notes && <span className="whitespace-pre-wrap">{r.notes}</span>}</DetailRow>
      <DetailRow label="এসেছে">{fmtDateTime(r.createdAt)}</DetailRow>
    </>
  ),
  csv: {
    filename: 'metapos-demo-requests.csv',
    header: ['ID', 'নাম', 'মোবাইল', 'ইমেইল', 'প্রকাশনী', 'ধরন', 'বইয়ের সংখ্যা', 'প্ল্যান', 'পছন্দের তারিখ', 'নোট', 'স্ট্যাটাস', 'অভ্যন্তরীণ নোট', 'এসেছে'],
    row: (r) => [
      r.id,
      r.name,
      r.phone,
      r.email,
      r.pressName,
      r.pressType,
      r.activeTitles,
      r.plan,
      r.preferredDate,
      r.notes,
      LEAD_STATUS[r.status]?.label ?? r.status,
      r.adminNotes,
      r.createdAt,
    ],
  },
};

export const LeadsPage = () => <RecordsPage config={config} />;
