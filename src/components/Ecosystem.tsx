import React, { useState } from 'react';
import { Monitor, Package, ShieldCheck, BookOpen, Download, LineChart, Table2, Users } from 'lucide-react';

type Category = 'counter' | 'catalog' | 'insights';

interface Card {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  tag: string;
  tagCls: string;
  hover: string;
  title: string;
  lead: string;
  leadCls: string;
  body: string;
  mock: React.ReactNode;
}

const Mock: React.FC<{ title: string; right: string; rightCls?: string; sub: string; subRight: string }> = ({
  title,
  right,
  rightCls = 'text-[#064E3B]',
  sub,
  subRight,
}) => (
  <div className="rounded-xl bg-[#FAF9F5] p-3 border border-[#0B192C]/10 shadow-2xs space-y-1.5 text-xs">
    <div className="flex justify-between gap-2 font-bold">
      <span className="text-[#0B192C]">{title}</span>
      <span className={rightCls}>{right}</span>
    </div>
    <div className="flex justify-between gap-2 text-[#0B192C]/70 text-[11px] font-medium">
      <span>{sub}</span>
      <span className="font-bold text-[#0B192C]/80">{subRight}</span>
    </div>
  </div>
);

const CONTENT: Record<Category, { heading: string; intro: string; cards: Card[] }> = {
  counter: {
    heading: 'কাউন্টারে দ্রুত বিক্রি, দিনশেষে সঠিক ক্যাশ',
    intro: 'ISBN স্ক্যান থেকে রিসিট পর্যন্ত — আর সেশন বন্ধের সময় গোনা টাকার সাথে বিক্রির মিল।',
    cards: [
      {
        icon: Monitor,
        iconBg: 'bg-[#064E3B]',
        tag: 'ISBN = বারকোড',
        tagCls: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
        hover: 'hover:border-[#064E3B]',
        title: 'বই কাউন্টার',
        lead: 'বইয়ের পেছনের বারকোড স্ক্যান করলেই অর্ডারে।',
        leadCls: 'text-[#064E3B]',
        body: 'শিরোনাম, লেখক, প্রকাশক, ধরন, সিরিজ বা ISBN দিয়ে খোঁজা; বইয়ের কার্ডে লেখক ও বাকি কপি; লাইনভিত্তিক ছাড়, রিফান্ড, ক্যাশ ও কার্ডে পেমেন্ট এবং লেখকের নামসহ রিসিট।',
        mock: <Mock title="কাউন্টার ১ • ৩টি বই" right="৳৮৭০" sub="চিলেকোঠার সেপাই, নকশী কাঁথার মাঠ…" subRight="ক্যাশ" />,
      },
      {
        icon: ShieldCheck,
        iconBg: 'bg-[#0B192C]',
        tag: 'বইমেলা মোড',
        tagCls: 'bg-[#EFF6FF] text-[#1E3A8A] border-[#1E3A8A]/30',
        hover: 'hover:border-[#0B192C]',
        title: 'হিসাবের ঝামেলাহীন কাউন্টার',
        lead: 'স্টক মুভ, জার্নাল এন্ট্রি বা ইনভয়েস ছাড়াই বিক্রি।',
        leadCls: 'text-[#1E3A8A]',
        body: 'বইমেলা মোড কাউন্টারপ্রতি চালু থাকে। ইনভেন্টরি ও ইনভয়েসিং মেনু কর্মীদের কাছে লুকানো; প্রয়োজনে মোড বন্ধ করলেই সেই কাউন্টারে পূর্ণ হিসাব চালু।',
        mock: <Mock title="সেশন বন্ধ: কোনো জার্নাল এন্ট্রি নেই" right="✓" sub="অর্ডারগুলো বন্ধ হিসেবে চিহ্নিত" subRight="বইমেলা মোড চালু" />,
      },
      {
        icon: Users,
        iconBg: 'bg-[#831843]',
        tag: 'সেশন ও ক্যাশ',
        tagCls: 'bg-[#FFE4E6] text-[#831843] border-[#831843]/30',
        hover: 'hover:border-[#831843]',
        title: 'সেশন, ক্যাশিয়ার ও ক্যাশ গণনা',
        lead: 'খোলার সময় ফ্লোট, বন্ধের সময় গোনা টাকা।',
        leadCls: 'text-[#831843]',
        body: 'প্রতিটি কাউন্টারের আলাদা সেশন। বন্ধের সময় গোনা ক্যাশ ও প্রত্যাশিত ক্যাশের পার্থক্য সেশনে লেখা থাকে; ক্যাশিয়ার ও ম্যানেজারের আলাদা অনুমতি।',
        mock: <Mock title="সেশন #১৪ • তানভীর" right="পার্থক্য ৳০" sub="শুরুর ফ্লোট ৳২,০০০" subRight="গোনা ৳৮,২২৮" />,
      },
    ],
  },
  catalog: {
    heading: 'বইয়ের জন্য তৈরি ক্যাটালগ, সহজ স্টক',
    intro: 'সাধারণ "পণ্য" নয় — লেখক, প্রকাশক, ধরন ও ISBN নিয়ে বই; আর প্রতিটি বইয়ের হাতে কত কপি আছে।',
    cards: [
      {
        icon: BookOpen,
        iconBg: 'bg-[#064E3B]',
        tag: 'বই ক্যাটালগ',
        tagCls: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
        hover: 'hover:border-[#064E3B]',
        title: 'বই, লেখক, প্রকাশক ও ধরন',
        lead: 'প্রতিটি লেখক বা প্রকাশকের সব বই এক ক্লিকে।',
        leadCls: 'text-[#064E3B]',
        body: 'শিরোনাম, উপশিরোনাম, একাধিক লেখক, প্রকাশক, ধরন ও উপধরন, সিরিজ ও খণ্ড, সংস্করণ, ভাষা, ফরম্যাট, পৃষ্ঠা, প্রকাশকাল, বয়সভিত্তিক শ্রেণি, প্রচ্ছদ ও বিক্রিত কপি।',
        mock: <Mock title="হুমায়ূন আহমেদ" right="৩টি বই" sub="দেবী, ময়ূরাক্ষী…" subRight="১২ কপি বিক্রিত" />,
      },
      {
        icon: Download,
        iconBg: 'bg-[#0B192C]',
        tag: 'ISBN টুলস',
        tagCls: 'bg-[#EFF6FF] text-[#1E3A8A] border-[#1E3A8A]/30',
        hover: 'hover:border-[#0B192C]',
        title: 'ISBN যাচাই ও তথ্য আনা',
        lead: 'ভুল বা ডুপ্লিকেট ISBN ক্যাটালগে ঢোকে না।',
        leadCls: 'text-[#1E3A8A]',
        body: 'ISBN-10 বা ISBN-13 হাইফেনসহ বা ছাড়া লিখুন — যাচাই করে ISBN-13 হিসেবে রাখে ও বারকোডে বসায়। এক ক্লিকে Open Library থেকে শিরোনাম, লেখক, প্রকাশক, পৃষ্ঠা, প্রকাশকাল ও প্রচ্ছদ।',
        mock: <Mock title="0-14-044913-2" right="→ 978-0-14-044913-6" sub="ISBN-10 থেকে ISBN-13" subRight="বৈধ ✓" />,
      },
      {
        icon: Package,
        iconBg: 'bg-[#B45309]',
        tag: 'স্টক অন হ্যান্ড',
        tagCls: 'bg-[#FFFBEB] text-[#B45309] border-[#D97706]/30',
        hover: 'hover:border-[#D97706]',
        title: 'বইপ্রতি বাকি কপি',
        lead: 'গুদাম বা চালান ছাড়া — শুধু হাতে কত কপি।',
        leadCls: 'text-[#B45309]',
        body: 'প্রতিটি বিক্রিতে কপি কমে, রিফান্ডে ফেরত আসে; কাউন্টারে প্রতিটি বইয়ের কার্ডে বাকি কপি দেখায়। গণনার তালিকায় সংখ্যা ঠিক করুন — প্রতিটি পরিবর্তন লগে থাকে।',
        mock: <Mock title="ইতিহাসের আলোয় বাংলাদেশ" right="৩ কপি বাকি" rightCls="text-[#B45309]" sub="গণনা: ১০ → ৩" subRight="লগে সংরক্ষিত" />,
      },
    ],
  },
  insights: {
    heading: 'কী বিক্রি হচ্ছে, কখন, কার হাতে',
    intro: 'এক বা একাধিক কাউন্টার ও যেকোনো সময়সীমা বেছে নিয়ে পুরো বিক্রির ছবি — এক্সেল শিট বানানো ছাড়াই।',
    cards: [
      {
        icon: LineChart,
        iconBg: 'bg-[#064E3B]',
        tag: 'ড্যাশবোর্ড',
        tagCls: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
        hover: 'hover:border-[#064E3B]',
        title: 'বইমেলা ড্যাশবোর্ড',
        lead: '৮টি মূল সংখ্যা, আগের সময়ের সাথে তুলনা।',
        leadCls: 'text-[#064E3B]',
        body: 'আয়, অর্ডার, বিক্রিত বই, গড় বাস্কেট, ভিন্ন শিরোনাম, অর্ডারপ্রতি বই, প্রদত্ত ছাড় ও ফেরত; দৈনিক আয়, ঘণ্টাপ্রতি অর্ডার, শীর্ষ বই-লেখক-প্রকাশক, ধরনভিত্তিক আয়, পেমেন্ট পদ্ধতি ও ক্যাশিয়ার পারফরম্যান্স।',
        mock: <Mock title="গত ৭ দিন" right="৳৩৬,৩৯৮" sub="৪১ অর্ডার • ৯০ কপি" subRight="গড় ৳৮৮৮" />,
      },
      {
        icon: Table2,
        iconBg: 'bg-[#B45309]',
        tag: 'বিশ্লেষণ',
        tagCls: 'bg-[#FFFBEB] text-[#B45309] border-[#D97706]/30',
        hover: 'hover:border-[#D97706]',
        title: 'বই বিক্রয় বিশ্লেষণ',
        lead: 'যেভাবে খুশি ভাগ করে দেখুন, এক্সেলে নামিয়ে নিন।',
        leadCls: 'text-[#B45309]',
        body: 'প্রতিটি বিক্রিত লাইন শিরোনাম, প্রধান লেখক, প্রকাশক, ধরন, ফরম্যাট, ক্যাশিয়ার, কাউন্টার, সেশন বা দিন অনুযায়ী পিভট, গ্রাফ ও তালিকায়।',
        mock: <Mock title="প্রকাশক × ধরন" right="পিভট" rightCls="text-[#B45309]" sub="সারি: প্রকাশক • কলাম: ধরন" subRight="Excel ↓" />,
      },
    ],
  },
};

const TABS: { id: Category; label: string; active: string }[] = [
  { id: 'counter', label: '১. কাউন্টার ও সেশন (Counter)', active: 'bg-[#0B192C]' },
  { id: 'catalog', label: '২. বই ক্যাটালগ ও স্টক (Catalogue)', active: 'bg-[#064E3B]' },
  { id: 'insights', label: '৩. ড্যাশবোর্ড ও রিপোর্ট (Insights)', active: 'bg-[#831843]' },
];

export const Ecosystem: React.FC = () => {
  const [active, setActive] = useState<Category>('counter');
  const content = CONTENT[active];

  return (
    <section id="ecosystem" className="py-24 bg-[#FAF9F5] border-t border-[#0B192C]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            যা যা পাচ্ছেন (What you get)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C]">
            বই বিক্রির প্রতিটি ধাপ, এক সিস্টেমে।
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            অমর একুশে বইমেলার স্টল, প্রকাশনীর শোরুম বা বইয়ের দোকান — কাউন্টার, ক্যাটালগ, স্টক আর রিপোর্ট একসাথে।
          </p>
        </div>

        <div role="tablist" className="mt-10 flex flex-wrap gap-2 sm:gap-3 border-b border-[#0B192C]/15 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                active === t.id
                  ? `${t.active} text-white shadow-sm`
                  : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">{content.heading}</h3>
            <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 max-w-3xl font-medium">{content.intro}</p>
          </div>

          <div className={`grid grid-cols-1 gap-6 pt-4 ${content.cards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {content.cards.map((c) => (
              <div
                key={c.title}
                className={`group rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between ${c.hover} hover:shadow-lg transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-xl ${c.iconBg} text-white flex items-center justify-center shadow-xs`}>
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${c.tagCls}`}>{c.tag}</span>
                  </div>
                  <h4 className="mt-5 text-lg font-bold text-[#0B192C]">{c.title}</h4>
                  <p className={`mt-1 text-sm font-bold ${c.leadCls}`}>{c.lead}</p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">{c.body}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">{c.mock}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
