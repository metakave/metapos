import React, { useState } from 'react';
import { Monitor, BookOpen, Package, LineChart, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface ProductsPageProps {
  onOpenDemo: (module?: string) => void;
}

type Category = 'counter' | 'catalog' | 'reports';

interface Product {
  id: string;
  category: Category;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  description: string;
  features: string[];
  specs: [string, string][];
  preview: { label: string; text: string };
}

// Everything on this page describes what the MetaPOS book counter does today
// (Odoo 19 Point of Sale with the Book Fair POS and Book Fair Stock modules).
const PRODUCTS: Product[] = [
  {
    id: 'counter',
    category: 'counter',
    title: 'বই কাউন্টার — বইমেলা ও শোরুমের পিওএস',
    badge: 'ISBN স্ক্যান রেডি',
    icon: Monitor,
    badgeColor: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
    description:
      'বইয়ের পেছনের ISBN বারকোড স্ক্যান করলেই বই অর্ডারে উঠে যায়। ব্রাউজারে চলে, তাই কম্পিউটার, ল্যাপটপ বা ট্যাবলেট — যেকোনো ডিভাইসে স্টলের কাউন্টার খুলুন।',
    features: [
      'ISBN-13 নিজেই বারকোড — আলাদা স্টিকার ছাপাতে হয় না।',
      'শিরোনাম, লেখক, প্রকাশক, ধরন, সিরিজ, ISBN-13 বা ISBN-10 দিয়ে মুহূর্তে বই খোঁজা।',
      'বইয়ের কার্ডে লেখকের নাম ও কত কপি বাকি আছে তা দেখা যায়।',
      'লাইনভিত্তিক ছাড় (%), পরিমাণ পরিবর্তন ও বই ফেরত (রিফান্ড)।',
      'ক্যাশ ও কার্ডে পেমেন্ট, একাধিক পদ্ধতিতে ভাগ করে পরিশোধ ও ফেরত টাকার হিসাব।',
      'রিসিটে বইয়ের নামের নিচে লেখকের নাম; যেকোনো প্রিন্টারে প্রিন্ট।',
    ],
    specs: [
      ['ডিভাইস', 'কম্পিউটার, ল্যাপটপ, ট্যাবলেট (আধুনিক ব্রাউজার)'],
      ['স্ক্যানার', 'যেকোনো ইউএসবি/ওয়্যারলেস বারকোড স্ক্যানার'],
      ['ভাষা', 'সম্পূর্ণ বাংলা ইন্টারফেস'],
    ],
    preview: { label: 'কাউন্টার স্ক্রিন', text: 'বাম পাশে বইয়ের কার্ড, ডান পাশে অর্ডার, ছাড় ও পেমেন্ট।' },
  },
  {
    id: 'catalog',
    category: 'catalog',
    title: 'বই ক্যাটালগ ও ISBN ব্যবস্থাপনা',
    badge: 'বইয়ের জন্য তৈরি',
    icon: BookOpen,
    badgeColor: 'bg-[#EFF6FF] text-[#1E3A8A] border-[#1E3A8A]/30',
    description:
      'সাধারণ "পণ্য" নয় — প্রতিটি বই তার লেখক, প্রকাশক, ধরন ও সংস্করণসহ সংরক্ষিত থাকে। লেখক, প্রকাশক ও ধরনের নিজস্ব তালিকা থেকে তাদের সব বই এক ক্লিকে দেখা যায়।',
    features: [
      'শিরোনাম, উপশিরোনাম, একাধিক লেখক, প্রকাশক, ধরন ও উপধরন।',
      'সিরিজ ও খণ্ড, সংস্করণ, ভাষা, ফরম্যাট (হার্ডকভার/পেপারব্যাক), পৃষ্ঠা, প্রকাশকাল, বয়সভিত্তিক শ্রেণি।',
      'ISBN-10 বা ISBN-13 (হাইফেনসহ বা ছাড়া) যাচাই করে ISBN-13 হিসেবে সংরক্ষণ; ডুপ্লিকেট ISBN গ্রহণ করে না।',
      '"ISBN থেকে তথ্য আনুন" বোতাম — Open Library থেকে শিরোনাম, লেখক, প্রকাশক, পৃষ্ঠা, প্রকাশকাল ও প্রচ্ছদ।',
      'প্রচ্ছদের ছবি, পেছনের প্রচ্ছদের লেখা, ক্রয়মূল্য ও বিক্রয়মূল্য।',
      'এক্সেল/CSV থেকে পুরো ক্যাটালগ একবারে ইমপোর্ট।',
    ],
    specs: [
      ['ISBN', 'ISBN-10 ও ISBN-13, স্বয়ংক্রিয় রূপান্তর'],
      ['তালিকা', 'বই, লেখক, প্রকাশক, ধরন'],
      ['অনলাইন তথ্য', 'Open Library (আন্তর্জাতিক বইয়ের জন্য)'],
    ],
    preview: { label: 'বইয়ের ফর্ম', text: 'ISBN লিখে এক ক্লিকে বাকি তথ্য ও প্রচ্ছদ পূরণ।' },
  },
  {
    id: 'stock',
    category: 'catalog',
    title: 'স্টক অন হ্যান্ড — বইপ্রতি একটি সংখ্যা',
    badge: 'সহজ স্টক',
    icon: Package,
    badgeColor: 'bg-[#FFFBEB] text-[#B45309] border-[#D97706]/30',
    description:
      'গুদাম, লোকেশন বা চালানের জটিলতা ছাড়া — প্রতিটি বইয়ের হাতে কত কপি আছে শুধু সেটুকু। স্টলের জন্য ঠিক যতটুকু দরকার।',
    features: [
      'প্রতিটি বিক্রিতে স্বয়ংক্রিয়ভাবে কপি কমে, ফেরত এলে আবার যোগ হয়।',
      'কাউন্টারে প্রতিটি বইয়ের কার্ডে বাকি কপির সংখ্যা দেখায়।',
      'গণনার জন্য আলাদা "স্টক অন হ্যান্ড" তালিকা — সরাসরি সংখ্যা ঠিক করুন।',
      'প্রতিটি হাতে-করা পরিবর্তন বইয়ের ইতিহাসে (লগ) লেখা থাকে।',
    ],
    specs: [
      ['পদ্ধতি', 'বইপ্রতি হাতে থাকা কপি'],
      ['হালনাগাদ', 'বিক্রি ও রিফান্ডে স্বয়ংক্রিয়'],
      ['বইমেলা মোড', 'চালু থাকলেও কাজ করে'],
    ],
    preview: { label: 'স্টক তালিকা', text: 'মেলা শুরুর আগে গুনে বসান, দিনশেষে মিলিয়ে নিন।' },
  },
  {
    id: 'dashboard',
    category: 'reports',
    title: 'বইমেলা ড্যাশবোর্ড ও বিক্রয় বিশ্লেষণ',
    badge: 'লাইভ রিপোর্ট',
    icon: LineChart,
    badgeColor: 'bg-[#FFE4E6] text-[#831843] border-[#831843]/30',
    description:
      'আজ, গতকাল, ৭ দিন, ৩০ দিন, এই মাস, এই বছর বা নিজের পছন্দের তারিখ — এক বা একাধিক কাউন্টার বেছে নিয়ে এক নজরে পুরো বিক্রির ছবি।',
    features: [
      'আয়, অর্ডার, বিক্রিত কপি, গড় বাস্কেট, ভিন্ন শিরোনাম, অর্ডারপ্রতি বই, প্রদত্ত ছাড় ও ফেরত — আগের সময়ের সাথে তুলনাসহ।',
      'দৈনিক আয় এবং ঘণ্টাপ্রতি অর্ডার — স্টলের ব্যস্ততম সময় চিহ্নিত করুন।',
      'শীর্ষ ১০ বই, শীর্ষ লেখক, শীর্ষ প্রকাশক ও ধরনভিত্তিক আয়।',
      'পেমেন্ট পদ্ধতির ভাগ ও ক্যাশিয়ার পারফরম্যান্স (অর্ডার, কপি, গড় বাস্কেট, আয়)।',
      'বই বিক্রয় বিশ্লেষণ: শিরোনাম, লেখক, প্রকাশক, ধরন, ফরম্যাট, ক্যাশিয়ার, কাউন্টার বা দিন অনুযায়ী পিভট ও গ্রাফ।',
    ],
    specs: [
      ['সময়সীমা', 'আজ থেকে এই বছর, বা কাস্টম তারিখ'],
      ['ফিল্টার', 'এক বা একাধিক কাউন্টার'],
      ['এক্সপোর্ট', 'Excel (পিভট ও তালিকা)'],
    ],
    preview: { label: 'ড্যাশবোর্ড', text: 'প্রতিটি ব্লক থেকে সরাসরি বই, লেখক বা সেশনের বিস্তারিত তালিকায়।' },
  },
  {
    id: 'bookfair-mode',
    category: 'counter',
    title: 'বইমেলা মোড, সেশন ও ক্যাশ হিসাব',
    badge: 'হিসাবের ঝামেলা নেই',
    icon: ShieldCheck,
    badgeColor: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
    description:
      'মেলার স্টলে জার্নাল এন্ট্রি, চালান বা ইনভয়েসের দরকার নেই। বইমেলা মোডে কাউন্টার শুধু বিক্রি আর ক্যাশ হিসাবে মন দেয় — প্রয়োজনে যেকোনো কাউন্টারে পূর্ণ হিসাব আবার চালু করা যায়।',
    features: [
      'কাউন্টারপ্রতি চালু/বন্ধ করা যায়; নতুন কাউন্টারে ডিফল্টভাবে চালু।',
      'স্টক মুভ, জার্নাল এন্ট্রি ও ইনভয়েস তৈরি হয় না — হিসাব পরিষ্কার থাকে।',
      'সেশন খোলার সময় ক্যাশ ফ্লোট, বন্ধের সময় গোনা টাকা; পার্থক্য সেশনে লেখা থাকে।',
      'ইনভেন্টরি ও ইনভয়েসিং মেনু সাধারণ কর্মীদের কাছে লুকানো থাকে।',
      'ক্যাশিয়ার ও ম্যানেজারের আলাদা অনুমতি।',
    ],
    specs: [
      ['সেটিং', 'প্রতি কাউন্টারে আলাদা'],
      ['সেশন বন্ধ', 'ক্যাশ গণনা ও পার্থক্য নোট'],
      ['পূর্ণ হিসাব', 'মোড বন্ধ করলেই স্বাভাবিক হিসাব'],
    ],
    preview: { label: 'সেশন সারাংশ', text: 'দিনশেষে অর্ডার, আয় ও ক্যাশ পার্থক্য এক জায়গায়।' },
  },
];

const TABS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: `সবগুলো মডিউল (${PRODUCTS.length})` },
  { id: 'counter', label: 'কাউন্টার ও বইমেলা মোড' },
  { id: 'catalog', label: 'বই ক্যাটালগ ও স্টক' },
  { id: 'reports', label: 'ড্যাশবোর্ড ও রিপোর্ট' },
];

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'all' | Category>('all');
  const filtered = activeTab === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <div className="pt-28 pb-24 bg-[#FBFBFA]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            প্রোডাক্ট (Products Overview)
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C] leading-tight">
            বই বিক্রির জন্য তৈরি একটি সম্পূর্ণ বাংলা পিওএস।
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80 font-normal">
            ISBN স্ক্যান করে বিক্রি, লেখক-প্রকাশকসহ বইয়ের ক্যাটালগ, বাকি কপির হিসাব আর দিনশেষের ড্যাশবোর্ড — অমর একুশে বইমেলার স্টল থেকে নিয়মিত শোরুম পর্যন্ত।
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#0B192C]/10 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              aria-pressed={activeTab === t.id}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Detailed Products List */}
        <div className="mt-12 space-y-12">
          {filtered.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 sm:p-8 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Description */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold border ${p.badgeColor}`}>{p.badge}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#0B192C]">{p.title}</h3>
                    <p className="mt-2 text-sm text-[#0B192C]/80 leading-relaxed font-medium">{p.description}</p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {p.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-[#0B192C]">
                        <div className="h-4 w-4 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5 border border-[#064E3B]/30">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => onOpenDemo(p.title)}
                      className="rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#043E2F] transition-all flex items-center gap-2"
                    >
                      <span>এই মডিউলটির লাইভ ডেমো দেখুন</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Specs */}
                <div className="lg:col-span-5 rounded-xl border border-[#0B192C]/10 bg-[#FAF9F5] p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#0B192C]/10 pb-3">
                    <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">বিস্তারিত তথ্য</span>
                    <span className="text-[10px] font-bold text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded">এখনই ব্যবহারযোগ্য</span>
                  </div>

                  <dl className="space-y-3 text-xs">
                    {p.specs.map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start gap-3">
                        <dt className="text-[#0B192C]/60 font-semibold">{label}</dt>
                        <dd className="text-right text-[#0B192C] font-bold">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 rounded-lg bg-white p-3 border border-[#0B192C]/10 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#0B192C]">
                      <span>{p.preview.label}</span>
                      <span className="text-[#064E3B]">MetaPOS</span>
                    </div>
                    <p className="text-[10px] text-[#0B192C]/60 font-medium">{p.preview.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
