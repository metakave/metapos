import React, { useState } from 'react';
import { Barcode, ShieldCheck, Wallet, CheckCircle2, XCircle } from 'lucide-react';

// Same rules as the Book Fair POS ISBN logic: accept ISBN-10 or ISBN-13 with
// or without hyphens/spaces, validate the check digit, store as ISBN-13.
function checkIsbn(raw: string): { ok: true; isbn13: string; isbn10: string | null } | { ok: false; reason: string } {
  const s = raw.replace(/[\s-]/g, '').toUpperCase();
  if (!s) return { ok: false, reason: 'একটি ISBN লিখুন' };
  if (/^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((acc, ch, i) => acc + (ch === 'X' ? 10 : Number(ch)) * (10 - i), 0);
    if (sum % 11 !== 0) return { ok: false, reason: 'ISBN-10-এর চেক ডিজিট মিলছে না' };
    const body = '978' + s.slice(0, 9);
    return { ok: true, isbn13: body + isbn13Check(body), isbn10: s };
  }
  if (/^\d{13}$/.test(s)) {
    if (!s.startsWith('978') && !s.startsWith('979')) return { ok: false, reason: 'ISBN-13 অবশ্যই 978 বা 979 দিয়ে শুরু হয়' };
    if (isbn13Check(s.slice(0, 12)) !== s[12]) return { ok: false, reason: 'ISBN-13-এর চেক ডিজিট মিলছে না' };
    return { ok: true, isbn13: s, isbn10: s.startsWith('978') ? toIsbn10(s) : null };
  }
  return { ok: false, reason: 'ISBN-এ ১০ বা ১৩টি অঙ্ক থাকতে হবে' };
}

function isbn13Check(first12: string) {
  const sum = [...first12].reduce((acc, d, i) => acc + Number(d) * (i % 2 ? 3 : 1), 0);
  return String((10 - (sum % 10)) % 10);
}

function toIsbn10(isbn13: string) {
  const body = isbn13.slice(3, 12);
  const sum = [...body].reduce((acc, d, i) => acc + Number(d) * (10 - i), 0);
  const check = (11 - (sum % 11)) % 11;
  return body + (check === 10 ? 'X' : String(check));
}

const BOOK_FAIR_MODE: [string, string][] = [
  ['স্টক', 'কোনো পিকিং বা স্টক মুভ তৈরি হয় না'],
  ['হিসাব', 'সেশন বন্ধে কোনো জার্নাল এন্ট্রি পোস্ট হয় না'],
  ['ক্যাশ গণনা', 'ফ্লোট ও গোনা টাকা রাখা হয়; পার্থক্য সেশনে নোট হিসেবে'],
  ['ইনভয়েস', 'পেমেন্ট স্ক্রিন ও রিসিট থেকে ইনভয়েস অপশন সরানো'],
  ['ক্যাশ ইন/আউট', 'লুকানো থাকে'],
  ['মেনু', 'ইনভেন্টরি ও ইনভয়েসিং অ্যাপ সাধারণ ব্যবহারকারীর কাছে লুকানো'],
];

export const BentoShowcase: React.FC = () => {
  const [tab, setTab] = useState<'isbn' | 'mode' | 'session'>('isbn');
  const [input, setInput] = useState('0-14-044913-2');
  const result = checkIsbn(input);

  const tabs = [
    { id: 'isbn' as const, label: 'ISBN যাচাই করে দেখুন', icon: Barcode },
    { id: 'mode' as const, label: 'বইমেলা মোডে কী বন্ধ থাকে', icon: ShieldCheck },
    { id: 'session' as const, label: 'দিনশেষে সেশন বন্ধ', icon: Wallet },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
        <div className="max-w-2xl mb-12">
          <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            বই বিক্রির জন্যই তৈরি
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            ছোট ছোট খুঁটিনাটি, যা বইয়ের দোকানে সত্যিই কাজে লাগে।
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            নিচের ট্যাবগুলোতে দেখুন MetaPOS কীভাবে ISBN, বইমেলার কাউন্টার আর দিনশেষের ক্যাশ হিসাব সামলায়।
          </p>
        </div>

        <div role="tablist" className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          {tab === 'isbn' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <label htmlFor="isbn-try" className="block text-sm font-bold text-white">
                  যেকোনো ISBN-10 বা ISBN-13 লিখুন
                </label>
                <input
                  id="isbn-try"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={20}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-base text-white focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400">
                  হাইফেন বা স্পেস থাকলেও চলবে। বই সেভ করার সময় কাউন্টারও ঠিক এভাবেই যাচাই করে এবং ISBN-13-কে বারকোড হিসেবে বসিয়ে দেয়।
                </p>
              </div>
              <div aria-live="polite" className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3 text-sm">
                {result.ok ? (
                  <>
                    <p className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" /> বৈধ ISBN
                    </p>
                    <div className="flex justify-between gap-3 border-t border-slate-800 pt-3">
                      <span className="text-slate-400">ISBN-13 (বারকোড)</span>
                      <span className="font-mono font-bold text-white">{result.isbn13}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">ISBN-10</span>
                      <span className="font-mono font-bold text-white">{result.isbn10 ?? '— (979 ISBN-এর ISBN-10 হয় না)'}</span>
                    </div>
                  </>
                ) : (
                  <p className="flex items-center gap-2 font-bold text-rose-400">
                    <XCircle className="h-5 w-5" /> {result.reason}
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === 'mode' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white">বইমেলা মোড — প্রতি কাউন্টারে আলাদা, নতুন কাউন্টারে ডিফল্টভাবে চালু</h4>
                <p className="text-xs text-slate-400">স্টলে শুধু বিক্রি আর ক্যাশ — বাকি হিসাবের কাজ চাইলে পরে মোড বন্ধ করে চালু করুন।</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {BOOK_FAIR_MODE.map(([area, effect]) => (
                  <div key={area} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
                    <span className="w-24 shrink-0 font-bold text-emerald-400">{area}</span>
                    <span className="text-slate-300">{effect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'session' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {[
                ['শুরুর ক্যাশ ফ্লোট', '৳২,০০০', 'সেশন খোলার সময় গোনা'],
                ['ক্যাশে বিক্রি', '৳৬,২২৮', '১৪টি অর্ডার'],
                ['প্রত্যাশিত ক্যাশ', '৳৮,২২৮', 'ফ্লোট + ক্যাশ বিক্রি'],
              ].map(([label, value, note]) => (
                <div key={label} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400">{label}</span>
                  <p className="text-lg font-bold text-white mt-1">{value}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{note}</p>
                </div>
              ))}
              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-300">গোনা ক্যাশ</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">৳৮,২০০</p>
                <p className="text-[10px] text-emerald-300 mt-1">পার্থক্য −৳২৮ — সেশনের নোটে লেখা হলো</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
