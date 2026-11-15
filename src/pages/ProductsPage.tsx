import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Package, 
  Calculator, 
  LineChart, 
  Store, 
  WifiOff, 
  ArrowRight, 
  Check, 
  QrCode, 
  Layers, 
  Sparkles,
  BookOpen,
  Truck,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface ProductsPageProps {
  onOpenDemo: (module?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pos' | 'royalties' | 'warehouse' | 'online'>('all');

  const products = [
    {
      id: 'pos',
      category: 'pos',
      title: 'MetaPOS Counter — টাচস্ক্রিন বুকস্টোর ও মেলা পিওএস',
      badge: '১০০% অফলাইন সচল',
      icon: Monitor,
      accentColor: 'text-[#064E3B]',
      badgeColor: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
      description: 'অমর একুশে বইমেলার ভিড় বা শোরুমের ব্যস্ত সময়ে নির্বিঘ্ন বিক্রয় নিশ্চিত করতে তৈরি আধুনিক টাচস্ক্রিন পিওএস টার্মিনাল।',
      features: [
        'ইন্টারনেট সংযোগ বিচ্ছিন্ন থাকলেও শতভাগ বিক্রয় ও মেমো প্রিন্ট সচল থাকে।',
        'বইয়ের কভার সহ টাচস্ক্রিন গ্রিড ও বারকোড/ISBN-13 ইনস্ট্যান্ট স্ক্যানার।',
        'বইমেলার ২৫% কমিশন বা বিশেষ ছাড় বোতাম এক ক্লিকে প্রয়োগ।',
        'ক্যাশ, বিকাশ QR, নগদ ও কার্ড স্প্লিট পেমেন্ট সমর্থন।',
        'ব্লুটুথ ও ইউএসবি থার্মাল প্রিন্টারে বাংলা ক্যাশ মেমো ও গ্রাহক চালান প্রিন্ট।',
      ],
      specs: {
        compatibility: 'Windows, Mac, Android ট্যাবলেট ও টাচস্ক্রিন পিওএস মেশিন',
        sync: 'স্বয়ংক্রিয় ক্লাউড সিঙ্ক ব্যাকআপ',
        speed: 'প্রতি মেমো কাটার সময়: ৩-৫ সেকেন্ড',
      },
      previewLabel: 'টাচস্ক্রিন পিওএস ইন্টারফেস',
    },
    {
      id: 'go',
      category: 'pos',
      title: 'MetaPOS Go — বইমেলা ও ভ্রাম্যমাণ মোবাইল বিলিং অ্যাপ',
      badge: 'মোবাইল কিউ বাস্টার',
      icon: Smartphone,
      accentColor: 'text-[#831843]',
      badgeColor: 'bg-[#FFE4E6] text-[#831843] border-[#831843]/30',
      description: 'স্টলের সামনে দীর্ঘ লাইন তৈরি হলে সেলস কর্মীরা স্মার্টফোনের ক্যামেরা দিয়ে বই স্ক্যান করে তাৎক্ষণিক মেমো কাটতে পারবেন।',
      features: [
        'স্মার্টফোনের ক্যামেরা দিয়ে দ্রুততম বারকোড স্ক্যানিং।',
        'গ্রাহকের মোবাইলে বাংলা এসএমএস ডিজিটাল মেমো পাঠানোর সুবিধা।',
        'পোর্টেবল ব্লুটুথ থার্মাল বেল্ট প্রিন্টারের সাথে ওয়্যারলেস সংযোগ।',
        'মেলা চলাকালীন কেন্দ্রীয় গুদামের সাথে তাৎক্ষণিক স্টক হ্রাস সিঙ্ক।',
      ],
      specs: {
        compatibility: 'যেকোনো Android ও iOS স্মার্টফোন',
        hardware: 'পোর্টেবল ব্লুটুথ মিনি রিসিট প্রিন্টার',
        battery: 'অফলাইনে পুরো মেলা দিন ব্যাকআপ',
      },
      previewLabel: 'হ্যান্ডহেল্ড মেলা টার্মিনাল',
    },
    {
      id: 'royalties',
      category: 'royalties',
      title: 'লেখক রয়্যালটি ও ফর্মা কস্টিং লেজার',
      badge: 'স্বচ্ছ অডিট ট্রেইল',
      icon: Calculator,
      accentColor: 'text-[#064E3B]',
      badgeColor: 'bg-[#ECFDF5] text-[#064E3B] border-[#064E3B]/30',
      description: 'এক্সেল শিটের ভুলত্রুটি ও খাতার জটিলতা দূর করে প্রতিটি বইয়ের প্রকৃত উৎপাদন খরচ ও লেখকের চুক্তিভিত্তিক রয়্যালটি হিসাবের পূর্ণাঙ্গ ব্যবস্থা।',
      features: [
        'টায়ার্ড রয়্যালটি চুক্তি (যেমন: ১ম ২,৫০০ কপি ১০%, পরবর্তী ৫,০০০ কপি ১২%)।',
        'লেখককে দেওয়া অগ্রিম সম্মানী (Advance) স্বয়ংক্রিয়ভাবে রয়্যালটি থেকে সমন্বয়।',
        'এক ক্লিকে লেখকের নামে বাংলা PDF রয়্যালটি বিবরণী প্রিন্ট ও ইমেইল।',
        'কাগজের রিম দর (৮০ গ্রাম ডিমাই অফসেট), প্লেট, ফর্মা ও বাঁধাই খরচ ট্র্যাকিং।',
        'বাংলাবাজার ডিস্ট্রিবিউটরদের জন্য ফেরত বইয়ের নিরাপদ রিজার্ভ ফান্ড হিসাব।',
      ],
      specs: {
        export: 'বাংলা PDF স্টেটমেন্ট, Excel ও প্রিন্টেড মেমো',
        reports: 'ত্রৈমাসিক ও বাৎসরিক রয়্যালটি অডিট রিপোর্ট',
        compliance: 'কপিরাইট ও লেখক চুক্তি ফ্রেন্ডলি',
      },
      previewLabel: 'রয়্যালটি লেজার ও ফর্মা কস্টিং',
    },
    {
      id: 'warehouse',
      category: 'warehouse',
      title: 'গুদাম, প্রেস ও কনসাইনমেন্ট ইনভেন্টরি',
      badge: 'মাল্টি-ওয়্যারহাউজ',
      icon: Package,
      accentColor: 'text-[#1E3A8A]',
      badgeColor: 'bg-[#EFF6FF] text-[#1E3A8A] border-[#1E3A8A]/30',
      description: 'বাংলাবাজার প্রধান গুদাম, বইমেলার স্টল, শোরুম এবং রকমারি বা বাতিঘরের কনসাইনমেন্টের নিখুঁত স্টক নিয়ন্ত্রণ।',
      features: [
        'গুদাম থেকে মেলা স্টলে বই ট্রান্সফারের অটোমেটেড চালান ও ট্র্যাকিং।',
        'রকমারি ও অনলাইন সেলারদের নিকট সরবরাহকৃত বইয়ের কনসাইনমেন্ট হিসাব।',
        'জেলা ডিস্ট্রিবিউটর ও নীলক্ষেতের এজেন্সিদের বাকির খাতা ও পেমেন্ট রিকনসিলিয়েশন।',
        'বারকোড ভ্যালিডেশন সহ দ্রুত পিক-অ্যান্ড-প্যাক প্যাকেজিং কিউ।',
      ],
      specs: {
        locations: 'আনলিমিটেড গুদাম, শোরুম ও মেলা স্টল',
        tracking: 'ISBN ও ইউনিক বারকোড ট্র্যাকিং',
        reconciliation: 'কনসাইনমেন্ট বাকি ও ক্যাশ মেমো চালান',
      },
      previewLabel: 'গুদাম ও মেলা স্টক রুটিন',
    },
    {
      id: 'insights',
      category: 'royalties',
      title: 'প্রকাশনা অ্যানালিটিক্স ও এআই সহকারী',
      badge: 'স্মার্ট প্রেডিকশন',
      icon: LineChart,
      accentColor: 'text-[#B45309]',
      badgeColor: 'bg-[#FFFBEB] text-[#B45309] border-[#D97706]/30',
      description: 'লাইভ সেলস ভেলোসিটি বিশ্লেষণ করে কোন বইটির নতুন সংস্করণ ছাপাতে হবে এবং মেলায় কত কপি পাঠাতে হবে তা আগেভাগেই নির্ধারণ করুন।',
      features: [
        'রিসেল ও সেল-থ্রু হারের রিয়েল-টাইম ড্যাশবোর্ড।',
        'প্রেসের জন্য পুনঃমুদ্রণ প্রাক-সংকেত (Reorder Alert)।',
        'জাতীয় গ্রন্থকেন্দ্র ও বিশ্বমানের ক্যাটালগ ক্যাটাগরি ম্যাপিং।',
        'বইয়ের সারসংক্ষেপ থেকে মেটাডাটা ও কি-ওয়ার্ড জেনারেশন।',
      ],
      specs: {
        ai: 'বাংলা ন্যাচারাল ল্যাঙ্গুয়েজ ও ক্যাটালগ প্রসেসর',
        alerts: 'এসএমএস ও ড্যাশবোর্ড নোটিফিকেশন',
        forecasting: 'বইমেলা ও সিজনাল সেলস প্রেডিকশন',
      },
      previewLabel: 'এআই ও প্রকাশনা অ্যানালিটিক্স',
    },
    {
      id: 'storefront',
      category: 'online',
      title: 'অনলাইন বুকস্টোর ও পাইকারি লাইব্রেরি পোর্টাল',
      badge: 'D2C ও B2B হাব',
      icon: Store,
      accentColor: 'text-[#831843]',
      badgeColor: 'bg-[#FFE4E6] text-[#831843] border-[#831843]/30',
      description: 'তৃতীয় পক্ষের উচ্চ কমিশন ছাড়া সরাসরি পাঠকের কাছে প্রি-অর্ডার ও বই বিক্রয় এবং সারা দেশের লাইব্রেরি ও এজেন্টের পাইকারি ক্রয়াদেশ গ্রহণ।',
      features: [
        'প্রকাশনীর নিজস্ব অনলাইন বুকশপ ও প্রি-অর্ডার ক্যাম্পেইন পেজ।',
        'Steadfast, Pathao ও RedX কুরিয়ার অটোমেটেড পার্সেল বুকিং ও ট্র্যাকিং।',
        'ক্যাশ অন ডেলিভারি (COD) পেমেন্ট সংগ্রহ ও রিকনসিলিয়েশন।',
        'বাতিঘর, পাঠক সমাবেশ ও জেলা লাইব্রেরির জন্য পাইকারি ছাড় স্ল্যাব (৪০%-৫০%)।',
      ],
      specs: {
        courier: 'Steadfast, Pathao, RedX ও eCourier এপিআই',
        payments: 'বিকাশ, নগদ, ভিসা/মাস্টারকার্ড ও সিওডি',
        b2b: 'ভ্যাট চালান ও সরকারি ক্রয়ের চালান প্রিন্ট',
      },
      previewLabel: 'অনলাইন ও পাইকারি অর্ডার হাব',
    },
  ];

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="pt-28 pb-24 bg-[#FBFBFA]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Page Header */}
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            প্রোডাক্ট স্যুট (Products Overview)
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C] leading-tight">
            বাংলাদেশের প্রকাশনা শিল্পের জন্য তৈরি সমন্বিত সফটওয়্যার।
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80 font-normal">
            অমর একুশে বইমেলার ভিড় থেকে শুরু করে বাংলাবাজারের গুদাম এবং লেখকদের কাঙ্ক্ষিত স্বচ্ছ রয়্যালটি খাতা—সবকিছুর সমাধান রয়েছে MetaPOS প্ল্যাটফর্মে।
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#0B192C]/10 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            সবগুলো প্রোডাক্ট ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            বইমেলা ও শোরুম পিওএস
          </button>
          <button
            onClick={() => setActiveTab('royalties')}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'royalties'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            লেখক রয়্যালটি ও ফর্মা কস্টিং
          </button>
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'warehouse'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            গুদাম ও মেলা স্টক রুটিন
          </button>
          <button
            onClick={() => setActiveTab('online')}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'online'
                ? 'bg-[#831843] text-white shadow-xs'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            অনলাইন বুকস্টোর ও কুরিয়ার
          </button>
        </div>

        {/* Detailed Products List */}
        <div className="mt-12 space-y-12">
          {filteredProducts.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 sm:p-8 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Description Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#0B192C]">{p.title}</h3>
                    <p className="mt-2 text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                      {p.description}
                    </p>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-2.5 pt-2">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#0B192C]">
                        <div className="h-4 w-4 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5 border border-[#064E3B]/30">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => onOpenDemo(p.title)}
                      className="rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#043E2F] transition-all flex items-center gap-2"
                    >
                      <span>এই মডিউলটির লাইভ ডেমো দেখুন</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Right Specification & Preview Box (5 cols) */}
                <div className="lg:col-span-5 rounded-xl border border-[#0B192C]/10 bg-[#FAF9F5] p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#0B192C]/10 pb-3">
                    <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">
                      টেকনিক্যাল স্পেসিফিকেশন
                    </span>
                    <span className="text-[10px] font-bold text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded">
                      প্রোডাকশন রেডি
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {Object.entries(p.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-start gap-3">
                        <span className="capitalize text-[#0B192C]/60 font-semibold">{key}:</span>
                        <span className="text-right text-[#0B192C] font-bold">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mini Preview Element */}
                  <div className="mt-4 pt-3 border-t border-[#0B192C]/10 rounded-lg bg-white p-3 border border-[#0B192C]/10 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#0B192C]">
                      <span>{p.previewLabel}</span>
                      <span className="text-[#064E3B]">MetaPOS Engine</span>
                    </div>
                    <p className="text-[10px] text-[#0B192C]/60 font-medium">
                      বাংলা ফন্ট, অফলাইন ডাটাবেস ও রিয়েলটাইম সিঙ্কিং সুবিধা সহ বিল্ট-ইন।
                    </p>
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
