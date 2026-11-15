import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Package, 
  Calculator, 
  LineChart, 
  Store, 
  WifiOff, 
  ShoppingBag,
  Barcode,
  Layers,
  FileText
} from 'lucide-react';

export const Ecosystem: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ops' | 'finance' | 'reader'>('ops');

  return (
    <section id="ecosystem" className="py-24 bg-[#FAF9F5] border-t border-[#0B192C]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
            ইকোসিস্টেম (The Ecosystem)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B192C]">
            জানুন সেই অ্যাপগুলো যা সবকিছু সহজে পরিচালনা করে।
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0B192C]/80">
            বাংলাদেশের প্রকাশনা সংস্থা, বইয়ের শোরুম এবং অমর একুশে বইমেলার স্টলের জন্য বিশেষভাবে তৈরি সমন্বিত সফটওয়্যার স্যুট।
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 sm:gap-3 border-b border-[#0B192C]/15 pb-4">
          <button
            onClick={() => setActiveCategory('ops')}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeCategory === 'ops'
                ? 'bg-[#0B192C] text-white shadow-sm'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            ১. বইমেলার স্টল ও কাউন্টার পিওএস (Operations)
          </button>
          <button
            onClick={() => setActiveCategory('finance')}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeCategory === 'finance'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            ২. লেখক রয়্যালটি ও প্রেস ফর্মা কস্টিং (Royalties & Accounts)
          </button>
          <button
            onClick={() => setActiveCategory('reader')}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeCategory === 'reader'
                ? 'bg-[#831843] text-white shadow-sm'
                : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
            }`}
          >
            ৩. অনলাইন প্রি-অর্ডার ও কুরিয়ার বিতরণ (Delivery & D2C)
          </button>
        </div>

        {/* Category Content 1: Operations */}
        {activeCategory === 'ops' && (
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                নির্বিঘ্ন প্রকাশনা ও বিক্রয় পরিচালনা
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 max-w-3xl font-medium">
                পাঠক, বইয়ের শোরুমের ক্যাশ কাউন্টার এবং বাংলাবাজার প্রেস বা গুদামের মাঝে সবকিছু একটি মাত্র লাইভ সিস্টেমে সচল।
              </p>
            </div>

            {/* 3-Card Grid with Touchscreen POS Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Card 1: Counter App with Touchscreen POS Visual */}
              <div className="group rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#064E3B] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                      <Monitor className="h-5 w-5" />
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#064E3B]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      <WifiOff className="h-3 w-3" /> ১০০% অফলাইন রেডি
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-bold text-[#0B192C]">কাউন্টার ও শোরুম পিওএস</h4>
                  <p className="mt-1 text-sm font-bold text-[#064E3B]">
                    ইন্টারনেট চলে গেলেও বিলিং ও সেলস কোনো অবস্থাতেই থামবে না।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    টাচস্ক্রিন প্রোডাক্ট ক্যাটালগ গ্রিড, সরাসরি বারকোড/ISBN স্ক্যান, বইমেলা ২৫% ছাড় বা কাস্টম ডিসকাউন্ট বোতাম, বাংলা ক্যাশ মেমো প্রিন্ট এবং ক্যাশ ও বিকাশ/নগদ স্প্লিট পেমেন্ট।
                  </p>
                </div>

                {/* Modern POS Touch Terminal Mini-Mockup */}
                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#0B192C] p-2.5 text-white shadow-xs">
                    <div className="flex items-center justify-between text-[10px] pb-1.5 border-b border-slate-700 font-mono">
                      <span>POS #01 • Tanvir A.</span>
                      <span className="text-emerald-400 font-bold">Sync: OK</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-2 text-[10px]">
                      <div className="bg-slate-800 p-1.5 rounded text-center">
                        <span className="block text-slate-400">চিলেকোঠা</span>
                        <span className="font-bold text-amber-300">৳৫৫0</span>
                      </div>
                      <div className="bg-slate-800 p-1.5 rounded text-center">
                        <span className="block text-slate-400">নকশী কাঁথা</span>
                        <span className="font-bold text-emerald-300">৳৩২০</span>
                      </div>
                      <div className="bg-[#064E3B] p-1.5 rounded text-center">
                        <span className="block text-white">পে: মেমো</span>
                        <span className="font-bold text-white">৳৮৭০</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Warehouse & Fulfillment Hub */}
              <div className="group rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#0B192C] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center shadow-xs">
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#1E3A8A]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      বাংলাবাজার গুদাম
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-bold text-[#0B192C]">গুদাম ও মেলা স্টক রুটিন</h4>
                  <p className="mt-1 text-sm font-bold text-[#1E3A8A]">
                    অর্ডার পাওয়ার সাথে সাথে প্যাকিং ডেস্কে অটোমেটেড চালান তৈরি।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    গুদাম থেকে বইমেলার স্টলে বই পাঠানো (স্টক ট্রান্সফার), নীলক্ষেত ও জেলা ডিস্ট্রিবিউটরদের ডেলিভারি চালান এবং ফেরত বইয়ের নির্ভুল ইনভেন্টরি।
                  </p>
                </div>

                {/* Warehouse Transfer Slip Mini-Mockup */}
                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-3 border border-[#0B192C]/10 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#0B192C]">চালান #বিডি-৮৮ (স্টল ট্রান্সফার)</span>
                      <span className="text-[#1E3A8A]">১২০ কপি প্যাকড</span>
                    </div>
                    <div className="flex justify-between text-[#0B192C]/70 text-[11px]">
                      <span>সোহরাওয়ার্দী উদ্যান স্টল</span>
                      <span className="font-bold text-[#064E3B]">১০০% ভেরিফাইড ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: MetaPOS Go */}
              <div className="group rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#831843] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#831843] text-white flex items-center justify-center shadow-xs">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#FFE4E6] text-[#831843] px-2.5 py-0.5 text-[11px] font-bold border border-[#831843]/30">
                      অ্যান্ড্রয়েড ও আইওএস
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-bold text-[#0B192C]">MetaPOS Go (মোবাইল অ্যাপ)</h4>
                  <p className="mt-1 text-sm font-bold text-[#831843]">
                    অমর একুশে বইমেলার স্টল ও ভ্রাম্যমাণ ক্যাম্পাসে দ্রুত বিক্রয়।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    যেকোনো স্মার্টফোন বা ট্যাবে ক্যামেরা দিয়ে বারকোড স্ক্যান করুন, বিকাশ কিউআর দেখিয়ে টাকা নিন এবং ব্লুটুথ থার্মাল প্রিন্টারে ২ সেকেন্ডে রিসিট দিন।
                  </p>
                </div>

                {/* Handheld Mobile POS Mini-Mockup */}
                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-3 border border-[#0B192C]/10 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#0B192C]">বইমেলা প্যাভিলিয়ন #১২</span>
                      <span className="text-[#064E3B]">আজকে ৳৮২,৪০০</span>
                    </div>
                    <div className="flex justify-between text-[#0B192C]/70 text-[11px]">
                      <span>বিকাশ ও ক্যাশ রিসিট</span>
                      <span className="font-semibold text-[#831843]">২৬৪টি বই বিক্রিত</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Content 2: Royalties & Finance */}
        {activeCategory === 'finance' && (
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                লেখক রয়্যালটি ও প্রকাশনা হিসাবের সম্পূর্ণ সমাধান
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 max-w-3xl font-medium">
                সাধারণ রিটেল পিওএস-এর চেয়ে এগিয়ে—বই বাঁধাই ও প্লেট খরচ থেকে শুরু করে লেখকের কাঙ্ক্ষিত স্বচ্ছ রয়্যালটি খাতা এখন এক সফটওয়্যারে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Card: Author Royalties & Title Costing */}
              <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#064E3B] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#064E3B]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      স্বচ্ছ অডিট ট্রেইল
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-[#0B192C]">লেখক রয়্যালটি ও ফর্মা কস্টিং</h4>
                  <p className="mt-1 text-sm font-bold text-[#064E3B]">
                    প্রতিটি বইয়ে আপনার সঠিক লাভ ও লেখকের রয়্যালটি মুহূর্তেই নির্ধারণ করুন।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    চুক্তি অনুযায়ী হার (যেমন: ১ম ২,০০০ কপি ১০%, পরবর্তী ৫,০০০ কপি ১২%), প্রদেয় অগ্রিম রয়্যালটি কাটতি, এবং বাংলাবাজারের ডিস্ট্রিবিউটরদের জন্য ফেরত বইয়ের রিজার্ভ হিসাব করে এক ক্লিকে লেখকের নামে বাংলা PDF রয়্যালটি বিবরণী প্রিন্ট করুন।
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-4 border border-[#0B192C]/10 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#0B192C]">
                      <span>অগ্রিম সম্মানী সমন্বয় ফর্মুলা</span>
                      <span className="text-[#064E3B]">অটোমেটেড সমন্বিত</span>
                    </div>
                    <div className="text-[11px] text-[#0B192C]/70 font-medium">
                      মুদ্রণ: ৩,০০০ কপি • ফর্মা খরচ: ৳১৮.৫০ • গায়ের দাম: ৳৪০০ • লেখক রয়্যালটি ১০% (৳৪০/কপি)
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Publishing Business Insights */}
              <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#D97706] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#B45309] text-white flex items-center justify-center shadow-xs">
                      <LineChart className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      পুনঃমুদ্রণ অ্যালার্ট
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-[#0B192C]">প্রকাশনা অ্যানালিটিক্স ও রিপোর্ট</h4>
                  <p className="mt-1 text-sm font-bold text-[#B45309]">
                    এক্সেল শিট তৈরির ঝামেলা ছাড়াই লাইভ বিক্রয় ও স্টক ডেটা।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    কোন বইটি দ্রুত ফুরিয়ে যাচ্ছে, মেলায় কত কপি লাগবে এবং বাংলাবাজার গুদামে কোন বইটির নতুন সংস্করণ ছাপানো প্রয়োজন—এআই অ্যালগরিদম আপনাকে আগেভাগেই সংকেত দেবে।
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-4 border border-[#0B192C]/10 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#0B192C]">
                      <span>স্টক সতর্কবার্তা — নতুন সংস্করণ মুদ্রণ প্রয়োজন</span>
                      <span className="text-[#B45309] font-bold">১২ দিনের স্টক অবশিষ্ট</span>
                    </div>
                    <div className="text-[11px] text-[#0B192C]/70 font-medium">
                      "চিলেকোঠার সেপাই" প্রতিদিন ২৫ কপি বিক্রয় হচ্ছে। প্রস্তাবিত রিপ্রিন্ট: ২,০০০ কপি।
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Content 3: Direct Reader & Wholesale */}
        {activeCategory === 'reader' && (
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                অনলাইন পাঠক ও সারা দেশের লাইব্রেরি অর্ডার
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 max-w-3xl font-medium">
                পাঠকরা সরাসরি আপনার ফেসবুক পেজ বা ওয়েবসাইট থেকে প্রি-অর্ডার করবে, এবং কুরিয়ারের মাধ্যমে ক্যাশ অন ডেলিভারিতে সারা দেশে পৌঁছে যাবে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Card: Direct Reader Storefront */}
              <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#831843] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#831843] text-white flex items-center justify-center shadow-xs">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#FFE4E6] text-[#831843] border border-[#831843]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      অনলাইন বুকস্টোর
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-[#0B192C]">প্রকাশনীর নিজস্ব অনলাইন বুকশপ</h4>
                  <p className="mt-1 text-sm font-bold text-[#831843]">
                    লেখক সই করা বই ও নতুন বইয়ের প্রি-অর্ডার গ্রহণ।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    রকমারি বা তৃতীয় পক্ষের বড় কমিশন ছাড়া প্রকাশনীর নিজস্ব সাইটে পাঠককে বিক্রয় করুন। বিকাশ বা ক্যাশ অন ডেলিভারিতে পেমেন্ট নিন।
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-3 border border-[#0B192C]/10 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#0B192C]">প্রি-অর্ডার বইমেলা বিশেষ অফার</span>
                      <span className="text-[#831843] font-bold">৳৮৫০ বান্ডেল</span>
                    </div>
                    <div className="flex justify-between text-[#0B192C]/70 text-[11px] font-medium">
                      <span>Steadfast কুরিয়ার পার্সেল রেডি</span>
                      <span className="text-[#064E3B] font-bold">সারা বাংলাদেশে হোম ডেলিভারি</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Wholesale & B2B Portal */}
              <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#064E3B] hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                      <Store className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#064E3B]/30 px-2.5 py-0.5 text-[11px] font-bold">
                      পাইকারি ও লাইব্রেরি
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-[#0B192C]">জেলা ডিস্ট্রিবিউটর ও লাইব্রেরি পোর্টাল</h4>
                  <p className="mt-1 text-sm font-bold text-[#064E3B]">
                    জাতীয় গ্রন্থকেন্দ্র, সরকারি ক্রয় ও জেলা এজেন্টদের চালান।
                  </p>
                  <p className="mt-3 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                    বাতিঘর, পাঠক সমাবেশ, আজিজ মার্কেট ও জেলা বুকস্টোরের জন্য পাইকারি ছাড় স্ল্যাব (৪০% - ৪৫%), বাকি খাতা ট্র্যাকিং এবং সরকারি ক্রয়ের আনুষ্ঠানিক ভ্যাট চালান তৈরি।
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B192C]/10">
                  <div className="rounded-xl bg-[#FAF9F5] p-3 border border-[#0B192C]/10 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#0B192C]">পাইকারি চালান #বিডি-৯৯</span>
                      <span className="text-[#064E3B] font-bold">৪০% পাইকারি ছাড়</span>
                    </div>
                    <div className="flex justify-between text-[#0B192C]/70 text-[11px] font-medium">
                      <span>১৫০ কপি • বাতিঘর চট্টগ্রাম আউটলেট</span>
                      <span className="text-[#78350F] font-bold">চালান প্রিন্ট সম্পন্ন</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
