import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import type { Plan } from '../data/publisherData';
import { usePlans } from '../lib/usePlans';

interface PricingProps {
  onOpenDemo: (planName?: string) => void;
  onOpenComparison: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenDemo, onOpenComparison }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const plans = usePlans();

  return (
    <section id="pricing" className="py-24 bg-white border-t border-[#0B192C]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-[#E6FBF4] border border-[#00D492]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00875A] mb-4">
            মূল্যতালিকা (Pricing in BDT)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C] leading-[1.18]">
            সঠিক প্ল্যান বেছে নিন। বাড়ুন <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-[#00875A]">সীমাহীনভাবে।</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            প্রতিটি প্ল্যানে রয়েছে ৭ দিনের ফ্রি ট্রায়াল, কাউন্টার বিলিং, বিস্তারিত ক্যাটালগ ও বিক্রয় বিশ্লেষণ — এবং বাৎসরিক পেমেন্টে ১৫% বিশেষ ছাড়।
          </p>

          {/* Billing Interval Toggle */}
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
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all ${
                isAnnual ? 'bg-[#00D492] text-[#0B192C] shadow-xs' : 'text-[#0B192C]/70 hover:text-[#0B192C]'
              }`}
            >
              <span>বাৎসরিক বিলিং (Yearly)</span>
              <span className="rounded-full bg-[#FEF3C7] text-[#78350F] text-[10px] font-black px-2 py-0.5 border border-[#D97706]/40">
                ১৫% ছাড়
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (4 plans: Nexus, Spark, Rise, Titan) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          {plans.map((plan: Plan) => {
            const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
            const isEnterprise = plan.priceMonthly === -1;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
                  plan.popular
                    ? 'border-[#00D492] bg-[#FAF9F5] shadow-xl ring-2 ring-[#00D492]/30 lg:-translate-y-2'
                    : 'border-[#0B192C]/10 bg-white hover:border-[#0B192C]/30 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#00D492] px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0B192C] shadow-md flex items-center gap-1.5 border border-[#00D492]/30">
                    <Sparkles className="h-3 w-3 text-amber-700" />
                    <span>{plan.badge || 'সবচেয়ে জনপ্রিয়'}</span>
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0B192C]">{plan.name}</h3>
                    {plan.badge && !plan.popular && (
                      <span className="text-[10px] font-bold text-[#78350F] bg-[#FFFBEB] border border-[#D97706]/20 rounded px-2 py-0.5">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Price Header in BDT */}
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

                  {/* Quick Specs */}
                  <div className="mt-4 border-t border-b border-[#0B192C]/10 py-3 space-y-1.5 text-xs text-[#0B192C]/80">
                    <p className="font-bold text-[#0B192C]">{plan.specs.users}</p>
                    <p className="font-medium">{plan.specs.locations}</p>
                    <p className="text-[11px] text-[#78350F] font-semibold">{plan.specs.titles}</p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed min-h-[44px]">
                    {plan.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="mt-5 space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#0B192C]">
                        <Check className="h-4 w-4 text-[#00875A] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-snug font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="mt-8 pt-4 border-t border-[#0B192C]/10">
                  <div className="mb-2.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00875A] bg-[#E6FBF4] border border-[#00D492]/30 rounded-full px-3 py-0.5">
                      <Sparkles className="h-3 w-3 text-[#D97706]" />
                      <span>{plan.trial || '7 Days Free Trial'}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenDemo(plan.name)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-[#00D492] text-[#0B192C] hover:bg-[#00B87D] shadow-md border border-[#00D492]'
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

        {/* Compare All Plans Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenComparison}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00875A] hover:text-[#00B87D] hover:underline cursor-pointer"
          >
            <span>সব ফিচার ও প্যাকেজ তুলনা দেখুন (Compare all features in BDT)</span>
            <ArrowRight className="h-4 w-4 text-[#D97706]" />
          </button>
        </div>
      </div>
    </section>
  );
};
