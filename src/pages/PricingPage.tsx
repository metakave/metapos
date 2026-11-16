import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { ALL_FEATURES_COMPARISON } from '../data/publisherData';
import { usePlans } from '../lib/usePlans';

interface PricingPageProps {
  onOpenDemo: (planName?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenDemo }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const plans = usePlans();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'অমর একুশে বইমেলার ভিড়ে ইন্টারনেট বন্ধ বা দুর্বল থাকলে কাউন্টারে বিক্রি কীভাবে চলবে?',
      a: 'MetaPOS সম্পূর্ণ অফলাইন-ফার্স্ট প্রযুক্তিতে নির্মিত। সোহরাওয়ার্দী উদ্যান বা বাংলা একাডেমিতে মোবাইল নেটওয়ার্ক জ্যাম থাকলেও ব্রাউজার বা অ্যাপের লোকাল মেমোরি থেকে বারকোড স্ক্যান, গায়ের দাম থেকে ২৫% মেলা ছাড় এবং থার্মাল প্রিন্টারে মেমো কাটা স্বাভাবিক গতিতেই চলবে। পরবর্তীতে নেটওয়ার্ক পেলে সব হিসাব সেন্ট্রাল গুদামের সাথে সিঙ্ক হয়ে যাবে।',
    },
    {
      q: 'বিকাশ ও নগদ কিউআর দিয়ে টাকা নিলে তা কি সফটওয়্যারে স্বয়ংক্রিয়ভাবে রেকর্ড হয়?',
      a: 'হ্যাঁ, টার্মিনালে বিকাশ মার্চেন্ট ও নগদ পেমেন্ট কিউআর কোড স্ক্রিনে প্রদর্শন করা যায়। গ্রাহক স্ক্যান করে পেমেন্ট করার সাথে সাথে লেনদেনের ট্রানজেকশন আইডি সহ বিক্রয় মেমো স্বয়ংক্রিয়ভাবে ক্যাশ ও ডিজিটাল পেমেন্ট আলাদা করে ক্যাশ ড্রয়ার ও ডেইলি সেলস রিপোর্টে যুক্ত হয়।',
    },
    {
      q: 'লেখকদের জন্য রয়্যালটি স্টেটমেন্ট কীভাবে তৈরি এবং প্রিন্ট করা যায়?',
      a: 'সফটওয়্যারে প্রতিটি বইয়ের জন্য লেখকের চুক্তির শতকরা হার (যেমন: ১০%, ১২%, ১৫% বা ফ্লাট রেট) এবং প্রদেয় অগ্রিম সম্মানী (Advance) যুক্ত থাকে। বইমেলা, শোরুম ও অনলাইন থেকে যত কপি বিক্রয় হয়, সফটওয়্যার স্বয়ংক্রিয়ভাবে অগ্রিম কেটে নিয়ে নেট প্রদেয় রয়্যালটি হিসাব করে এক ক্লিকে লেখকের নামে বাংলা PDF স্টেটমেন্ট তৈরি করে দেয়।',
    },
    {
      q: 'কোন কোন বারকোড স্ক্যানার এবং রিসিট প্রিন্টারের সাথে MetaPOS কাজ করে?',
      a: 'MetaPOS যেকোনো স্ট্যান্ডার্ড ইউএসবি ও ওয়্যারলেস বারকোড স্ক্যানার, এবং Star Micronics, Epson, Xprinter, Rongta সহ যেকোনো ৫৮ মিমি বা ৮০ মিমি থার্মাল ও ব্লুটুথ রিসিট প্রিন্টারের সাথে সরাসরি কাজ করে। কোনো বিশেষ ড্রাইভার ইনস্টল করার ঝামেলা নেই।',
    },
    {
      q: 'রকমারি, বাতিঘর বা জেলা ডিস্ট্রিবিউটরদের কনসাইনমেন্ট বাকি খাতা কীভাবে নিয়ন্ত্রণ করা যায়?',
      a: 'Growth এবং Scale প্যাকেজে রয়েছে কনসাইনমেন্ট মডিউল। বিভিন্ন ডিস্ট্রিবিউটরের কাছে কত কপি বই জমা দেওয়া হলো, কত কপি বিক্রয় হলো এবং কত কপি ফেরত এলো—তা পৃথক বাকির খাতা ও চালানে রিকনসিলিয়েশন করা যায়।',
    },
    {
      q: 'আমরা কি পরে যেকোনো সময় প্যাকেজ পরিবর্তন বা মেলা উপলক্ষে অতিরিক্ত কাউন্টার যোগ করতে পারি?',
      a: 'হ্যাঁ, বইমেলার মাসগুলোতে সাময়িকভাবে কাউন্টার সংখ্যা বাড়িয়ে নেওয়া যায় এবং মেলা শেষে আবার রেগুলার প্ল্যানে ফিরে যাওয়া যায়। আমাদের কোনো বাধ্যতামূলক বা দীর্ঘমেয়াদী লক-ইন চুক্তি নেই।',
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#FBFBFA]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            স্বচ্ছ মূল্যতালিকা (Pricing in BDT)
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C] leading-tight">
            বাংলাদেশের প্রকাশকদের জন্য সাশ্রয়ী ও উন্মুক্ত প্ল্যান।
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            প্রতিটি প্যাকেজে রয়েছে ৩০ দিনের ফ্রি ট্রায়াল এবং বাৎসরিক বিলিংয়ে ১৫% বিশেষ ছাড়।
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center rounded-full bg-[#F4F4F0] p-1.5 border border-[#0B192C]/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                !isAnnual ? 'bg-[#0B192C] text-white shadow-xs' : 'text-[#0B192C]/70 hover:text-[#0B192C]'
              }`}
            >
              মাসিক বিলিং (Monthly)
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                isAnnual ? 'bg-[#064E3B] text-white shadow-xs' : 'text-[#0B192C]/70 hover:text-[#0B192C]'
              }`}
            >
              <span>বাৎসরিক বিলিং (Yearly)</span>
              <span className="rounded-full bg-[#FEF3C7] text-[#78350F] text-[10px] font-black px-2 py-0.5 border border-[#D97706]/40">
                ১৫% ছাড়
              </span>
            </button>
          </div>
        </div>

        {/* 4-Tier Pricing Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
            const isEnterprise = plan.priceMonthly === -1;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
                  plan.popular
                    ? 'border-[#064E3B] bg-[#FAF9F5] shadow-xl ring-2 ring-[#064E3B]/30 lg:-translate-y-2'
                    : 'border-[#0B192C]/10 bg-white hover:border-[#0B192C]/30 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#064E3B] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    <span>{plan.badge || 'সবচেয়ে জনপ্রিয়'}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0B192C]">{plan.name}</h3>
                    {plan.badge && !plan.popular && (
                      <span className="text-[10px] font-bold text-[#78350F] bg-[#FFFBEB] border border-[#D97706]/20 rounded px-2 py-0.5">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline">
                    {isEnterprise ? (
                      <span className="text-2xl sm:text-3xl font-black text-[#0B192C]">কাস্টম দর</span>
                    ) : price === 0 ? (
                      <span className="text-3xl font-black text-[#0B192C]">৳০ <span className="text-sm font-semibold text-[#0B192C]/60">ফ্রি</span></span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-[#0B192C]">
                          ৳{price.toLocaleString()}
                        </span>
                        <span className="ml-1 text-xs text-[#0B192C]/60 font-semibold">/মাস</span>
                      </>
                    )}
                  </div>

                  <div className="mt-4 border-t border-b border-[#0B192C]/10 py-3 space-y-1.5 text-xs text-[#0B192C]/80">
                    <p className="font-bold text-[#0B192C]">{plan.specs.users}</p>
                    <p className="font-medium">{plan.specs.locations}</p>
                    <p className="text-[11px] text-[#78350F] font-semibold">{plan.specs.titles}</p>
                  </div>

                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed min-h-[44px]">
                    {plan.description}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#0B192C]">
                        <Check className="h-4 w-4 text-[#064E3B] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-snug font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#0B192C]/10">
                  <button
                    onClick={() => onOpenDemo(plan.name)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      plan.popular
                        ? 'bg-[#064E3B] text-white hover:bg-[#043E2F] shadow-md border border-[#064E3B]'
                        : 'border-2 border-[#0B192C]/20 bg-white text-[#0B192C] hover:bg-[#F4F4F0] hover:border-[#0B192C]/40'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Feature Comparison Section */}
        <div className="mt-20 pt-16 border-t border-[#0B192C]/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
              প্যাকেজভিত্তিক পূর্ণাঙ্গ ফিচার তালিকা
            </h2>
            <p className="mt-2 text-sm text-[#0B192C]/70 font-medium">
              আপনার প্রকাশনীর প্রয়োজনের সাথে মিলিয়ে সঠিক প্যাকেজটি বেছে নিন।
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0B192C]/15 text-[#0B192C] bg-[#FAF9F5]">
                    <th className="py-4 px-5 font-bold text-sm w-1/3">ফিচার বিবরণী</th>
                    <th className="py-4 px-3 text-center font-bold">Starter (৳১,৯৯৯)</th>
                    <th className="py-4 px-3 text-center font-bold bg-[#ECFDF5] text-[#064E3B] border-x border-[#064E3B]/20">Growth (৳৪,৯৯৯)</th>
                    <th className="py-4 px-3 text-center font-bold">Scale (৳১৪,৯৯৯)</th>
                    <th className="py-4 px-3 text-center font-bold">Enterprise (কাস্টম)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B192C]/10">
                  {ALL_FEATURES_COMPARISON.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr className="bg-[#FAF9F5]">
                        <td colSpan={5} className="py-2.5 px-5 font-bold text-xs uppercase tracking-wider text-[#0B192C]">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF9F5]">
                          <td className="py-3 px-5 text-[#0B192C] font-semibold">{item.name}</td>
                          <td className="py-3 px-3 text-center">{renderCompCell(item.starter)}</td>
                          <td className="py-3 px-3 text-center bg-[#ECFDF5]/60 font-bold border-x border-[#064E3B]/20">{renderCompCell(item.growth)}</td>
                          <td className="py-3 px-3 text-center">{renderCompCell(item.scale)}</td>
                          <td className="py-3 px-3 text-center">{renderCompCell(item.enterprise)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-20 pt-16 border-t border-[#0B192C]/10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-[#ECFDF5] text-[#064E3B] px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              সাধারণ জিজ্ঞাসা (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
              প্রকাশকদের সাধারণ কিছু প্রশ্ন ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#0B192C]/10 bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#0B192C] hover:bg-[#FAF9F5] transition-colors text-sm"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-[#064E3B] shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium border-t border-[#0B192C]/5 pt-3 bg-[#FAF9F5]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderCompCell(val: boolean | string) {
  if (val === true) {
    return <Check className="h-4 w-4 text-[#064E3B] mx-auto stroke-[3]" />;
  }
  if (val === false) {
    return <span className="text-[#0B192C]/30 font-bold">—</span>;
  }
  return <span className="text-[11px] font-bold text-[#0B192C]">{val}</span>;
}
