import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  WifiOff, 
  Barcode, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  Layers, 
  Building2,
  Search,
  QrCode,
  User,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Tag,
  Check
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

const AVAILABLE_BOOKS: BookItem[] = [
  { id: '1', title: 'চিলেকোঠার সেপাই', author: 'আখতারুজ্জামান ইলিয়াস', isbn: '978-984-701-023-1', price: 550, stock: 14, format: 'হার্ডবাউন্ড', category: 'উপন্যাস', coverBg: 'bg-[#1E293B]', coverAccent: 'text-amber-400' },
  { id: '2', title: 'নকশী কাঁথার মাঠ', author: 'জসীমউদ্দীন', isbn: '978-984-401-442-8', price: 320, stock: 24, format: 'পেপারব্যাক', category: 'কবিতা', coverBg: 'bg-[#064E3B]', coverAccent: 'text-emerald-200' },
  { id: '3', title: 'দেবী (বিশেষ সংস্করণ)', author: 'হুমায়ূন আহমেদ', isbn: '978-984-500-112-4', price: 280, stock: 8, format: 'পেপারব্যাক', category: 'উপন্যাস', coverBg: 'bg-[#831843]', coverAccent: 'text-pink-200' },
  { id: '4', title: 'ইতিহাসের আলোয় বাংলাদেশ', author: 'অধ্যাপক সিরাজুল ইসলাম', isbn: '978-984-332-901-5', price: 650, stock: 19, format: 'হার্ডবাউন্ড', category: 'ইতিহাস', coverBg: 'bg-[#0F172A]', coverAccent: 'text-sky-300' },
  { id: '5', title: 'লালসালু (ক্লাসিক)', author: 'সৈয়দ ওয়ালীউল্লাহ্', isbn: '978-984-402-110-3', price: 350, stock: 15, format: 'হার্ডবাউন্ড', category: 'উপন্যাস', coverBg: 'bg-[#78350F]', coverAccent: 'text-amber-200' },
  { id: '6', title: 'একাত্তরের দিনগুলি', author: 'জাহানারা ইমাম', isbn: '978-984-700-098-2', price: 420, stock: 11, format: 'হার্ডবাউন্ড', category: 'ইতিহাস', coverBg: 'bg-[#1E3A8A]', coverAccent: 'text-blue-200' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'royalty' | 'catalog'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNumpadMode, setActiveNumpadMode] = useState<'qty' | 'disc' | 'price'>('qty');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('সাধারণ পাঠক (Walk-in)');
  
  // Interactive Cart for POS
  const [cart, setCart] = useState<{ book: BookItem; qty: number; discount: number }[]>([
    { book: AVAILABLE_BOOKS[0], qty: 1, discount: 25 },
    { book: AVAILABLE_BOOKS[1], qty: 2, discount: 25 },
  ]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  const [offlineMode, setOfflineMode] = useState(false);

  // Calculations
  const grossSubtotal = cart.reduce((sum, item) => sum + item.book.price * item.qty, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.book.price * item.qty * (item.discount / 100)), 0);
  const totalPayable = grossSubtotal - totalDiscount;

  const handleSelectBook = (book: BookItem) => {
    const existingIndex = cart.findIndex((i) => i.book.id === book.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].qty += 1;
      setCart(newCart);
      setSelectedLineIndex(existingIndex);
    } else {
      setCart([...cart, { book, qty: 1, discount: 25 }]);
      setSelectedLineIndex(cart.length);
    }
  };

  const handleNumpadInput = (val: string) => {
    if (cart.length === 0) return;
    const newCart = [...cart];
    const current = newCart[selectedLineIndex];

    if (val === 'C') {
      if (activeNumpadMode === 'qty') current.qty = 1;
      if (activeNumpadMode === 'disc') current.discount = 0;
    } else if (val === '⌫') {
      if (activeNumpadMode === 'qty' && current.qty > 1) {
        current.qty = Math.floor(current.qty / 10) || 1;
      }
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        if (activeNumpadMode === 'qty') {
          current.qty = current.qty === 1 ? num : parseInt(`${current.qty}${num}`, 10);
        } else if (activeNumpadMode === 'disc') {
          current.discount = num <= 50 ? num : 25;
        }
      }
    }
    setCart(newCart);
  };

  const handleRemoveLine = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    if (selectedLineIndex >= updated.length) {
      setSelectedLineIndex(Math.max(0, updated.length - 1));
    }
  };

  const filteredBooks = selectedCategory === 'all' 
    ? AVAILABLE_BOOKS 
    : AVAILABLE_BOOKS.filter(b => b.category === selectedCategory);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FBFBFA] via-[#F4F4F0]/60 to-[#FBFBFA]">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[440px] bg-gradient-to-tr from-[#064E3B]/10 via-[#D97706]/8 to-[#0B192C]/8 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Hero Header */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/40 bg-[#FFFBEB] px-4 py-1.5 text-xs font-semibold text-[#78350F] shadow-[0_2px_8px_rgba(180,83,9,0.08)] mb-6 transition-transform hover:scale-105">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#064E3B] animate-pulse" />
            <span className="text-[#831843] font-bold">Go beyond POS.</span>
            <span className="text-[#0B192C] font-semibold">বাংলাদেশের প্রকাশনা ও বই বিক্রির পূর্ণাঙ্গ ওএস</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B192C] leading-[1.14] sm:leading-[1.14]">
            Go beyond POS. <br />
            <span className="font-serif italic font-normal text-[#064E3B]">
              আপনার সেলস সিস্টেমের
            </span>{' '}
            অপারেটিং সিস্টেম
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-[#0B192C]/80 leading-relaxed font-normal">
            বাংলাদেশের প্রকাশনী ও বইয়ের শোরুমের জন্য বিশেষভাবে তৈরি —{' '}
            <strong className="text-[#064E3B] font-bold">অমর একুশে বইমেলার নেটওয়ার্ক জ্যামেও সচল অফলাইন কাউন্টার</strong>,{' '}
            <strong className="text-[#831843] font-bold">বিকাশ ও নগদ ইন্টিগ্রেশন</strong>, লাইভ স্টকে{' '}
            <strong className="text-[#0B192C] font-bold">লেখক রয়্যালটি ও ফর্মা কস্টিং</strong>, এবং বাংলা ক্যাটালগের স্মার্ট এআই।
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#064E3B] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#064E3B]/25 transition-all hover:bg-[#043E2F] hover:shadow-xl active:scale-95 border border-[#064E3B]"
            >
              <span>ফ্রি ডেমো বুক করুন (Schedule Demo)</span>
              <ArrowRight className="h-4 w-4 text-[#FDE68A]" />
            </button>

            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0B192C]/20 bg-white px-7 py-3.5 text-base font-bold text-[#0B192C] shadow-xs transition-all hover:bg-[#F4F4F0] hover:border-[#0B192C]/40 active:scale-95"
            >
              <span>মূল্যতালিকা দেখুন (Pricing in BDT)</span>
            </a>
          </div>

          {/* Highlight badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#0B192C]/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#064E3B]" /> ৩০ দিনের ফ্রি ট্রায়াল (কোনো কার্ডের প্রয়োজন নেই)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#064E3B]" /> ইন্টারনেট ছাড়াও ১০০% অফলাইন সেলস
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#064E3B]" /> বিকাশ, নগদ ও কুরিয়ার ট্র্যাকিং রেডি
            </span>
          </div>
        </div>

        {/* Hero Interactive Modern POS Mockup Showcase */}
        <div className="mt-14 sm:mt-18 rounded-2xl border-2 border-[#0B192C]/15 bg-white shadow-[0_20px_60px_-15px_rgba(11,25,44,0.12)] overflow-hidden">
          {/* Top POS Header Bar (Modern Touchscreen POS architecture) */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#0B192C]/10 bg-[#0B192C] px-4 sm:px-6 py-3 gap-3 text-white">
            {/* Cashier & Register Session Identifier */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  MP
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-wide">
                    কাউন্টার #০১ • বইমেলা স্টল
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium -mt-0.5">
                    ক্যাশিয়ার: তানভীর আহমেদ (সেশন সক্রিয়)
                  </span>
                </div>
              </div>
            </div>

            {/* View Switcher Pills */}
            <div className="flex items-center rounded-lg bg-slate-800/90 p-1 text-xs font-semibold text-slate-300">
              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'pos' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'hover:text-white'
                }`}
              >
                <Barcode className="h-3.5 w-3.5 text-emerald-300" />
                <span>টাচস্ক্রিন পিওএস টার্মিনাল</span>
              </button>
              <button
                onClick={() => setActiveTab('royalty')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'royalty' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'hover:text-white'
                }`}
              >
                <Calculator className="h-3.5 w-3.5 text-emerald-300" />
                <span>লেখক রয়্যালটি ও ফর্মা কস্টিং</span>
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'catalog' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-emerald-300" />
                <span>প্রেস, গুদাম ও রকমারি স্টক</span>
              </button>
            </div>

            {/* Offline Simulator Switch */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                  offlineMode
                    ? 'bg-[#FEF3C7] text-[#78350F] border-[#D97706]'
                    : 'bg-[#ECFDF5] text-[#064E3B] border-[#10B981]'
                }`}
                title="বইমেলার অফলাইন মোড পরীক্ষা করুন"
              >
                {offlineMode ? (
                  <>
                    <WifiOff className="h-3 w-3 text-[#D97706]" />
                    <span>মেলা অফলাইন (লোকাল সিঙ্ক)</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>ক্লাউড লাইভ (সিঙ্কড)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab 1: Modern Touchscreen POS Layout */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F5]">
              {/* LEFT / CENTER (7 cols): Touch Product Grid with Image Cards */}
              <div className="lg:col-span-7 p-4 sm:p-5 border-r border-[#0B192C]/10 flex flex-col justify-between space-y-4">
                {/* Search Bar & Category Pills */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0B192C]/40" />
                    <input
                      type="text"
                      placeholder="বইয়ের নাম, লেখক বা ISBN বারকোড স্ক্যান করুন..."
                      readOnly
                      value="ISBN স্ক্যানার রেডি: 978-984-701-023-1"
                      className="w-full rounded-xl border border-[#0B192C]/15 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-[#0B192C] shadow-xs focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-[#ECFDF5] text-[#064E3B] px-2 py-0.5 rounded border border-[#064E3B]/20">
                      Auto-Barcode Active
                    </span>
                  </div>

                  {/* Category Pills (Breadcrumbs) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategory === 'all' 
                          ? 'bg-[#0B192C] text-white shadow-xs' 
                          : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
                      }`}
                    >
                      সব বই ({AVAILABLE_BOOKS.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('উপন্যাস')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategory === 'উপন্যাস' 
                          ? 'bg-[#0B192C] text-white shadow-xs' 
                          : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
                      }`}
                    >
                      উপন্যাস
                    </button>
                    <button
                      onClick={() => setSelectedCategory('কবিতা')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategory === 'কবিতা' 
                          ? 'bg-[#0B192C] text-white shadow-xs' 
                          : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
                      }`}
                    >
                      কবিতা
                    </button>
                    <button
                      onClick={() => setSelectedCategory('ইতিহাস')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategory === 'ইতিহাস' 
                          ? 'bg-[#0B192C] text-white shadow-xs' 
                          : 'bg-white border border-[#0B192C]/15 text-[#0B192C] hover:bg-[#F4F4F0]'
                      }`}
                    >
                      ইতিহাস ও মুক্তিযুদ্ধ
                    </button>
                    <span className="rounded-lg bg-[#FFE4E6] border border-[#831843]/30 text-[#831843] px-3 py-1.5 font-bold shrink-0">
                      মেলা ২৫% ছাড় সচল
                    </span>
                  </div>
                </div>

                {/* Touch Product Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSelectBook(book)}
                      className="group cursor-pointer rounded-xl border border-[#0B192C]/10 bg-white p-2.5 flex flex-col justify-between shadow-2xs hover:border-[#064E3B] hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      {/* Book Cover Thumbnail with Spine Texture */}
                      <div className={`relative h-28 rounded-lg ${book.coverBg} p-2.5 flex flex-col justify-between overflow-hidden shadow-xs border-l-4 border-black/30`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-black/40 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                            {book.format}
                          </span>
                          <span className="text-[9px] font-bold bg-[#ECFDF5] text-[#064E3B] px-1.5 py-0.5 rounded shadow-2xs">
                            {book.stock} কপি
                          </span>
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${book.coverAccent} line-clamp-1`}>{book.title}</p>
                          <p className="text-[10px] text-slate-300 line-clamp-1">{book.author}</p>
                        </div>
                      </div>

                      {/* Card Bottom Meta & Price */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0B192C] line-clamp-1">{book.title}</p>
                          <p className="text-[10px] font-semibold text-[#78350F]">{book.isbn}</p>
                        </div>
                        <span className="text-xs font-black text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#064E3B]/20">
                          ৳{book.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Info bar */}
                <div className="text-[11px] text-[#0B192C]/70 font-semibold flex items-center justify-between pt-2 border-t border-[#0B192C]/10">
                  <span>💡 যেকোনো বইয়ের কার্ডে ক্লিক করে অর্ডারে যোগ করুন</span>
                  <span className="text-[#064E3B] font-bold">বারকোড অটো-কানেক্টেড</span>
                </div>
              </div>

              {/* RIGHT (5 cols): Order Lines, Touchscreen Numpad, and Tender */}
              <div className="lg:col-span-5 bg-white p-4 flex flex-col justify-between shadow-xs">
                {/* Customer Selection Row */}
                <div>
                  <div className="flex items-center justify-between rounded-xl bg-[#FAF9F5] p-2.5 border border-[#0B192C]/10 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#0B192C] text-white flex items-center justify-center">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[#0B192C]">{selectedCustomer}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(selectedCustomer.includes('রেগুলার') ? 'সাধারণ পাঠক (Walk-in)' : 'মো. আদনান করিম (রেগুলার মেম্বার)')}
                      className="text-[11px] font-bold text-[#064E3B] hover:underline"
                    >
                      {selectedCustomer.includes('রেগুলার') ? 'রিসেট' : '+ মেম্বার নির্বাচন'}
                    </button>
                  </div>

                  {/* Order Ticket Items Table */}
                  <div className="border border-[#0B192C]/10 rounded-xl overflow-hidden mb-3">
                    <div className="bg-[#FAF9F5] px-3 py-1.5 flex justify-between text-[11px] font-bold text-[#0B192C]/70 border-b border-[#0B192C]/10 uppercase tracking-wider">
                      <span>নির্বাচিত বই</span>
                      <span>পরিমাণ / ছাড় / দর</span>
                    </div>
                    <div className="max-h-36 overflow-y-auto divide-y divide-[#0B192C]/10 text-xs">
                      {cart.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">কোনো বই যোগ করা হয়নি</div>
                      ) : (
                        cart.map((item, idx) => {
                          const isSelected = selectedLineIndex === idx;
                          const lineNet = item.book.price * item.qty * (1 - item.discount / 100);
                          return (
                            <div
                              key={item.book.id}
                              onClick={() => setSelectedLineIndex(idx)}
                              className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#ECFDF5] border-l-4 border-[#064E3B]' : 'hover:bg-[#FAF9F5]'
                              }`}
                            >
                              <div className="flex-1 pr-2">
                                <p className="font-bold text-[#0B192C] line-clamp-1">{item.book.title}</p>
                                <p className="text-[10px] text-[#0B192C]/70">
                                  {item.qty} টি × ৳{item.book.price} {item.discount > 0 && <span className="text-[#831843] font-bold">({item.discount}% মেলা ছাড়)</span>}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#0B192C] text-xs">৳{lineNet.toFixed(0)}</span>
                                <button
                                  onClick={(e) => handleRemoveLine(idx, e)}
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

                  {/* Subtotal & Discount Breakdown */}
                  <div className="space-y-1.5 text-xs border-b border-[#0B192C]/10 pb-3">
                    <div className="flex justify-between text-[#0B192C]/80 font-medium">
                      <span>মোট গায়ের দাম</span>
                      <span className="font-bold text-[#0B192C]">৳{grossSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#831843] font-bold">
                      <span>বইমেলা বিশেষ ছাড় (২৫%)</span>
                      <span>-৳{totalDiscount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs font-bold text-[#0B192C]">পরিশোধযোগ্য সর্বমোট</span>
                      <span className="text-xl font-black text-[#064E3B]">৳{totalPayable.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Touchscreen Numpad & Quick Function Keys */}
                <div className="mt-3 space-y-2">
                  {/* Mode selector (Qty, Disc %, Price) */}
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    <button
                      onClick={() => setActiveNumpadMode('qty')}
                      className={`py-1.5 rounded-lg border transition-all ${
                        activeNumpadMode === 'qty'
                          ? 'bg-[#0B192C] text-white border-[#0B192C]'
                          : 'bg-[#FAF9F5] text-[#0B192C] border-[#0B192C]/15 hover:bg-slate-200'
                      }`}
                    >
                      পরিমাণ (Qty)
                    </button>
                    <button
                      onClick={() => setActiveNumpadMode('disc')}
                      className={`py-1.5 rounded-lg border transition-all ${
                        activeNumpadMode === 'disc'
                          ? 'bg-[#831843] text-white border-[#831843]'
                          : 'bg-[#FAF9F5] text-[#0B192C] border-[#0B192C]/15 hover:bg-slate-200'
                      }`}
                    >
                      ছাড় % (Disc)
                    </button>
                    <button
                      onClick={() => setActiveNumpadMode('price')}
                      className={`py-1.5 rounded-lg border transition-all ${
                        activeNumpadMode === 'price'
                          ? 'bg-[#064E3B] text-white border-[#064E3B]'
                          : 'bg-[#FAF9F5] text-[#0B192C] border-[#0B192C]/15 hover:bg-slate-200'
                      }`}
                    >
                      দর (Price)
                    </button>
                  </div>

                  {/* Numpad Keypad (1-9, C, 0, Backspace) */}
                  <div className="grid grid-cols-4 gap-1 text-xs font-bold">
                    {['1', '2', '3', 'Qty+1', '4', '5', '6', '25%মেলা', '7', '8', '9', 'C', '+/-', '0', '.', '⌫'].map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (key === 'Qty+1') {
                            if (cart[selectedLineIndex]) {
                              const newCart = [...cart];
                              newCart[selectedLineIndex].qty += 1;
                              setCart(newCart);
                            }
                          } else if (key === '25%মেলা') {
                            if (cart[selectedLineIndex]) {
                              const newCart = [...cart];
                              newCart[selectedLineIndex].discount = 25;
                              setCart(newCart);
                            }
                          } else {
                            handleNumpadInput(key);
                          }
                        }}
                        className="py-2 bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#0B192C]/10 rounded-lg text-[#0B192C] active:scale-95 transition-all text-center"
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {/* Payment Button */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenDemo}
                      className="w-full flex items-center justify-between rounded-xl bg-[#064E3B] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#064E3B]/20 hover:bg-[#043E2F] transition-all border border-[#064E3B]"
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-emerald-300" />
                        <span>পেমেন্ট ও মেমো প্রিন্ট (বিকাশ / ক্যাশ)</span>
                      </div>
                      <span className="text-sm font-black bg-white/20 px-2.5 py-0.5 rounded">
                        ৳{totalPayable.toFixed(0)} →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Author Royalties & Costing */}
          {activeTab === 'royalty' && (
            <div className="p-4 sm:p-6 bg-[#FAF9F5] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4">
                  <p className="text-xs font-bold text-[#0B192C]/60">বকেয়া লেখক রয়্যালটি (চলতি কিস্তি)</p>
                  <p className="text-2xl font-black text-[#0B192C] mt-1">৳৪,৮৫,৪০০</p>
                  <p className="text-[11px] text-[#064E3B] font-bold mt-1">↑ মেলা পূর্ববর্তী হিসাব প্রস্তুত</p>
                </div>
                <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4">
                  <p className="text-xs font-bold text-[#0B192C]/60">অগ্রিম সম্মানী সমন্বয় (Advances)</p>
                  <p className="text-2xl font-black text-[#064E3B] mt-1">৮৫.৪%</p>
                  <p className="text-[11px] text-[#0B192C]/70 font-medium mt-1">৪২ জন চুক্তিবদ্ধ লেখক</p>
                </div>
                <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4">
                  <p className="text-xs font-bold text-[#0B192C]/60">বাংলাবাজার ও মেলা ফেরত রিজার্ভ</p>
                  <p className="text-2xl font-black text-[#831843] mt-1">৳১,২০,০০০</p>
                  <p className="text-[11px] text-[#78350F] font-medium mt-1">ফেরত বইয়ের সম্ভাব্য ঝুঁকির বিপরীতে</p>
                </div>
              </div>

              {/* Sample Royalty Statements Table */}
              <div className="rounded-xl border border-[#0B192C]/10 bg-white overflow-hidden shadow-xs">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#0B192C]/10 bg-[#F4F4F0]">
                  <span className="text-xs font-bold text-[#0B192C]">স্বয়ংক্রিয় লেখক রয়্যালটি লেজার ও এক ক্লিকে বাংলা PDF মেমো</span>
                  <span className="text-[11px] text-[#064E3B] font-bold cursor-pointer hover:underline">সব লেখকের স্টেটমেন্ট ডাউনলোড করুন</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FBFBFA] text-[11px] font-bold uppercase tracking-wider text-[#0B192C]/70">
                      <tr>
                        <th className="px-4 py-2.5">লেখকের নাম</th>
                        <th className="px-4 py-2.5">প্রধান বই</th>
                        <th className="px-4 py-2.5">রয়্যালটি চুক্তির হার</th>
                        <th className="px-4 py-2.5">মুদ্রিত ও বিক্রিত কপি</th>
                        <th className="px-4 py-2.5">অগ্রিম সম্মানী স্ট্যাটাস</th>
                        <th className="px-4 py-2.5">প্রদেয় নেট রয়্যালটি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0B192C]/10">
                      <tr className="hover:bg-[#FAF9F5]">
                        <td className="px-4 py-3 font-bold text-[#0B192C]">আনিসুল হক</td>
                        <td className="px-4 py-3 text-[#0B192C]/80 font-medium">মা (বিশেষ সংস্করণ)</td>
                        <td className="px-4 py-3"><span className="rounded bg-[#ECFDF5] text-[#064E3B] px-2 py-0.5 text-[10px] font-bold border border-[#064E3B]/20">গায়ের দামের ১২%</span></td>
                        <td className="px-4 py-3 font-mono font-semibold">৫,২০০ কপি</td>
                        <td className="px-4 py-3"><span className="rounded bg-[#ECFDF5] text-[#064E3B] px-2 py-0.5 text-[10px] font-bold">অগ্রিম সম্পূর্ণ সমন্বিত</span></td>
                        <td className="px-4 py-3 font-extrabold text-[#064E3B]">৳১,৮৭,২০০</td>
                      </tr>
                      <tr className="hover:bg-[#FAF9F5]">
                        <td className="px-4 py-3 font-bold text-[#0B192C]">সেলিনা হোসেন</td>
                        <td className="px-4 py-3 text-[#0B192C]/80 font-medium">নীল ময়ূরের যৌবন</td>
                        <td className="px-4 py-3"><span className="rounded bg-blue-50 text-blue-800 px-2 py-0.5 text-[10px] font-bold">১০% নেট প্রাপ্তি</span></td>
                        <td className="px-4 py-3 font-mono font-semibold">২,১০০ কপি</td>
                        <td className="px-4 py-3"><span className="rounded bg-[#FFFBEB] text-[#B45309] px-2 py-0.5 text-[10px] font-bold">৳১৫,০০০ অগ্রিম বাকি</span></td>
                        <td className="px-4 py-3 font-extrabold text-[#0B192C]">৳৭২,৫০০</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Title Catalog & Stocks */}
          {activeTab === 'catalog' && (
            <div className="p-4 sm:p-6 bg-[#FAF9F5] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#0B192C]/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#064E3B]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B192C]">প্রেস, পেপার স্টক ও ওয়্যারহাউজ ইন্টিগ্রেশন</h4>
                    <p className="text-[11px] text-[#0B192C]/70">বাংলাবাজার প্রেস, নিজস্ব গুদাম এবং রকমারি / বাতিঘর কনসাইনমেন্টের লাইভ হিসাব।</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#ECFDF5] border border-[#064E3B]/20 px-2.5 py-1 text-[11px] font-bold text-[#064E3B]">
                    ✓ ১,২৪০টি বইয়ের বারকোড সচল
                  </span>
                  <button className="rounded-lg bg-[#0B192C] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800">
                    চালান রিপোর্ট ডাউনলোড
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0B192C]">বর্তমান বইয়ের স্টক বিবরণী</span>
                    <span className="text-[10px] font-bold text-[#064E3B]">লাইভ ট্র্যাকিং</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#FBFBFA]">
                      <span className="font-medium text-[#0B192C]">বাংলাবাজার প্রধান গুদাম</span>
                      <span className="font-mono font-bold text-[#0B192C]">১৪,৫০০ কপি</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#FBFBFA]">
                      <span className="font-medium text-[#0B192C]">অমর একুশে বইমেলা স্টল স্টক</span>
                      <span className="font-mono font-bold text-[#064E3B]">২,৮০০ কপি</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-[#FBFBFA]">
                      <span className="font-medium text-[#0B192C]">রকমারি ও অনলাইন কনসাইনমেন্ট</span>
                      <span className="font-mono font-bold text-[#831843]">৪,২০০ কপি</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#0B192C]/10 bg-white p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0B192C]">মুদ্রণ খরচ ও ফর্মা ক্যালকুলেটর</span>
                    <span className="rounded bg-[#FFFBEB] text-[#B45309] text-[10px] font-bold px-2 py-0.5 border border-[#D97706]/20">সক্রিয়</span>
                  </div>
                  <p className="text-xs text-[#0B192C]/80">
                    প্রতি ফর্মা প্লেট খরচ, ৮০ গ্রাম ডিমাই অফসেট পেপারের রিম প্রতি দর এবং ল্যামিনেশন যোগ করে বইয়ের সঠিক উৎপাদন খরচ নির্ধারণ করুন।
                  </p>
                  <div className="rounded-lg bg-[#F4F4F0] p-2.5 font-mono text-[11px] text-[#0B192C]">
                    <code>মুদ্রণ: ২,০০০ কপি • ফর্মা: ১২টি • উৎপাদন ব্যয়: ৳৭২/কপি • গায়ের দাম: ৳৩০০</code>
                  </div>
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
                  <span className="text-xs sm:text-sm font-bold text-[#0B192C] group-hover:text-[#064E3B]">
                    {pub.name}
                  </span>
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
