import React, { useState } from 'react';
import {
  BookOpen,
  Barcode,
  Printer,
  ShoppingCart,
  Wallet,
  Package,
  LineChart,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

type SectionId = 'getting-started' | 'catalog' | 'hardware' | 'selling' | 'session' | 'stock' | 'reports';

const NAV: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'getting-started', label: '১. সূচনা: কাউন্টার ও ব্যবহারকারী', icon: BookOpen },
  { id: 'catalog', label: '২. বই ক্যাটালগ ও ISBN', icon: Barcode },
  { id: 'hardware', label: '৩. স্ক্যানার ও প্রিন্টার', icon: Printer },
  { id: 'selling', label: '৪. কাউন্টারে বিক্রি ও পেমেন্ট', icon: ShoppingCart },
  { id: 'session', label: '৫. সেশন খোলা-বন্ধ ও ক্যাশ গণনা', icon: Wallet },
  { id: 'stock', label: '৬. স্টক অন হ্যান্ড', icon: Package },
  { id: 'reports', label: '৭. ড্যাশবোর্ড ও রিপোর্ট', icon: LineChart },
];

const Section: React.FC<{ n: string; title: string; intro: string; children: React.ReactNode }> = ({ n, title, intro, children }) => (
  <div className="space-y-5">
    <div className="border-b border-[#0B192C]/10 pb-4">
      <span className="text-xs font-bold text-[#00875A] uppercase">অধ্যায় {n}</span>
      <h2 className="text-2xl font-bold text-[#0B192C] mt-1">{title}</h2>
    </div>
    <p className="text-xs sm:text-sm text-[#0B192C]/80 leading-relaxed font-medium">{intro}</p>
    {children}
  </div>
);

const Steps: React.FC<{ title?: string; items: React.ReactNode[] }> = ({ title = 'ধাপসমূহ:', items }) => (
  <div className="rounded-xl bg-[#FAF9F5] p-4 border border-[#0B192C]/10 space-y-3">
    <h4 className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">{title}</h4>
    <ol className="list-decimal list-inside space-y-2 text-xs text-[#0B192C] font-semibold">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ol>
  </div>
);

const Tiles: React.FC<{ items: [string, string][] }> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
    {items.map(([h, p]) => (
      <div key={h} className="rounded-xl border border-[#0B192C]/10 p-4 bg-[#FAF9F5] space-y-2">
        <h4 className="font-bold text-[#0B192C]">{h}</h4>
        <p className="text-[#0B192C]/70 font-medium">{p}</p>
      </div>
    ))}
  </div>
);

export const DocsPage: React.FC = () => {
  const [active, setActive] = useState<SectionId>('getting-started');
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBFBFA]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-3xl mb-10">
          <span className="inline-block rounded-full bg-[#E6FBF4] border border-[#00D492]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00875A] mb-3">
            ব্যবহার নির্দেশিকা
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B192C]">MetaPOS ব্যবহার নির্দেশিকা</h1>
          <p className="mt-2 text-sm sm:text-base text-[#0B192C]/80 font-medium">
            কাউন্টার সেটআপ, বই ক্যাটালগ, বিক্রি, সেশন বন্ধ, স্টক ও রিপোর্ট — ধাপে ধাপে।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <nav className="lg:col-span-4 rounded-2xl border-2 border-[#0B192C]/10 bg-white p-4 space-y-1 shadow-xs lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C]/60 px-3 py-2">নির্দেশিকা সূচিপত্র</p>
            {NAV.map((item) => {
              const Icon = item.icon;
              const isSelected = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected ? 'bg-[#00D492] text-[#0B192C] shadow-xs' : 'text-[#0B192C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#0B192C]' : 'text-[#00875A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-[#0B192C]' : 'text-slate-300'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#0B192C]/10 mt-3 px-3">
              <p className="text-[11px] text-[#0B192C]/70 font-semibold">সরাসরি সহায়তার প্রয়োজন?</p>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#00875A] hover:underline"
              >
                <span>হোয়াটসঅ্যাপে টেকনিক্যাল সাপোর্ট নিন</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </nav>

          <div className="lg:col-span-8 rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {active === 'getting-started' && (
              <Section
                n="০১"
                title="সূচনা: কাউন্টার ও ব্যবহারকারী"
                intro="প্রতিটি বিক্রয়স্থল (বইমেলার স্টল, শোরুমের ডেস্ক) MetaPOS-এ একটি করে 'কাউন্টার'। প্রতিটি কাউন্টারের নিজস্ব সেশন, পেমেন্ট পদ্ধতি ও বইমেলা মোড সেটিং থাকে।"
              >
                <Steps
                  items={[
                    <>কাউন্টার তালিকা থেকে নতুন কাউন্টার তৈরি করুন (যেমন: "বই ঘর - কাউন্টার ১")।</>,
                    <>কাউন্টারের সেটিংসে <strong>বইমেলা মোড</strong> ডিফল্টভাবে চালু থাকে — স্টলের জন্য এটাই রাখুন।</>,
                    <>ক্যাশ ও কার্ড পেমেন্ট পদ্ধতি যুক্ত আছে কি না দেখে নিন।</>,
                    <>
                      ক্যাশিয়ারদের <strong>পিওএস ব্যবহারকারী</strong> এবং ম্যানেজারদের <strong>পিওএস অ্যাডমিনিস্ট্রেটর</strong> হিসেবে যুক্ত
                      করুন — ক্যাটালগ সম্পাদনা ও ড্যাশবোর্ড শুধু ম্যানেজাররা দেখবেন।
                    </>,
                  ]}
                />
              </Section>
            )}

            {active === 'catalog' && (
              <Section
                n="০২"
                title="বই ক্যাটালগ ও ISBN"
                intro="প্রতিটি বই শিরোনাম, লেখক (একাধিক হতে পারে), প্রকাশক, ধরন, সিরিজ, সংস্করণ, ভাষা, ফরম্যাট, পৃষ্ঠা, প্রকাশকাল, মূল্য ও প্রচ্ছদসহ সংরক্ষিত থাকে। ISBN-ই বইয়ের বারকোড।"
              >
                <Steps
                  items={[
                    <>ক্যাটালগ → বই → নতুন। ISBN-10 বা ISBN-13 লিখুন — হাইফেনসহ বা ছাড়া।</>,
                    <>সিস্টেম চেক ডিজিট যাচাই করে ISBN-13 হিসেবে রাখে, ISBN-10 দেখায় এবং বারকোডে ISBN বসিয়ে দেয়। একই ISBN দুবার নেয় না।</>,
                    <>
                      <strong>ISBN থেকে তথ্য আনুন</strong> চাপলে Open Library থেকে শিরোনাম, লেখক, প্রকাশক, পৃষ্ঠা, প্রকাশকাল ও প্রচ্ছদ পূরণ হয়
                      (সার্ভারে ইন্টারনেট লাগে; দেশি অনেক বই Open Library-তে না-ও থাকতে পারে, তখন হাতে লিখুন)।
                    </>,
                    <>অনেক বই একসাথে তুলতে বইয়ের তালিকা থেকে এক্সেল/CSV ইমপোর্ট ব্যবহার করুন।</>,
                  ]}
                />
                <div className="rounded-xl bg-[#0B192C] text-white p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-700 pb-2">
                    <span>নমুনা: একই বই, দুই রকম ISBN</span>
                    <button onClick={() => copy('9780140449136')} className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? 'কপি হয়েছে' : 'ISBN-13 কপি করুন'}</span>
                    </button>
                  </div>
                  <pre className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">
{`লিখেছেন:   0-14-044913-2      (ISBN-10)
সংরক্ষিত:  9780140449136      (ISBN-13 = বারকোড)
দেখায়:     ISBN-10 0140449132`}
                  </pre>
                </div>
              </Section>
            )}

            {active === 'hardware' && (
              <Section
                n="০৩"
                title="স্ক্যানার ও প্রিন্টার"
                intro="MetaPOS ব্রাউজারে চলে — কম্পিউটার, ল্যাপটপ বা ট্যাবলেটে আলাদা সফটওয়্যার ইনস্টল ছাড়াই।"
              >
                <Tiles
                  items={[
                    ['ইউএসবি ও ওয়্যারলেস বারকোড স্ক্যানার', 'স্ক্যানার কীবোর্ডের মতো কাজ করে — প্লাগ করে কাউন্টার স্ক্রিনে বইয়ের ISBN স্ক্যান করলেই বই অর্ডারে ওঠে।'],
                    ['রিসিট প্রিন্টার', 'পেমেন্টের পর রিসিট ব্রাউজারের প্রিন্ট ডায়ালগ দিয়ে যেকোনো প্রিন্টারে (৫৮/৮০ মিমি থার্মাল সহ) প্রিন্ট করুন। রিসিটে বইয়ের নিচে লেখকের নাম থাকে।'],
                  ]}
                />
              </Section>
            )}

            {active === 'selling' && (
              <Section n="০৪" title="কাউন্টারে বিক্রি ও পেমেন্ট" intro="বই স্ক্যান বা খুঁজে অর্ডারে যোগ করুন, প্রয়োজনে ছাড় দিন, তারপর পেমেন্ট নিন।">
                <Steps
                  items={[
                    <>ISBN স্ক্যান করুন, অথবা শিরোনাম, লেখক, প্রকাশক, ধরন, সিরিজ বা ISBN-এর অংশ লিখে খুঁজুন।</>,
                    <>অর্ডার লাইন বেছে নিয়ে নামপ্যাডে পরিমাণ বা ছাড় (%) বসান।</>,
                    <>পেমেন্টে ক্যাশ বা কার্ড বেছে নিন; একাধিক পদ্ধতিতে ভাগ করে নেওয়া যায় এবং ফেরত টাকার হিসাব নিজেই হয়।</>,
                    <>বই ফেরত এলে আগের অর্ডার খুঁজে রিফান্ড করুন — স্টকে কপি আবার যোগ হয়।</>,
                  ]}
                />
                <div className="rounded-xl border-2 border-[#D97706]/30 bg-[#FFFBEB] p-4 text-xs text-[#78350F] font-semibold">
                  বিকাশ বা নগদে টাকা নিতে চাইলে সেটিংসে ওই নামে আলাদা পেমেন্ট পদ্ধতি যোগ করুন। গ্রাহক নিজের ফোন থেকে টাকা পাঠানোর পর ক্যাশিয়ার
                  সেই পদ্ধতি বেছে নেন — বিকাশ/নগদের সাথে স্বয়ংক্রিয় সংযোগ নেই, তবে রিপোর্টে পদ্ধতিভিত্তিক হিসাব আলাদা দেখা যায়।
                </div>
              </Section>
            )}

            {active === 'session' && (
              <Section
                n="০৫"
                title="সেশন খোলা-বন্ধ ও ক্যাশ গণনা"
                intro="প্রতিদিনের বিক্রি একটি সেশনে থাকে। সেশন বন্ধের সময় গোনা টাকা প্রত্যাশিত টাকার সাথে মেলানো হয়।"
              >
                <Steps
                  items={[
                    <>কাউন্টার খুলুন এবং ড্রয়ারের শুরুর ক্যাশ (ফ্লোট) লিখুন।</>,
                    <>দিনশেষে সেশন বন্ধ করুন ও ড্রয়ারের টাকা গুনে লিখুন।</>,
                    <>বইমেলা মোডে কোনো জার্নাল এন্ট্রি হয় না; গোনা ও প্রত্যাশিত টাকার পার্থক্য সেশনের নোটে লেখা থাকে।</>,
                  ]}
                />
              </Section>
            )}

            {active === 'stock' && (
              <Section
                n="০৬"
                title="স্টক অন হ্যান্ড"
                intro="প্রতিটি বইয়ের একটি মাত্র সংখ্যা — হাতে কত কপি আছে। গুদাম, লোকেশন বা চালান নেই।"
              >
                <Steps
                  items={[
                    <>মেলা বা শোরুম শুরুর আগে ক্যাটালগ → স্টক অন হ্যান্ড তালিকায় প্রতিটি বইয়ের গোনা কপি বসান।</>,
                    <>প্রতিটি বিক্রিতে কপি কমে, রিফান্ডে বাড়ে; কাউন্টারে বইয়ের কার্ডে বাকি কপি দেখা যায়।</>,
                    <>হাতে করা প্রতিটি পরিবর্তন বইয়ের ইতিহাসে (লগ) থাকে — কে, কখন, কত থেকে কত।</>,
                  ]}
                />
              </Section>
            )}

            {active === 'reports' && (
              <Section
                n="০৭"
                title="ড্যাশবোর্ড ও রিপোর্ট"
                intro="বইমেলা → ড্যাশবোর্ড থেকে সময়সীমা (আজ, গতকাল, ৭ দিন, ৩০ দিন, এই মাস, এই বছর বা কাস্টম) ও এক বা একাধিক কাউন্টার বেছে নিন।"
              >
                <Tiles
                  items={[
                    ['মূল সংখ্যা', 'আয়, অর্ডার, বিক্রিত বই, গড় বাস্কেট, ভিন্ন শিরোনাম, অর্ডারপ্রতি বই, প্রদত্ত ছাড় ও ফেরত — আগের সময়ের সাথে তুলনা।'],
                    ['চার্ট ও তালিকা', 'দৈনিক আয়, ঘণ্টাপ্রতি অর্ডার, শীর্ষ ১০ বই, শীর্ষ লেখক ও প্রকাশক, ধরনভিত্তিক আয়, পেমেন্ট পদ্ধতি, ক্যাশিয়ার পারফরম্যান্স ও সেশন।'],
                    ['বই বিক্রয় বিশ্লেষণ', 'রিপোর্টিং মেনুতে পিভট, গ্রাফ ও তালিকা — শিরোনাম, লেখক, প্রকাশক, ধরন, ফরম্যাট, ক্যাশিয়ার, কাউন্টার, সেশন বা দিন অনুযায়ী।'],
                    ['এক্সপোর্ট', 'পিভট বা তালিকা থেকে সরাসরি Excel ফাইলে নামিয়ে নিন।'],
                  ]}
                />
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
