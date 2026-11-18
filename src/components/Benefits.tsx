import React, { useState } from 'react';
import { Zap, ShieldCheck, LineChart, ArrowRight, Check, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    title: 'স্টলের লাইনে দ্রুত বিক্রি',
    icon: Zap,
    accentColor: 'text-[#064E3B]',
    bgColor: 'bg-[#ECFDF5]',
    summary: 'বইয়ের পেছনের ISBN স্ক্যান করলেই বই অর্ডারে — নাম টাইপ বা দাম মুখস্থ রাখার দরকার নেই।',
    details: [
      'ISBN-13 নিজেই বারকোড, তাই আলাদা স্টিকার ছাপাতে হয় না।',
      'স্ক্যানার না থাকলে শিরোনাম, লেখক, প্রকাশক, ধরন, সিরিজ বা ISBN-এর অংশ লিখে খুঁজুন।',
      'বইয়ের কার্ডে বাকি কপি দেখায় — শেষ হয়ে যাওয়া বই বিক্রির আগেই চোখে পড়ে।',
    ],
    metric: '১টি স্ক্যান',
    metricLabel: 'বই অর্ডারে তুলতে যথেষ্ট — ISBN-10 ও ISBN-13 দুটোই চেনে',
    preview: {
      tag: 'বই কাউন্টার',
      headline: 'স্ক্যান, ছাড়, পেমেন্ট, রিসিট',
    },
  },
  {
    title: 'হিসাবের ঝামেলা ছাড়া পরিষ্কার ক্যাশ',
    icon: ShieldCheck,
    accentColor: 'text-[#0B192C]',
    bgColor: 'bg-[#F4F4F0]',
    summary: 'বইমেলা মোডে কাউন্টার শুধু বিক্রি আর ক্যাশ সামলায় — জার্নাল এন্ট্রি, স্টক মুভ বা ইনভয়েসের জট নেই।',
    details: [
      'সেশন খোলার সময় ক্যাশ ফ্লোট, বন্ধের সময় গোনা টাকা — পার্থক্য সেশনেই লেখা থাকে।',
      'ইনভেন্টরি ও ইনভয়েসিং মেনু কর্মীদের কাছে লুকানো, তাই ভুল জায়গায় ক্লিকের ভয় নেই।',
      'প্রয়োজন হলে যেকোনো কাউন্টারে মোড বন্ধ করে পূর্ণ হিসাব চালু করা যায়।',
    ],
    metric: '০টি',
    metricLabel: 'জার্নাল এন্ট্রি সেশন বন্ধের সময় — বইমেলা মোডে হিসাব থাকে সহজ',
    preview: {
      tag: 'বইমেলা মোড',
      headline: 'দিনশেষে শুধু টাকা গুনুন',
    },
  },
  {
    title: 'কোন বই চলছে, এক নজরে',
    icon: LineChart,
    accentColor: 'text-[#831843]',
    bgColor: 'bg-[#FFE4E6]',
    summary: 'মেলা চলাকালীনই জানুন কোন বই, লেখক বা প্রকাশক সবচেয়ে বেশি বিক্রি হচ্ছে আর স্টল কখন সবচেয়ে ব্যস্ত।',
    details: [
      'আয়, অর্ডার, বিক্রিত কপি, গড় বাস্কেটসহ ৮টি মূল সংখ্যা — আগের সময়ের সাথে তুলনা।',
      'শীর্ষ ১০ বই, শীর্ষ লেখক ও প্রকাশক, ধরনভিত্তিক আয় এবং ঘণ্টাপ্রতি অর্ডার।',
      'ক্যাশিয়ার পারফরম্যান্স ও পেমেন্ট পদ্ধতির ভাগ; প্রয়োজনে Excel-এ এক্সপোর্ট।',
    ],
    metric: '৮টি',
    metricLabel: 'মূল সংখ্যা এক স্ক্রিনে — আজ, ৭ দিন, ৩০ দিন বা নিজের পছন্দের তারিখে',
    preview: {
      tag: 'বইমেলা ড্যাশবোর্ড',
      headline: 'বিক্রির পুরো ছবি, এক্সেল ছাড়াই',
    },
  },
];

export const Benefits: React.FC = () => {
  const [active, setActive] = useState(0);
  const b = BENEFITS[active];

  return (
    <section id="benefits" className="py-24 bg-white border-t border-[#0B192C]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            সুবিধাসমূহ (Benefits)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C]">খাতা-কলম ছেড়ে কেন MetaPOS?</h2>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            হাতে লেখা মেমো আর দিনশেষের হিসাব মেলানোর বদলে — স্ক্যান করে বিক্রি, নিজে থেকে কমে যাওয়া স্টক আর তৈরি রিপোর্ট।
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            {BENEFITS.map((item, i) => {
              const Icon = item.icon;
              const isSelected = active === i;
              return (
                <button
                  key={item.title}
                  onClick={() => setActive(i)}
                  aria-pressed={isSelected}
                  className={`w-full text-left cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                    isSelected
                      ? 'bg-[#FAF9F5] border-[#064E3B] shadow-lg ring-1 ring-[#064E3B]'
                      : 'bg-white border-[#0B192C]/10 hover:border-[#0B192C]/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${item.bgColor} ${item.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0B192C]">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-[#0B192C]/75 leading-relaxed font-medium">{item.summary}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 rounded-2xl border-2 border-[#0B192C]/10 bg-[#FAF9F5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#0B192C]/10 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold text-[#064E3B]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                {b.preview.tag}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">{b.preview.headline}</h3>
              <p className="mt-2 text-sm text-[#0B192C]/80 font-medium">{b.summary}</p>

              <div className="mt-6 space-y-3">
                {b.details.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5 border border-[#064E3B]/30">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#0B192C] font-medium leading-normal">{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-white border border-[#0B192C]/10 p-5 flex items-center gap-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-[#064E3B] tracking-tight shrink-0">{b.metric}</div>
                <div className="text-xs sm:text-sm text-[#0B192C]/80 font-semibold border-l border-[#0B192C]/15 pl-4">
                  {b.metricLabel}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a href="#pricing" className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] hover:text-[#043E2F]">
                  <span>কোন প্যাকেজে কী পাবেন তা দেখুন</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D97706]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
