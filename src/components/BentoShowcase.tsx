import React, { useState } from 'react';
import { 
  Barcode, 
  Calculator, 
  Globe
} from 'lucide-react';

export const BentoShowcase: React.FC = () => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'kds' | 'royalty' | 'onix'>('kds');

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 relative z-10">
        <div className="max-w-2xl mb-12">
          <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            বাংলাদেশের প্রকাশনা শিল্পের জন্য বিশেষায়িত আর্কিটেকচার
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            সম্পাদনা, প্রেস, গুদাম ও বিক্রয়কেন্দ্রের মাঝে নিখুঁত সেতুবন্ধন।
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            নিচের ওয়ার্কফ্লো ট্যাবে ক্লিক করে দেখুন কীভাবে MetaPOS বাংলাদেশের প্রকাশনা ব্যবস্থাপনাকে সহজ ও আধুনিক করে তোলে।
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveInteractiveTab('kds')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeInteractiveTab === 'kds'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Barcode className="h-4 w-4" />
            <span>গুদাম ও বইমেলা স্টক ডেলিভারি কিউ</span>
          </button>
          <button
            onClick={() => setActiveInteractiveTab('royalty')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeInteractiveTab === 'royalty'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>টায়ার্ড লেখক রয়্যালটি ক্যালকুলেটর</span>
          </button>
          <button
            onClick={() => setActiveInteractiveTab('onix')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeInteractiveTab === 'onix'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>জাতীয় গ্রন্থকেন্দ্র ও বাংলা মেটাডাটা</span>
          </button>
        </div>

        {/* Interactive Showcase Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          {activeInteractiveTab === 'kds' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slip 1 */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold text-emerald-400">পার্সেল #বিডি-১০৪৯</span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">কুরিয়ার প্যাকিং</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">পাঠক প্রি-অর্ডার ও হোম ডেলিভারি</h4>
                  <p className="text-xs text-slate-400 mt-1">২ × "চিলেকোঠার সেপাই" (হার্ডবাউন্ড)</p>
                  <p className="text-xs text-slate-500 mt-0.5">+ লেখক অটোগ্রাফযুক্ত বুকমার্ক</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Steadfast COD ৳১,১০০</span>
                  <span className="text-emerald-400 font-semibold">প্যাকড ও রেডি ✓</span>
                </div>
              </div>

              {/* Slip 2 */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold text-blue-400">চালান #ডব্লিউএস-৪৪০২</span>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">পাইকারি</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">বাতিঘর ঢাকা ও চট্টগ্রাম আউটলেট</h4>
                  <p className="text-xs text-slate-400 mt-1">৮৫ × নতুন উপন্যাস ও প্রবন্ধ সমগ্র</p>
                  <p className="text-xs text-slate-500 mt-0.5">৪০% পাইকারি কমিশনে সরবরাহ</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">বাংলাবাজার চালান</span>
                  <span className="text-blue-400 font-semibold">বারকোড স্ক্যান সচল</span>
                </div>
              </div>

              {/* Slip 3 */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold text-purple-400">স্টক রিফিল #এমএল-১২</span>
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">বইমেলা স্টল</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">অমর একুশে বইমেলা স্টল রিফিল</h4>
                  <p className="text-xs text-slate-400 mt-1">৩০০ কপি বেস্টসেলার বই (বাংলা একাডেমি চত্বর)</p>
                  <p className="text-xs text-slate-500 mt-0.5">টার্মিনাল #০১ ও #০২ এর সাথে সিঙ্কড</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">গুদাম ভ্যান ডেলিভারি</span>
                  <span className="text-purple-400 font-semibold">স্টলে পৌঁছানো সম্পন্ন</span>
                </div>
              </div>
            </div>
          )}

          {activeInteractiveTab === 'royalty' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">টায়ার্ড রয়্যালটি চুক্তি সিমুলেটর (বাংলাদেশ স্ট্যান্ডার্ড)</h4>
                  <p className="text-xs text-slate-400">লেখক: আনিসুল হক • বই: মা (বিশেষ সংস্করণ)</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-semibold border border-emerald-500/30">
                  অগ্রিম সম্মানী ৳৫০,০০০ সম্পূর্ণ সমন্বিত
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400">টায়ার ১: ১ - ২,৫০০ কপি</span>
                  <p className="text-lg font-bold text-white mt-1">১০.০% (৳৪০/কপি)</p>
                  <p className="text-[10px] text-emerald-400 mt-1">২,৫০০ কপি সম্পন্ন</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400">টায়ার ২: ২,৫০১ - ৫,০০০ কপি</span>
                  <p className="text-lg font-bold text-white mt-1">১২.০% (৳৪৮/কপি)</p>
                  <p className="text-[10px] text-emerald-400 mt-1">২,৫০০ কপি সম্পন্ন</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400">টায়ার ৩: ৫,০০১+ কপি</span>
                  <p className="text-lg font-bold text-white mt-1">১৫.০% (৳৬০/কপি)</p>
                  <p className="text-[10px] text-emerald-400 mt-1">২০০ কপি (চলতি টায়ার)</p>
                </div>
                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
                  <span className="text-emerald-300">প্রদেয় নেট রয়্যালটি (মোট)</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">৳১,৮২,০০০</p>
                  <p className="text-[10px] text-emerald-300 mt-1">বাংলা PDF মেমো প্রস্তুত</p>
                </div>
              </div>
            </div>
          )}

          {activeInteractiveTab === 'onix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">জাতীয় গ্রন্থকেন্দ্র ও আর্ন্তজাতিক ISBN ক্যাটালগ ফরম্যাট</h4>
                  <p className="text-xs text-slate-400">বাংলাদেশ আরকাইভস ও গ্রন্থাগার অধিদপ্তরের মানদণ্ড অনুযায়ী ডেটা ভ্যালিডেশন</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">স্ট্যাটাস: ২০০ OK • সিঙ্কড</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`<?xml version="1.0" encoding="UTF-8"?>
<ONIXMessage release="3.0">
  <Header>
    <Sender><SenderName>MetaPOS Bangladesh</SenderName></Sender>
    <SentDateTime>20261116T0022Z</SentDateTime>
  </Header>
  <Product>
    <RecordReference>METAPOS-BD-8801</RecordReference>
    <ProductIdentifier>
      <ProductIDType>15</ProductIDType> <!-- ISBN-13 -->
      <IDValue>9789847010231</IDValue>
    </ProductIdentifier>
    <DescriptiveDetail>
      <ProductForm>BB</ProductForm> <!-- হার্ডবাউন্ড -->
      <TitleDetail><TitleText>চিলেকোঠার সেপাই</TitleText></TitleDetail>
      <Contributor><PersonName>আখতারুজ্জামান ইলিয়াস</PersonName></Contributor>
      <Language><LanguageCode>ben</LanguageCode></Language> <!-- বাংলা -->
    </DescriptiveDetail>
    <SupplyDetail>
      <Price>
        <PriceType>01</PriceType>
        <PriceAmount>550.00</PriceAmount>
        <CurrencyCode>BDT</CurrencyCode>
      </Price>
    </SupplyDetail>
  </Product>
</ONIXMessage>`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
