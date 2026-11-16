import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, CalendarClock, MessagesSquare, Users, TrendingUp, Table2, BarChart3 } from 'lucide-react';
import {
  BOOKING_KIND,
  BOOKING_STATUS,
  Card,
  ErrorBanner,
  LEAD_STATUS,
  PageHeader,
  Spinner,
  StatusBadge,
  fmtDay,
  fmtNum,
  useApi,
  useInterval,
} from '../ui';
import { HBars, Legend, SERIES_COLORS, StackedColumns, type Series } from '../charts';

interface Stats {
  days: number;
  totals: {
    leadsNew: number;
    leadsPeriod: number;
    leadsWonPeriod: number;
    bookingsUpcoming: number;
    bookingsPending: number;
    chatsUnread: number;
    publishersActive: number;
  };
  daily: { date: string; leads: number; bookings: number }[];
  leadsByPlan: { label: string; value: number }[];
  leadsByStatus: { label: string; value: number }[];
  leadsByPressType: { label: string; value: number }[];
  upcomingBookings: {
    id: number;
    kind: string;
    date: string;
    time: string;
    name: string;
    pressName: string;
    status: string;
  }[];
}

const SERIES: Series<'leads' | 'bookings'>[] = [
  { key: 'leads', label: 'ডেমো রিকোয়েস্ট', color: SERIES_COLORS[0] },
  { key: 'bookings', label: 'বুকিং ও টিকিট', color: SERIES_COLORS[1] },
];

const RANGES = [7, 30, 90];

function StatTile({
  icon: Icon,
  label,
  value,
  note,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note?: string;
  to?: string;
}) {
  const body = (
    <div className="h-full rounded-2xl border border-[#0B192C]/10 bg-white p-4 transition-colors hover:border-[#064E3B]/40">
      <div className="flex items-center gap-2 text-xs font-bold text-[#0B192C]/60">
        <Icon className="h-4 w-4 text-[#064E3B]" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-[#0B192C]">{value}</div>
      {note && <div className="mt-0.5 text-[11px] font-semibold text-[#0B192C]/50">{note}</div>}
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

export function Overview() {
  const [days, setDays] = useState(30);
  const [showTable, setShowTable] = useState(false);
  const { data, error, loading, reload } = useApi<Stats>(`/admin/stats?days=${days}`);
  useInterval(() => reload(true), 60_000);

  const t = data?.totals;
  const conversion = t && t.leadsPeriod ? Math.round((t.leadsWonPeriod / t.leadsPeriod) * 100) : 0;
  const periodLabel = `গত ${fmtNum(days)} দিন`;

  return (
    <>
      <PageHeader
        title="ওভারভিউ"
        subtitle="ওয়েবসাইট থেকে আসা ডেমো রিকোয়েস্ট, বুকিং ও চ্যাটের সারসংক্ষেপ"
        actions={
          <div role="group" aria-label="সময়সীমা" className="flex rounded-xl border border-[#0B192C]/15 bg-white p-0.5">
            {RANGES.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  days === d ? 'bg-[#0B192C] text-white' : 'text-[#0B192C]/70 hover:text-[#0B192C]'
                }`}
              >
                {fmtNum(d)} দিন
              </button>
            ))}
          </div>
        }
      />
      <ErrorBanner message={error} onRetry={() => reload()} />
      {loading && !data ? (
        <Spinner />
      ) : data && t ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <StatTile icon={Inbox} label="নতুন ডেমো রিকোয়েস্ট" value={fmtNum(t.leadsNew)} note="এখনো যোগাযোগ হয়নি" to="/admin/leads" />
            <StatTile icon={TrendingUp} label="মোট রিকোয়েস্ট" value={fmtNum(t.leadsPeriod)} note={`${periodLabel} • কনভার্শন ${fmtNum(conversion)}%`} />
            <StatTile icon={CalendarClock} label="আসন্ন বুকিং" value={fmtNum(t.bookingsUpcoming)} note={`${fmtNum(t.bookingsPending)}টি নিশ্চিত করা বাকি`} to="/admin/bookings" />
            <StatTile icon={MessagesSquare} label="অপঠিত চ্যাট" value={fmtNum(t.chatsUnread)} note="উত্তরের অপেক্ষায়" to="/admin/chats" />
            <StatTile icon={Users} label="সক্রিয় প্রকাশক" value={fmtNum(t.publishersActive)} note="লগইন অ্যাকাউন্ট" to="/admin/users" />
          </div>

          <Card
            title={`দৈনিক কার্যক্রম — ${periodLabel}`}
            actions={
              <button
                onClick={() => setShowTable((s) => !s)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-[#064E3B] hover:bg-[#ECFDF5]"
              >
                {showTable ? <BarChart3 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
                {showTable ? 'চার্ট দেখুন' : 'টেবিল দেখুন'}
              </button>
            }
          >
            {showTable ? (
              <div className="max-h-72 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white text-left text-[#0B192C]/60">
                    <tr>
                      <th className="py-1.5 font-bold">তারিখ</th>
                      {SERIES.map((s) => (
                        <th key={s.key} className="py-1.5 text-right font-bold">
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.daily].reverse().map((d) => (
                      <tr key={d.date} className="border-t border-[#0B192C]/5">
                        <td className="py-1.5 font-medium">{fmtDay(d.date)}</td>
                        <td className="py-1.5 text-right font-bold">{fmtNum(d.leads)}</td>
                        <td className="py-1.5 text-right font-bold">{fmtNum(d.bookings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <Legend series={SERIES} />
                <StackedColumns data={data.daily} series={SERIES} />
              </div>
            )}
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="প্ল্যান অনুযায়ী রিকোয়েস্ট">
              <HBars rows={data.leadsByPlan} />
            </Card>
            <Card title="প্রতিষ্ঠানের ধরন">
              <HBars rows={data.leadsByPressType} />
            </Card>
            <Card title="রিকোয়েস্টের অবস্থা">
              <HBars
                rows={Object.keys(LEAD_STATUS)
                  .map((k) => ({ label: k, value: data.leadsByStatus.find((r) => r.label === k)?.value ?? 0 }))
                  .filter((r) => r.value > 0)}
                labelFor={(k) => LEAD_STATUS[k]?.label ?? k}
              />
            </Card>
          </div>

          <Card title="আসন্ন বুকিং" actions={<Link to="/admin/bookings" className="text-[11px] font-bold text-[#064E3B] hover:underline">সব দেখুন →</Link>}>
            {data.upcomingBookings.length === 0 ? (
              <p className="py-4 text-center text-xs font-semibold text-[#0B192C]/50">কোনো আসন্ন বুকিং নেই</p>
            ) : (
              <ul className="divide-y divide-[#0B192C]/5">
                {data.upcomingBookings.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs">
                    <div>
                      <div className="font-bold text-[#0B192C]">
                        {b.name} <span className="font-medium text-[#0B192C]/60">• {b.pressName}</span>
                      </div>
                      <div className="font-medium text-[#0B192C]/60">
                        {BOOKING_KIND[b.kind]} • {fmtDay(b.date)}, {b.time}
                      </div>
                    </div>
                    <StatusBadge map={BOOKING_STATUS} value={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </>
  );
}
