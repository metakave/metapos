import React, { useState } from 'react';
import { 
  TrendingUp, 
  PiggyBank, 
  Bot, 
  ArrowRight, 
  Check, 
  Sparkles
} from 'lucide-react';

export const Benefits: React.FC = () => {
  const [activeBenefit, setActiveBenefit] = useState<number>(0);

  const benefits = [
    {
      id: 0,
      title: 'বিক্রয় বৃদ্ধি ও অমর একুশে বইমেলা সার্থকতা',
      icon: TrendingUp,
      accentColor: 'text-[#064E3B]',
      bgColor: 'bg-[#ECFDF5]',
      borderColor: 'border-[#064E3B]',
      summary: 'অমর একুশে বইমেলার ভিড়ে বা সোহরাওয়ার্দী উদ্যানের নেটওয়ার্ক জ্যামেও একটি বই বিক্রয়ও মিস হবে না।',
      details: [
        '১০০% অফলাইন কাউন্টার — ইন্টারনেট ডাউন থাকলেও বই স্ক্যান, ক্যাশ মেমো এবং অফলাইন বিকাশ রেফারেন্স রেকর্ড হয়।',
        'MetaPOS Go মোবাইল অ্যাপ দিয়ে স্টলের সামনে দাঁড়িয়ে যেকোনো কর্মী ৫ সেকেন্ডে মেমো কেটে লাইন হালকা করতে পারে।',
        'গ্রাহকদের জন্য বাংলা এসএমএস মেমো ও বিকাশ ডায়নামিক QR দিয়ে নিমেষেই পেমেন্ট সংগ্রহ।',
      ],
      metric: '+৩২%',
      metricLabel: 'একুশে বইমেলায় দ্রুত বিলিংয়ের মাধ্যমে পিক আওয়ারে অতিরিক্ত বিক্রয় প্রবৃদ্ধি',
      preview: {
        tag: 'বইমেলা রেজিলিয়েন্স ইঞ্জিন',
        headline: 'নেটওয়ার্ক জ্যামেও বিরতিহীন ক্যাশ কাউন্টার',
        points: [
          'সোহরাওয়ার্দী উদ্যানে নেটওয়ার্ক বন্ধ থাকলেও বিলিং চালু',
          'লোকাল মেমোরি থেকে তাৎক্ষণিক বারকোড ও মূল্য লোড',
          'ইন্টারনেট সংযোগ পেলেই কেন্দ্রীয় গুদামের সাথে ডেটা সিঙ্ক',
        ],
      },
    },
    {
      id: 1,
      title: 'লেখক রয়্যালটি বিরোধ নিরসন ও সাশ্রয়ী হিসাব',
      icon: PiggyBank,
      accentColor: 'text-[#0B192C]',
      bgColor: 'bg-[#F4F4F0]',
      borderColor: 'border-[#0B192C]',
      summary: 'প্রতিটি বইয়ের ফর্মা খরচ ও রয়্যালটির স্বচ্ছ হিসাব — খাতার জটিলতা ও লেখকের ভুল বোঝাবুঝি শূন্যে নেমে আসবে।',
      details: [
        'মুদ্রণ ব্যয়, পেপার স্টক, বাঁধাই এবং অগ্রিম সম্মানীর নিখুঁত সমন্বয় ট্র্যাকিং।',
        'লেখকের চুক্তি অনুযায়ী টায়ার্ড রয়্যালটি (যেমন ১০%, ১২.৫%, ১৫%) স্বয়ংক্রিয়ভাবে গণনা।',
        'বাংলাবাজার ও জেলা ডিস্ট্রিবিউটরদের জন্য ফেরত বইয়ের নিরাপদ রিজার্ভ ফান্ড হিসাব।',
      ],
      metric: '১০০%',
      metricLabel: 'স্বচ্ছ হিসাবের মাধ্যমে লেখক-প্রকাশক সম্পর্ক সুদৃঢ় ও সময় সাশ্রয়',
      preview: {
        tag: 'অটোমেটেড রয়্যালটি ও ফর্মা লেজার',
        headline: 'এক ক্লিকে লেখকের নামে বাংলা PDF স্টেটমেন্ট',
        points: [
          'হার্ডকভার, পেপারব্যাক ও ই-বুকের আলাদা রয়্যালটি রেট',
          'অগ্রিম সম্মানী কাটতি ও নেট প্রদেয় টাকার নির্ভুল মেমো',
          'লেখকের হাতে সরাসরি প্রিন্টেড বা ইমেইল স্টেটমেন্ট হস্তান্তর',
        ],
      },
    },
    {
      id: 2,
      title: 'প্রকাশনা অটোমেশনে আধুনিক এআই',
      icon: Bot,
      accentColor: 'text-[#831843]',
      bgColor: 'bg-[#FFE4E6]',
      borderColor: 'border-[#831843]',
      summary: 'পুনরাবৃত্তিমূলক কাজ করবে এআই — ক্যাটালগ ট্যাগিং, ISBN প্রস্তুতি ও নতুন সংস্করণ ছাপার পূর্বাভাস।',
      details: [
        'বইয়ের সারসংক্ষেপ থেকে স্বয়ংক্রিয় বিষয়ভিত্তিক শ্রেণিবিভাগ ও কি-ওয়ার্ড জেনারেশন।',
        'জাতীয় গ্রন্থকেন্দ্র ও আন্তর্জাতিক স্ট্যান্ডার্ড অনুযায়ী মেটাডাটা ফরম্যাটিং।',
        'মেলা শুরুর আগে এবং বিক্রয়ের গতির ওপর ভিত্তি করে কত কপি ছাপাতে হবে তার সঠিক পূর্বাভাস।',
      ],
      metric: '১০ গুণ',
      metricLabel: 'দ্রুততর ক্যাটালগ এন্ট্রি এবং নির্ভুল ইনভেন্টরি পূর্বাভাস',
      preview: {
        tag: 'এআই প্রকাশনা সহকারী',
        headline: 'স্মার্ট ক্যাটালগ ও সংস্করণ পরিকল্পনা',
        points: [
          'স্বয়ংক্রিয় বাংলা বিষয় ও ক্যাটাগরি ম্যাপিং',
          'রকমারি ও অনলাইন সাইটের জন্য রেডি মেটাডাটা এক্সপোর্ট',
          'বইমেলার আগেই প্রেসের কাজ শেষ করার প্রাক-বিজ্ঞপ্তি',
        ],
      },
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-white border-t border-[#0B192C]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            সুবিধাসমূহ (Benefits)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C]">
            আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ জানুন
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            পুরোনো খাতা-কলম ও জটিল এক্সেল শিট বাদ দিয়ে একীভূত সফটওয়্যারে কাজ করলে দ্রুত বই প্রকাশ করা যায়, স্টল ও গুদাম নিয়ন্ত্রণে থাকে এবং প্রকাশনা পরিচালনা হয় নিশ্চিন্তে।
          </p>
        </div>

        {/* Benefits Interactive Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Benefit Selector Cards */}
          <div className="lg:col-span-5 space-y-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              const isSelected = activeBenefit === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBenefit(b.id)}
                  className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                    isSelected
                      ? 'bg-[#FAF9F5] border-[#064E3B] shadow-lg ring-1 ring-[#064E3B]'
                      : 'bg-white border-[#0B192C]/10 hover:border-[#0B192C]/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${b.bgColor} ${b.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B192C]">{b.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#0B192C]/75 leading-relaxed font-medium">
                    {b.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Preview Window */}
          <div className="lg:col-span-7 rounded-2xl border-2 border-[#0B192C]/10 bg-[#FAF9F5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#0B192C]/10 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold text-[#064E3B]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                {benefits[activeBenefit].preview.tag}
              </span>
              <span className="text-xs font-bold text-[#0B192C]/60">লাইভ প্রিভিউ</span>
            </div>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                {benefits[activeBenefit].preview.headline}
              </h3>
              <p className="mt-2 text-sm text-[#0B192C]/80 font-medium">
                {benefits[activeBenefit].summary}
              </p>

              {/* Bullet Features */}
              <div className="mt-6 space-y-3">
                {benefits[activeBenefit].details.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5 border border-[#064E3B]/30">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#0B192C] font-medium leading-normal">{point}</span>
                  </div>
                ))}
              </div>

              {/* Stat highlight box */}
              <div className="mt-8 rounded-xl bg-white border border-[#0B192C]/10 p-5 flex items-center gap-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-[#064E3B] tracking-tight shrink-0">
                  {benefits[activeBenefit].metric}
                </div>
                <div className="text-xs sm:text-sm text-[#0B192C]/80 font-semibold border-l border-[#0B192C]/15 pl-4">
                  {benefits[activeBenefit].metricLabel}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 flex justify-end">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] hover:text-[#043E2F]"
                >
                  <span>কোন প্যাকেজে এই সুবিধাটি পাবেন তা দেখুন</span>
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
