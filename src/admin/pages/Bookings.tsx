import React from 'react';
import { RecordsPage, type RecordsConfig } from '../RecordsPage';
import { BOOKING_KIND, BOOKING_STATUS, DetailRow, fmtDateTime, fmtDay } from '../ui';

interface Booking {
  id: number;
  kind: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string | null;
  pressName: string;
  meetingFormat: string | null;
  notes: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const config: RecordsConfig<Booking> = {
  endpoint: '/admin/bookings',
  title: 'বুকিং ও টিকিট',
  subtitle: 'যোগাযোগ পাতা থেকে নির্ধারিত ডেমো, মিটিং ও সাপোর্ট টিকিট',
  noun: 'বুকিং',
  statusMap: BOOKING_STATUS,
  filters: [{ key: 'kind', label: 'ধরন', options: BOOKING_KIND }],
  columns: [
    {
      header: 'সময়সূচী',
      className: 'whitespace-nowrap',
      render: (r) => (
        <>
          <div className="font-bold text-[#0B192C]">{fmtDay(r.date)}</div>
          <div className="text-[#0B192C]/60">{r.time}</div>
        </>
      ),
    },
    { header: 'ধরন', render: (r) => BOOKING_KIND[r.kind] ?? r.kind },
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
    { header: 'মাধ্যম', render: (r) => r.meetingFormat ?? '—' },
  ],
  detail: (r) => (
    <>
      <DetailRow label="ধরন">{BOOKING_KIND[r.kind]}</DetailRow>
      <DetailRow label="তারিখ ও সময়">
        {fmtDay(r.date)}, {r.time}
      </DetailRow>
      <DetailRow label="প্রকাশনী">{r.pressName}</DetailRow>
      <DetailRow label="সাক্ষাতের মাধ্যম">{r.meetingFormat}</DetailRow>
      <DetailRow label="ইমেইল">{r.email && <a className="text-[#064E3B] underline" href={`mailto:${r.email}`}>{r.email}</a>}</DetailRow>
      <DetailRow label="গ্রাহকের নোট">{r.notes && <span className="whitespace-pre-wrap">{r.notes}</span>}</DetailRow>
      <DetailRow label="বুক করেছেন">{fmtDateTime(r.createdAt)}</DetailRow>
    </>
  ),
  csv: {
    filename: 'metapos-bookings.csv',
    header: ['ID', 'ধরন', 'তারিখ', 'সময়', 'নাম', 'মোবাইল', 'ইমেইল', 'প্রকাশনী', 'মাধ্যম', 'নোট', 'স্ট্যাটাস', 'অভ্যন্তরীণ নোট', 'বুক করেছেন'],
    row: (r) => [
      r.id,
      BOOKING_KIND[r.kind] ?? r.kind,
      r.date,
      r.time,
      r.name,
      r.phone,
      r.email,
      r.pressName,
      r.meetingFormat,
      r.notes,
      BOOKING_STATUS[r.status]?.label ?? r.status,
      r.adminNotes,
      r.createdAt,
    ],
  },
};

export const BookingsPage = () => <RecordsPage config={config} />;
