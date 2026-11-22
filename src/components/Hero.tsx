import React, { useState } from 'react';
import {
  ArrowRight,
  Barcode,
  CheckCircle2,
  BookOpen,
  LineChart,
  Building2,
  Search,
  User,
  Trash2,
  Banknote,
  Download,
  Package,
  History,
  Zap,
} from 'lucide-react';
import { TRUSTED_PUBLISHERS } from '../data/publisherData';

interface HeroProps {
  onOpenDemo: () => void;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  format: string;
  category: string;
  coverBg: string;
  coverAccent: string;
}

/** Turn 12 digits into a valid, hyphenated ISBN-13 (adds the check digit). */
function isbn13(first12: string) {
  const sum = [...first12].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
  const full = first12 + ((10 - (sum % 10)) % 10);
  return `${full.slice(0, 3)}-${full.slice(3, 6)}-${full.slice(6, 9)}-${full.slice(9, 12)}-${full.slice(12)}`;
}

const AVAILABLE_BOOKS: BookItem[] = [
  { id: '1', title: 'চিলেকোঠার সেপাই', author: 'আখতারুজ্জামান ইলিয়াস', isbn: isbn13('978984701023'), price: 550, stock: 14, format: 'হার্ডকভার', category: 'উপন্যাস', coverBg: 'bg-[#1E293B]', coverAccent: 'text-amber-400' },
  { id: '2', title: 'নকশী কাঁথার মাঠ', author: 'জসীমউদ্দীন', isbn: isbn13('978984401442'), price: 320, stock: 24, format: 'পেপারব্যাক', category: 'কবিতা', coverBg: 'bg-[#064E3B]', coverAccent: 'text-emerald-200' },
  { id: '3', title: 'দেবী', author: 'হুমায়ূন আহমেদ', isbn: isbn13('978984500112'), price: 280, stock: 8, format: 'পেপারব্যাক', category: 'উপন্যাস', coverBg: 'bg-[#831843]', coverAccent: 'text-pink-200' },
  { id: '4', title: 'ইতিহাসের আলোয় বাংলাদেশ', author: 'সিরাজুল ইসলাম', isbn: isbn13('978984332901'), price: 650, stock: 3, format: 'হার্ডকভার', category: 'ইতিহাস', coverBg: 'bg-[#0F172A]', coverAccent: 'text-sky-300' },
  { id: '5', title: 'লালসালু', author: 'সৈয়দ ওয়ালীউল্লাহ্', isbn: isbn13('978984402110'), price: 350, stock: 15, format: 'হার্ডকভার', category: 'উপন্যাস', coverBg: 'bg-[#78350F]', coverAccent: 'text-amber-200' },
  { id: '6', title: 'একাত্তরের দিনগুলি', author: 'জাহানারা ইমাম', isbn: isbn13('978984700098'), price: 420, stock: 11, format: 'হার্ডকভার', category: 'ইতিহাস', coverBg: 'bg-[#1E3A8A]', coverAccent: 'text-blue-200' },
];

const bn = new Intl.NumberFormat('bn-BD');
const taka = (n: number) => `৳${bn.format(Math.round(n))}`;

// Sample figures modelled on the real "বই মেলা ড্যাশবোর্ড" (last 7 days).
const DASH_KPIS = [
  { label: 'আয়', value: '৳৩৬,৩৯৮', note: 'করসহ' },
  { label: 'অর্ডার', value: '৪১', note: 'গত ৭ দিন' },
  { label: 'বিক্রিত বই', value: '৯০', note: 'কপি' },
  { label: 'গড় বাস্কেট', value: '৳৮৮৮', note: 'অর্ডারপ্রতি' },
];
const DASH_DAILY = [
  { day: '১০ নভে', value: 7100 },
  { day: '১১ নভে', value: 7050 },
  { day: '১২ নভে', value: 5800 },
  { day: '১৩ নভে', value: 8950 },
  { day: '১৪ নভে', value: 6950 },
  { day: '১৫ নভে', value: 450 },
  { day: '১৬ নভে', value: 0 },
];
const DASH_TOP = [
  { title: 'মা', author: 'আনিসুল হক', copies: 9, revenue: 3400 },
  { title: 'দেবী', author: 'হুমায়ূন আহমেদ', copies: 7, revenue: 1587 },
  { title: 'আমার বন্ধু রাশেদ', author: 'মুহম্মদ জাফর ইকবাল', copies: 7, revenue: 1518 },
  { title: 'চিলেকোঠার সেপাই', author: 'আখতারুজ্জামান ইলিয়াস', copies: 6, revenue: 3000 },
  { title: 'একাত্তরের দিনগুলি', author: 'জাহানারা ইমাম', copies: 6, revenue: 2700 },
];

type Line = { book: BookItem; qty: number; discount: number };

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard' | 'catalog'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [numpadMode, setNumpadMode] = useState<'qty' | 'disc'>('qty');
  const [customer, setCustomer] = useState<string | null>(null);
  const [cart, setCart] = useState<Line[]>([
    { book: AVAILABLE_BOOKS[0], qty: 1, discount: 25 },
    { book: AVAILABLE_BOOKS[1], qty: 2, discount: 25 },
  ]);
  const [selectedLine, setSelectedLine] = useState(0);
  const [typed, setTyped] = useState(''); // digits typed since a line was selected

  const gross = cart.reduce((s, l) => s + l.book.price * l.qty, 0);
  const discount = cart.reduce((s, l) => s + l.book.price * l.qty * (l.discount / 100), 0);
  const payable = gross - discount;

  const updateLine = (idx: number, patch: Partial<Line>) =>
    setCart((c) => c.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const selectLine = (idx: number) => {
    setSelectedLine(idx);
    setTyped('');
  };

  const addBook = (book: BookItem) => {
    const idx = cart.findIndex((l) => l.book.id === book.id);
    if (idx >= 0) {
      updateLine(idx, { qty: cart[idx].qty + 1 });
      selectLine(idx);
    } else {
      setCart((c) => [...c, { book, qty: 1, discount: 0 }]);
      selectLine(cart.length);
    }
  };

  const pressKey = (key: string) => {
    const line = cart[selectedLine];
    if (!line) return;
    if (key === 'C') {
      setTyped('');
      updateLine(selectedLine, numpadMode === 'qty' ? { qty: 1 } : { discount: 0 });
      return;
    }
    const next = key === '⌫' ? typed.slice(0, -1) : (typed + key).replace(/^0+(?=\d)/, '');
    setTyped(next);
    const n = Number(next || '0');
    if (numpadMode === 'qty') updateLine(selectedLine, { qty: Math.max(1, Math.min(n, 999)) });
    else updateLine(selectedLine, { discount: Math.min(n, 100) });
  };

  const removeLine = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    if (selectedLine >= updated.length) selectLine(Math.max(0, updated.length - 1));
  };

  const categories = ['all', 'উপন্যাস', 'কবিতা', 'ইতিহাস'];
  const filteredBooks =
    selectedCategory === 'all' ? AVAILABLE_BOOKS : AVAILABLE_BOOKS.filter((b) => b.category === selectedCategory);
  const maxDaily = Math.max(...DASH_DAILY.map((d) => d.value));

  const tabs = [
    { id: 'pos' as const, label: 'বই কাউন্টার', icon: Barcode },
    { id: 'dashboard' as const, label: 'বইমেলা ড্যাশবোর্ড', icon: LineChart },
    { id: 'catalog' as const, label: 'বই ক্যাটালগ ও স্টক', icon: BookOpen },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FBFBFA] via-[#F4F4F0]/60 to-[#FBFBFA]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[440px] bg-gradient-to-tr from-[#064E3B]/10 via-[#D97706]/8 to-[#0B192C]/8 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Hero Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/40 bg-[#FFFBEB] px-4 py-1.5 text-xs font-semibold text-[#78350F] shadow-[0_2px_8px_rgba(180,83,9,0.08)] mb-6">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#00D492] animate-pulse" />
            <span className="text-[#831843] font-bold">Go beyond POS.</span>
            <span className="text-[#0B192C] font-semibold">বাংলাদেশের প্রকাশনা ও বই বিক্রির পূর্ণাঙ্গ ওএস</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B192C] leading-[1.14] sm:leading-[1.14]">
            Go beyond POS. <br />
            <span className="font-serif italic font-normal text-[#00875A]">
              আপনার সেলস সিস্টেমের
            </span>{' '}
            অপারেটিং সিস্টেম
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-[#0B192C]/80 leading-relaxed font-normal">
            বাংলাদেশের প্রকাশনী ও বইয়ের শোরুমের জন্য বিশেষভাবে তৈরি —{' '}
            <strong className="text-[#00875A] font-bold">অমর একুশে বইমেলার নেটওয়ার্ক জ্যামেও সচল অফলাইন কাউন্টার</strong>,{' '}
            <strong className="text-[#831843] font-bold">বিকাশ ও নগদ ইন্টিগ্রেশন</strong>, লাইভ স্টকে{' '}
            <strong className="text-[#0B192C] font-bold">লেখক রয়্যালটি ও ফর্মা কস্টিং</strong>, এবং বাংলা ক্যাটালগের স্মার্ট এআই।
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#00D492] px-8 py-3.5 text-base font-extrabold text-[#0B192C] shadow-lg shadow-[#00D492]/25 transition-all hover:bg-[#00B87D] hover:shadow-xl active:scale-95 border border-[#00D492] cursor-pointer"
            >
              <Zap className="h-4 w-4 text-[#0B192C]" />
              <span>ফ্রি ডেমো স্টোর তৈরি করুন (Instant Demo)</span>
              <ArrowRight className="h-4 w-4 text-[#0B192C]" />
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0B192C]/20 bg-white px-7 py-3.5 text-base font-bold text-[#0B192C] shadow-xs transition-all hover:bg-[#F4F4F0] hover:border-[#0B192C]/40 active:scale-95"
            >
              <span>মূল্যতালিকা দেখুন (Pricing in BDT)</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#0B192C]/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#00875A]" /> ৭ দিনের ফ্রি ট্রায়াল (7 Days Free Trial)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#00875A]" /> ISBN-10 ও ISBN-13 বারকোড সাপোর্ট
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#00875A]" /> সম্পূর্ণ বাংলা ইন্টারফেস
            </span>
          </div>
        </div>

        {/* Interactive product preview */}
        <div className="mt-14 sm:mt-18 rounded-2xl border-2 border-[#0B192C]/15 bg-white shadow-[0_20px_60px_-15px_rgba(11,25,44,0.12)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between border-b border-[#0B192C]/10 bg-[#0B192C] px-4 sm:px-6 py-3 gap-3 text-white">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#00D492] text-[#0B192C] flex items-center justify-center font-extrabold text-xs shadow-xs">MP</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">বই ঘর - কাউন্টার ১ • বইমেলা মোড</span>
                <span className="text-[10px] text-slate-300 font-medium -mt-0.5">ক্যাশিয়ার: তানভীর আহমেদ</span>
              </div>
            </div>

            <div role="tablist" className="flex flex-wrap items-center rounded-lg bg-slate-800/90 p-1 text-xs font-semibold text-slate-300">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                    activeTab === t.id ? 'bg-[#00D492] text-[#0B192C] font-extrabold shadow-xs' : 'hover:text-white'
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5 text-emerald-300" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-[#E6FBF4] text-[#00875A] border-[#00D492]">
              <span className="h-2 w-2 rounded-full bg-[#00D492] animate-pulse" />
              সেশন খোলা
            </span>
          </div>

          {/* Tab 1: Counter */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F5]">
              <div className="lg:col-span-7 p-4 sm:p-5 border-r border-[#0B192C]/10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B192C]/40" />
                    <input
                      type="text"
                      readOnly
                      aria-label="বই খুঁজুন"
                      value={`ISBN স্ক্যান: ${AVAILABLE_BOOKS[0].isbn}`}
                      className="w-full rounded-xl border border-[#0B192C]/15 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-[#0B192C] shadow-xs focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-[#ECFDF5] text-[#064E3B] px-2 py-0.5 rounded border border-[#064E3B]/20">
                      ISBN = বারকোড
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                          selectedCategory === c
                            ? 'bg-[#0B192C] text-white shadow-xs'
                            : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
                        }`}
                      >
                        {c === 'all' ? `সব বই (${bn.format(AVAILABLE_BOOKS.length)})` : c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => addBook(book)}
                      className="group text-left rounded-xl border border-[#0B192C]/10 bg-white p-2.5 flex flex-col justify-between shadow-2xs hover:border-[#064E3B] hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className={`relative h-28 w-full rounded-lg ${book.coverBg} p-2.5 flex flex-col justify-between overflow-hidden shadow-xs border-l-4 border-black/30`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold bg-black/40 text-white px-1.5 py-0.5 rounded">{book.format}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs ${
                              book.stock <= 5 ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#ECFDF5] text-[#064E3B]'
                            }`}
                          >
                            {bn.format(book.stock)} কপি বাকি
                          </span>
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${book.coverAccent} line-clamp-1`}>{book.title}</p>
                          <p className="text-[10px] text-slate-300 line-clamp-1">{book.author}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between gap-1 w-full">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0B192C] line-clamp-1">{book.title}</p>
                          <p className="text-[10px] font-semibold text-[#0B192C]/60 line-clamp-1">{book.author}</p>
                        </div>
                        <span className="text-xs font-black text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#064E3B]/20 shrink-0">
                          {taka(book.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-[#0B192C]/70 font-semibold flex items-center justify-between pt-2 border-t border-[#0B192C]/10">
                  <span>💡 বইয়ের কার্ডে ক্লিক বা ISBN স্ক্যান করে অর্ডারে যোগ করুন</span>
                  <span className="text-[#064E3B] font-bold">লেখক দিয়েও খোঁজা যায়</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between rounded-xl bg-[#FAF9F5] p-2.5 border border-[#0B192C]/10 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#0B192C] text-white flex items-center justify-center">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[#0B192C]">{customer ?? 'গ্রাহক নির্বাচন করা হয়নি'}</span>
                    </div>
                    <button
                      onClick={() => setCustomer(customer ? null : 'মো. আদনান করিম')}
                      className="text-[11px] font-bold text-[#064E3B] hover:underline"
                    >
                      {customer ? 'সরান' : '+ গ্রাহক'}
                    </button>
                  </div>

                  <div className="border border-[#0B192C]/10 rounded-xl overflow-hidden mb-3">
                    <div className="bg-[#FAF9F5] px-3 py-1.5 flex justify-between text-[11px] font-bold text-[#0B192C]/70 border-b border-[#0B192C]/10">
                      <span>অর্ডার</span>
                      <span>পরিমাণ / ছাড় / মূল্য</span>
                    </div>
                    <div className="max-h-36 overflow-y-auto divide-y divide-[#0B192C]/10 text-xs">
                      {cart.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">কোনো বই যোগ করা হয়নি</div>
                      ) : (
                        cart.map((item, idx) => {
                          const isSelected = selectedLine === idx;
                          const lineNet = item.book.price * item.qty * (1 - item.discount / 100);
                          return (
                            <div
                              key={item.book.id}
                              onClick={() => selectLine(idx)}
                              className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#ECFDF5] border-l-4 border-[#064E3B]' : 'hover:bg-[#FAF9F5]'
                              }`}
                            >
                              <div className="flex-1 pr-2 min-w-0">
                                <p className="font-bold text-[#0B192C] line-clamp-1">{item.book.title}</p>
                                <p className="text-[10px] text-[#0B192C]/60 line-clamp-1">{item.book.author}</p>
                                <p className="text-[10px] text-[#0B192C]/70">
                                  {bn.format(item.qty)} × {taka(item.book.price)}{' '}
                                  {item.discount > 0 && (
                                    <span className="text-[#831843] font-bold">({bn.format(item.discount)}% ছাড়)</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#0B192C] text-xs">{taka(lineNet)}</span>
                                <button
                                  onClick={(e) => removeLine(idx, e)}
                                  aria-label="লাইন মুছুন"
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs border-b border-[#0B192C]/10 pb-3">
                    <div className="flex justify-between text-[#0B192C]/80 font-medium">
                      <span>মোট গায়ের দাম</span>
                      <span className="font-bold text-[#0B192C]">{taka(gross)}</span>
                    </div>
                    <div className="flex justify-between text-[#831843] font-bold">
                      <span>মোট ছাড়</span>
                      <span>-{taka(discount)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs font-bold text-[#0B192C]">পরিশোধযোগ্য</span>
                      <span className="text-xl font-black text-[#064E3B]">{taka(payable)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                    {(
                      [
                        ['qty', 'পরিমাণ'],
                        ['disc', 'ছাড় %'],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setNumpadMode(mode);
                          setTyped('');
                        }}
                        aria-pressed={numpadMode === mode}
                        className={`py-1.5 rounded-lg border transition-all ${
                          numpadMode === mode
                            ? 'bg-[#0B192C] text-white border-[#0B192C]'
                            : 'bg-[#FAF9F5] text-[#0B192C] border-[#0B192C]/15 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-xs font-bold">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
                      <button
                        key={key}
                        onClick={() => pressKey(key)}
                        className="py-2 bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#0B192C]/10 rounded-lg text-[#0B192C] active:scale-95 transition-all text-center"
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenDemo}
                      className="w-full flex items-center justify-between rounded-xl bg-[#00D492] px-4 py-3 text-xs font-extrabold text-[#0B192C] shadow-md shadow-[#00D492]/20 hover:bg-[#00B87D] transition-all border border-[#00D492] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-[#0B192C]" />
                        <span>পেমেন্ট (ক্যাশ / কার্ড) ও রিসিট</span>
                      </div>
                      <span className="text-sm font-black bg-black/10 px-2.5 py-0.5 rounded">{taka(payable)} →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="p-4 sm:p-6 bg-[#FAF9F5] space-y-5">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                {['আজ', 'গতকাল', '৭ দিন', '৩০ দিন', 'এই মাস', 'এই বছর'].map((r) => (
                  <span
                    key={r}
                    className={`rounded-lg px-2.5 py-1 border ${
                      r === '৭ দিন' ? 'bg-[#0B192C] text-white border-[#0B192C]' : 'bg-white text-[#0B192C]/70 border-[#0B192C]/15'
                    }`}
                  >
                    {r}
                  </span>
                ))}
                <span className="ml-auto text-[#0B192C]/50 font-semibold">নমুনা ডেটা • সব কাউন্টার</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DASH_KPIS.map((k) => (
                  <div key={k.label} className="rounded-xl border border-[#0B192C]/10 bg-white p-4">
                    <p className="text-xs font-bold text-[#0B192C]/60">{k.label}</p>
                    <p className="text-2xl font-black text-[#0B192C] mt-1">{k.value}</p>
                    <p className="text-[11px] text-[#0B192C]/50 font-semibold mt-0.5">{k.note}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 rounded-xl border border-[#0B192C]/10 bg-white p-4">
                  <p className="text-xs font-bold text-[#0B192C] mb-3">দৈনিক আয়</p>
                  <div className="flex items-end justify-between gap-2 h-36 border-b border-[#0B192C]/20">
                    {DASH_DAILY.map((d) => (
                      <div key={d.day} className="flex-1 flex justify-center" title={`${d.day}: ${taka(d.value)}`}>
                        <div
                          className="w-full max-w-[24px] rounded-t-[4px] bg-[#2a78d6] hover:opacity-80 transition-opacity"
                          style={{ height: `${Math.max(d.value ? 3 : 0, (d.value / maxDaily) * 136)}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2 pt-1.5">
                    {DASH_DAILY.map((d) => (
                      <span key={d.day} className="flex-1 text-center text-[9px] font-semibold text-[#0B192C]/50">
                        {d.day.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3 rounded-xl border border-[#0B192C]/10 bg-white overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#0B192C]/10 flex justify-between">
                    <span className="text-xs font-bold text-[#0B192C]">শীর্ষ শিরোনাম</span>
                    <span className="text-[11px] font-bold text-[#064E3B]">কপি • আয়</span>
                  </div>
                  <ol className="divide-y divide-[#0B192C]/5 text-xs">
                    {DASH_TOP.map((b, i) => (
                      <li key={b.title} className="flex items-center gap-3 px-4 py-2">
                        <span className="w-4 text-[#0B192C]/40 font-bold">{bn.format(i + 1)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0B192C] line-clamp-1">{b.title}</p>
                          <p className="text-[10px] text-[#0B192C]/60 line-clamp-1">{b.author}</p>
                        </div>
                        <span className="font-bold text-[#0B192C]">{bn.format(b.copies)}</span>
                        <span className="w-16 text-right font-bold text-[#064E3B]">{taka(b.revenue)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <p className="text-[11px] text-[#0B192C]/60 font-semibold">
                এছাড়াও: ঘণ্টাপ্রতি অর্ডার, শীর্ষ লেখক ও প্রকাশক, ধরনভিত্তিক আয়, পেমেন্ট পদ্ধতি, ক্যাশিয়ার পারফরম্যান্স ও সেশন তালিকা।
              </p>
            </div>
          )}

          {/* Tab 3: Catalogue & stock */}
          {activeTab === 'catalog' && (
            <div className="p-4 sm:p-6 bg-[#FAF9F5] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="h-20 w-14 shrink-0 rounded-md bg-[#1E293B] border-l-4 border-black/30 p-1.5 flex items-end">
                      <span className="text-[8px] font-bold text-amber-400 leading-tight">চিলেকোঠার সেপাই</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B192C]">চিলেকোঠার সেপাই</h4>
                      <p className="text-[11px] text-[#0B192C]/60 font-semibold">আখতারুজ্জামান ইলিয়াস</p>
                      <p className="mt-1 text-[11px] font-mono text-[#0B192C]/70">ISBN-13: {AVAILABLE_BOOKS[0].isbn}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-[#0B192C] px-2.5 py-1.5 text-[10px] font-bold text-white flex items-center gap-1">
                    <Download className="h-3 w-3" /> ISBN থেকে তথ্য আনুন
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] border-t border-[#0B192C]/10 pt-3">
                  {[
                    ['প্রকাশক', 'নমুনা প্রকাশনী'],
                    ['ধরন', 'উপন্যাস'],
                    ['ফরম্যাট', 'হার্ডকভার'],
                    ['ভাষা', 'বাংলা'],
                    ['পৃষ্ঠা', '২৯৬'],
                    ['প্রকাশকাল', '১৯৮৬'],
                    ['গায়ের দাম', '৳৫৫০'],
                    ['বিক্রিত কপি', '৬'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-[#0B192C]/55 font-semibold">{k}</dt>
                      <dd className="font-bold text-[#0B192C]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[10px] text-[#0B192C]/55 font-semibold">
                  ISBN-10 লিখলেও যাচাই করে ISBN-13-এ রূপান্তর হয়; একই ISBN দুবার নেওয়া হয় না।
                </p>
              </div>

              <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0B192C] flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-[#064E3B]" /> স্টক অন হ্যান্ড
                  </span>
                  <span className="text-[10px] font-bold text-[#064E3B]">বিক্রি ও ফেরতে স্বয়ংক্রিয়</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {AVAILABLE_BOOKS.slice(0, 5).map((b) => (
                    <li key={b.id} className="flex justify-between items-center p-2 rounded-lg bg-[#FBFBFA]">
                      <span className="font-medium text-[#0B192C] line-clamp-1">{b.title}</span>
                      <span className={`font-bold ${b.stock <= 5 ? 'text-[#B45309]' : 'text-[#0B192C]'}`}>
                        {bn.format(b.stock)} কপি
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-start gap-2 rounded-lg bg-[#F4F4F0] p-2.5 text-[11px] text-[#0B192C]/80 font-medium">
                  <History className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#064E3B]" />
                  <span>লগ: "ইতিহাসের আলোয় বাংলাদেশ" — হাতে গোনা স্টক ১০ → ৩ (মেলা শুরুর আগে গণনা)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Proof Bar */}
        <div className="mt-16 pt-10 border-t border-[#0B192C]/10">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#0B192C]/60 mb-6">
            বাংলাদেশের শীর্ষস্থানীয় প্রকাশনা প্রতিষ্ঠান ও বুকস্টোরের বিশ্বস্ত সঙ্গী
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TRUSTED_PUBLISHERS.map((pub) => (
              <div key={pub.name} className="flex items-center gap-2 group cursor-default">
                <Building2 className="h-4 w-4 text-[#064E3B] transition-colors" />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#0B192C] group-hover:text-[#064E3B]">{pub.name}</span>
                  <span className="text-[10px] text-[#78350F] font-semibold -mt-0.5">{pub.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
