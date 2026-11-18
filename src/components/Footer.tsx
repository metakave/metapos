import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Heart, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenDemo: () => void;
  onOpenSignIn: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo, onOpenSignIn }) => {
  return (
    <footer className="bg-[#FAF9F5] border-t border-[#0B192C]/10 pt-16 pb-12">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Top Pre-Footer Banner Matching FoodOps */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#071F1A] to-[#064E3B] p-8 sm:p-12 text-white mb-16 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#10B981]/15 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-[#ECFDF5]/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FDE68A] mb-4">
              বাংলাদেশি প্রকাশকদের আধুনিক প্রযুক্তির অঙ্গীকার
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              অমর একুশে বইমেলা ও সারা বছরের শোরুম পরিচালনায় প্রস্তুত তো?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              বাংলাবাজার, আজিজ মার্কেট, কাঁটাবন ও সারা দেশের প্রকাশনা সংস্থা ও বুকস্টোরের সাথে যুক্ত হোন। আপনার প্রকাশনীকেও সাজিয়ে নিন MetaPOS-এ।
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDemo}
                className="rounded-full bg-white px-7 py-3.5 text-xs sm:text-sm font-bold text-[#0B192C] shadow-md hover:bg-slate-100 transition-all active:scale-95"
              >
                ফ্রি ডেমো সেশন বুক করুন
              </button>
              <Link
                to="/pricing"
                className="rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all"
              >
                প্যাকেজ ও মূল্যতালিকা দেখুন
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid (FoodOps exact 4-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#0B192C]/10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B192C] text-white shadow-xs">
                <BookOpen className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0B192C]">
                  Meta<span className="text-[#064E3B] font-extrabold">POS</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-[#831843] -mt-1">
                  মাল্টি সেলস সল্যুশন
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#0B192C]/75 leading-relaxed max-w-sm font-medium">
              বইমেলা ও বইয়ের দোকানের বাংলা পিওএস — ISBN স্ক্যান করে বিক্রি, বই ক্যাটালগ, বাকি কপির হিসাব ও বিক্রির ড্যাশবোর্ড এক প্ল্যাটফর্মে।
            </p>
            <div className="pt-2 text-xs text-[#0B192C]/70 space-y-1">
              <p className="flex items-center gap-1.5 font-bold text-[#0B192C]">
                <MapPin className="h-3.5 w-3.5 text-[#064E3B]" />
                <span>বাংলাবাজার ও কাওরান বাজার, ঢাকা, বাংলাদেশ</span>
              </p>
              <p className="flex items-center gap-1.5 font-bold text-[#0B192C]">
                <Phone className="h-3.5 w-3.5 text-[#064E3B]" />
                <span>+৮৮০ ১৭০০-০০০০০০ (সরাসরি বাংলা হেল্পলাইন)</span>
              </p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-2.5">
              <p className="font-bold text-[#0B192C] tracking-wide uppercase text-[11px]">প্রোডাক্ট</p>
              <Link to="/products" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">প্রোডাক্ট ওভারভিউ</Link>
              <Link to="/pricing" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">মূল্যতালিকা</Link>
              <button onClick={onOpenSignIn} className="text-left text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">লগইন পোর্টাল</button>
              <Link to="/products" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">বইমেলা কাউন্টার পিওএস</Link>
              <Link to="/products" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">বই ক্যাটালগ ও স্টক</Link>
              <Link to="/products" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">বইমেলা ড্যাশবোর্ড</Link>
            </div>

            {/* Column 2: Resource */}
            <div className="flex flex-col gap-2.5">
              <p className="font-bold text-[#0B192C] tracking-wide uppercase text-[11px]">রিসোর্স</p>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">ব্যবহার নির্দেশিকা</Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">রিলিজ নোট (v3.4)</Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors flex items-center gap-1.5">
                <span>সিস্টেম স্ট্যাটাস</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              </Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">ISBN ও মেটাডাটা গাইড</Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">কুরিয়ার এপিআই সংযোগ</Link>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col gap-2.5">
              <p className="font-bold text-[#0B192C] tracking-wide uppercase text-[11px]">কোম্পানি</p>
              <Link to="/contact" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">MetaPOS সম্পর্কে</Link>
              <Link to="/contact" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">যোগাযোগ করুন</Link>
              <Link to="/contact" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">প্রকাশকদের সাফল্যের গল্প</Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">ব্যবহারের শর্তাবলী</Link>
              <Link to="/docs" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors">গোপনীয়তা নীতি</Link>
            </div>

            {/* Column 4: Follow us */}
            <div className="flex flex-col gap-2.5">
              <p className="font-bold text-[#0B192C] tracking-wide uppercase text-[11px]">কমিউনিটি</p>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors flex items-center gap-1">
                <span>ফেসবুক পেজ ও গ্রুপ</span>
                <ArrowUpRight className="h-3 w-3 text-[#78350F]" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors flex items-center gap-1">
                <span>লিংকডইন</span>
                <ArrowUpRight className="h-3 w-3 text-[#78350F]" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors flex items-center gap-1">
                <span>ভিডিও টিউটোরিয়াল</span>
                <ArrowUpRight className="h-3 w-3 text-[#78350F]" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0B192C]/70 hover:text-[#064E3B] transition-colors flex items-center gap-1">
                <span>হোয়াটসঅ্যাপ হেল্প ডেস্ক</span>
                <ArrowUpRight className="h-3 w-3 text-[#78350F]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#0B192C]/70 gap-3">
          <p className="font-medium">কপিরাইট © ২০২৬ MetaPOS বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1 text-[11px] font-semibold text-[#0B192C]/60">
            বাংলা সাহিত্যের সমৃদ্ধিতে <Heart className="h-3 w-3 text-[#831843] fill-[#831843]" /> দিয়ে নির্মিত।
          </p>
        </div>
      </div>
    </footer>
  );
};
