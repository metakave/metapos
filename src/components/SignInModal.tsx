import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, BookOpen } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onOpenDemo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0B192C]/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B192C]/10 bg-[#0B192C] text-white">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-emerald-300" />
            </div>
            <span className="text-sm font-bold text-white">MetaPOS প্রকাশক লগইন</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loggedIn ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-[#0B192C]">প্রকাশক সেশন প্রস্তুত</h4>
            <p className="text-xs text-[#0B192C]/80 font-medium">
              স্বাগতম! আপনার ক্যাটালগ, বইমেলা কাউন্টার ও রয়্যালটি খাতা লোড করা হচ্ছে...
            </p>
            <button
              onClick={() => {
                setLoggedIn(false);
                onClose();
              }}
              className="mt-2 rounded-xl bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white"
            >
              ড্যাশবোর্ডে প্রবেশ করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#0B192C] mb-1">প্রকাশনী অ্যাকাউন্ট ইমেইল বা মোবাইল</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                <input
                  type="text"
                  required
                  placeholder="editor@press.com.bd অথবা 017xxxxxxxx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-[#0B192C]">পাসওয়ার্ড</label>
                <a href="#reset" className="text-[11px] font-bold text-[#831843] hover:underline">ভুলে গেছেন?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#064E3B] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#043E2F] transition-all flex items-center justify-center gap-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#0B192C]/70 border-t border-[#0B192C]/10 font-medium">
              আপনার প্রকাশনীর অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDemo();
                }}
                className="font-bold text-[#064E3B] hover:underline"
              >
                ফ্রি ডেমো বুক করুন
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
