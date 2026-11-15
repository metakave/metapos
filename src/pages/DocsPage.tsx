import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Barcode, 
  Printer, 
  Calculator, 
  QrCode, 
  WifiOff, 
  Copy, 
  Check, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'getting-started' | 'catalog' | 'hardware' | 'mela' | 'royalty' | 'payments'>('getting-started');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const navItems = [
    { id: 'getting-started', label: '১. সূচনা ও প্রকাশনী সেটআপ', icon: BookOpen },
    { id: 'catalog', label: '২. বই ক্যাটালগ ও ISBN-13 এন্ট্রি', icon: Barcode },
    { id: 'hardware', label: '৩. স্ক্যানার ও থার্মাল প্রিন্টার সংযোগ', icon: Printer },
    { id: 'mela', label: '৪. একুশে বইমেলা অফলাইন মোড গাইড', icon: WifiOff },
    { id: 'royalty', label: '৫. লেখক রয়্যালটি চুক্তি ও লেজার', icon: Calculator },
    { id: 'payments', label: '৬. বিকাশ কিউআর ও কুরিয়ার এপিআই', icon: QrCode },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#FBFBFA]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-3">
            ব্যবহার নির্দেশিকা (User Documentation)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B192C]">
            MetaPOS প্রকাশনা নির্দেশিকা ও সহায়িকা
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 font-medium">
            কাউন্টার সেটআপ, বইমেলার অফলাইন কনফিগারেশন, লেখক রয়্যালটি এবং কুরিয়ার ইন্টিগ্রেশনের ধাপে ধাপে গাইড।
          </p>
        </div>

        {/* Documentation Layout (Sidebar + Main Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border-2 border-[#0B192C]/10 bg-white p-4 space-y-1 shadow-xs sticky top-28">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C]/60 px-3 py-2">
              নির্দেশিকা সূচিপত্র
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-[#0B192C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-amber-300' : 'text-[#064E3B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#0B192C]/10 mt-3 px-3">
              <p className="text-[11px] text-[#0B192C]/70 font-semibold">
                সরাসরি সহায়তার প্রয়োজন?
              </p>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:underline"
              >
                <span>হোয়াটসঅ্যাপে টেকনিক্যাল সাপোর্ট নিন</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* Section 1: Getting Started */}
            {activeSection === 'getting-started' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#064E3B] uppercase">অধ্যায় ০১</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">সূচনা ও প্রকাশনী সেটআপ</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  MetaPOS ব্যবহারের শুরুতে আপনার প্রকাশনীর মৌলিক তথ্য, বাংলাবাজার বা শোরুমের ঠিকানা, ক্যাশ ড্রয়ার এবং ব্যবহারকারী সেলস কর্মীদের প্রোফাইল কনফিগার করতে হয়।
                </p>

                <div className="rounded-xl bg-[#FAF9F5] p-4 border border-[#0B192C]/10 space-y-3">
                  <h4 className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">প্রাথমিক ধাপসমূহ:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-[#0B192C] font-semibold">
                    <li>ড্যাশবোর্ডের <strong>সেটিংস &gt; প্রকাশনী প্রোফাইল</strong>-এ গিয়ে নাম ও ট্রেড লাইসেন্স বা ভ্যাট নম্বর যোগ করুন।</li>
                    <li>বইমেলা বা শোরুমের ক্যাশ মেমোতে যে লোগো ও হেডার প্রিন্ট হবে তা আপলোড করুন।</li>
                    <li>সেলস কর্মী ও ক্যাশিয়ারদের আলাদা পিন নম্বর (PIN) সেট করে দিন।</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Section 2: Catalog & ISBN */}
            {activeSection === 'catalog' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#064E3B] uppercase">অধ্যায় ০২</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">বই ক্যাটালগ ও ISBN-13 এন্ট্রি</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  প্রতিটি বইয়ের শিরোনাম, লেখক, অনুবাদক/সম্পাদক, জাতীয় গ্রন্থকেন্দ্রের ক্যাটাগরি এবং বাংলাদেশ ও আন্তর্জাতিক ISBN-13 কোড সিস্টেমে সংরক্ষণ করা হয়।
                </p>

                <div className="rounded-xl bg-[#0B192C] text-white p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-700 pb-2">
                    <span>নমুনা ISBN-13 ফরম্যাট ও মেটাডাটা</span>
                    <button
                      onClick={() => handleCopy('978-984-701-023-1')}
                      className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white"
                    >
                      {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCode ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>
                  <pre className="text-slate-300 text-[11px] leading-relaxed">
{`ISBN: 978-984-701-023-1
শিরোনাম: চিলেকোঠার সেপাই (হার্ডবাউন্ড)
লেখক: আখতারুজ্জামান ইলিয়াস
গায়ের দাম: ৳৫৫০
ফর্মা সংখ্যা: ১২ ফর্মা (৮০ গ্রাম ডিমাই অফসেট)
রয়্যালটি রেট: ১২% গায়ের দাম`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 3: Hardware Setup */}
            {activeSection === 'hardware' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#064E3B] uppercase">অধ্যায় ০৩</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">স্ক্যানার ও থার্মাল প্রিন্টার সংযোগ</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  MetaPOS যেকোনো সাধারণ কম্পিউটার, ল্যাপটপ, অ্যান্ড্রয়েড ট্যাব বা টাচস্ক্রিন পিওএস মেশিনে সরাসরি কাজ করে। কোনো অতিরিক্ত সফটওয়্যার ড্রাইভারের প্রয়োজন নেই।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-[#0B192C]/10 p-4 bg-[#FAF9F5] space-y-2">
                    <h4 className="font-bold text-[#0B192C]">ইউএসবি ও ওয়্যারলেস বারকোড স্ক্যানার</h4>
                    <p className="text-[#0B192C]/70 font-medium">স্ক্যানার ইউএসবি পোর্টে প্লাগ করলেই তা স্বয়ংক্রিয়ভাবে কীবোর্ড ইনপুট হিসেবে বই স্ক্যান করতে শুরু করবে।</p>
                  </div>
                  <div className="rounded-xl border border-[#0B192C]/10 p-4 bg-[#FAF9F5] space-y-2">
                    <h4 className="font-bold text-[#0B192C]">৫৮ মিমি / ৮০ মিমি থার্মাল প্রিন্টার</h4>
                    <p className="text-[#0B192C]/70 font-medium">ব্লুটুথ বা ইউএসবি ক্যাবল দিয়ে প্রিন্টার কানেক্ট করে ব্রাউজার প্রিন্ট ডায়ালগ থেকে সরাসরি রিসিট বের করুন।</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Boi Mela Offline Mode */}
            {activeSection === 'mela' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#831843] uppercase">অধ্যায় ০৪</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">অমর একুশে বইমেলা অফলাইন মোড গাইড</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  বইমেলা প্রাঙ্গণে (সোহরাওয়ার্দী উদ্যান বা বাংলা একাডেমি) মোবাইল ডাটা জ্যাম হওয়া সাধারণ ঘটনা। অফলাইন মোডে মেলা স্টলে বিক্রয় সচল রাখার নিয়মাবলী:
                </p>

                <div className="rounded-xl border-2 border-[#D97706]/30 bg-[#FFFBEB] p-4 text-xs space-y-2 text-[#78350F]">
                  <p className="font-bold">⚠️ বইমেলার শুরুর আগে করণীয়:</p>
                  <ul className="list-disc list-inside space-y-1 font-semibold">
                    <li>মেলায় যাওয়ার আগে সকালে ইন্টারনেট সংযোগ থাকা অবস্থায় টার্মিনাল লগইন করে নিন।</li>
                    <li>সমস্ত বইয়ের ক্যাটালগ ও মূল্য স্বয়ংক্রিয়ভাবে আপনার ডিভাইসের লোকাল মেমোরিতে সেভ হয়ে যাবে।</li>
                    <li>সারাদিন ইন্টারনেট ছাড়া মেলা স্টলে ক্যাশ মেমো কাটুন; রাতে সংযোগ পেলেই সব ডাটা অটোমেটিক ব্যাকআপ হয়ে যাবে।</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 5: Author Royalty */}
            {activeSection === 'royalty' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#064E3B] uppercase">অধ্যায় ০৫</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">লেখক রয়্যালটি চুক্তি ও লেজার</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  প্রকাশক ও লেখকের মাঝে শতভাগ আস্থা ও স্বচ্ছতা বজায় রাখতে স্বয়ংক্রিয় রয়্যালটি ক্যালকুলেশন ইঞ্জিন ব্যবহৃত হয়।
                </p>

                <div className="rounded-xl bg-[#FAF9F5] p-4 border border-[#0B192C]/10 space-y-3 text-xs">
                  <div className="flex justify-between font-bold text-[#0B192C]">
                    <span>টায়ার্ড চুক্তি কনফিগারেশন ফর্মুলা:</span>
                    <span className="text-[#064E3B]">অটো-ক্যালকুলেটেড</span>
                  </div>
                  <p className="text-[#0B192C]/70 font-medium">
                    উদাহরণ: প্রথম ২,৫০০ কপি পর্যন্ত ১০%, ২,৫০১ থেকে ৫,০০০ কপি পর্যন্ত ১২.৫% এবং ৫,০০১ কপির ওপরে ১৫% রয়্যালটি। সিস্টেম প্রতি কপি বিক্রয় অনুযায়ী স্বয়ংক্রিয়ভাবে স্ল্যাব পরিবর্তন করবে।
                  </p>
                </div>
              </div>
            )}

            {/* Section 6: Payments & Couriers */}
            {activeSection === 'payments' && (
              <div className="space-y-5">
                <div className="border-b border-[#0B192C]/10 pb-4">
                  <span className="text-xs font-bold text-[#064E3B] uppercase">অধ্যায় ০৬</span>
                  <h2 className="text-2xl font-bold text-[#0B192C] mt-1">বিকাশ কিউআর ও কুরিয়ার এপিআই</h2>
                </div>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">
                  সরাসরি বিকাশ মার্চেন্ট কিউআর কোড স্ক্রিনে প্রদর্শন এবং Steadfast, Pathao ও RedX কুরিয়ার এপিআই সংযোগ করে এক ক্লিকে পার্সেল বুকিং।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-[#0B192C]/10 p-4 bg-[#FAF9F5] space-y-2">
                    <h4 className="font-bold text-[#BE185D]">বিকাশ ডায়নামিক QR</h4>
                    <p className="text-[#0B192C]/70 font-medium">সেটিংস থেকে আপনার বিকাশ মার্চেন্ট নম্বর বা কিউআর কোড আপলোড করুন। টার্মিনালের বিকাশ বোতাম চাপলে স্ক্রিনে স্ক্যান কিউআর চলে আসবে।</p>
                  </div>
                  <div className="rounded-xl border border-[#0B192C]/10 p-4 bg-[#FAF9F5] space-y-2">
                    <h4 className="font-bold text-[#064E3B]">Steadfast / Pathao এপিআই কি</h4>
                    <p className="text-[#0B192C]/70 font-medium">কুরিয়ার অ্যাকাউন্টের API Key ও Secret দিয়ে দিন। অনলাইন অর্ডার আসার সাথে সাথেই কনসাইনমেন্ট ট্র্যাকিং আইডি সহ ডেলিভারি চালান তৈরি হবে।</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
