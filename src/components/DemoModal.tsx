import React, { useState } from 'react';
import { X, CheckCircle, BookOpen, Building, Mail, User, Shield, Phone, Loader2, AlertCircle } from 'lucide-react';
import { api, errorMessage } from '../lib/api';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, initialPlan = 'Growth' }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pressName: '',
    pressType: 'বাংলাবাজার সৃজনশীল প্রকাশনী',
    activeTitles: '৫০ - ৫০০টি বই',
    preferredDate: '2026-11-20',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api('/leads', { method: 'POST', body: { ...formData, plan: initialPlan } });
      setSubmitted(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
    setFormData((f) => ({ ...f, notes: '' }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0B192C]/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B192C]/10 bg-[#0B192C] text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">MetaPOS ফ্রি ডেমো বুক করুন</h3>
              <p className="text-[11px] text-slate-300">বাংলাদেশি প্রকাশনা ও বইমেলার জন্য বিশেষায়িত সেশন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-[#0B192C]">ডেমো রিকোয়েস্ট সফল হয়েছে!</h4>
            <p className="text-xs text-[#0B192C]/80 max-w-sm mx-auto leading-relaxed font-medium">
              ধন্যবাদ, <strong className="text-[#0B192C]">{formData.name || 'প্রকাশক'}</strong>। আপনার প্রকাশনী <strong className="text-[#0B192C]">{formData.pressName || 'আপনার প্রতিষ্ঠান'}</strong>-এর জন্য আমাদের পাবলিশিং স্পেশালিস্ট <span className="text-[#064E3B] font-bold">{formData.phone || formData.email}</span> নম্বরে যোগাযোগ করে লাইভ ডেমো ও ট্রায়াল লিঙ্ক বুঝিয়ে দেবেন।
            </p>
            <div className="rounded-xl bg-[#FAF9F5] border border-[#0B192C]/10 p-3 text-xs text-[#0B192C] font-semibold inline-block">
              📅 {formData.preferredDate} • সরাসরি বাংলাবাজার/অফিসে অথবা গুগল মিটে ৩০ মিনিটের সেশন
            </div>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="rounded-xl bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#043E2F]"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="rounded-lg bg-[#FEF3C7] border border-[#D97706]/30 p-3 text-[#78350F] text-[11px] flex items-center justify-between font-medium">
              <span>নির্বাচিত প্যাকেজ: <strong className="text-[#0B192C]">{initialPlan} Plan</strong></span>
              <span className="font-bold text-[#064E3B]">৩০ দিনের ফ্রি ট্রায়াল</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1">আপনার নাম</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো. রফিকুল ইসলাম"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1">মোবাইল / হোয়াটসঅ্যাপ নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1">প্রকাশনী বা শোরুমের নাম</label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: বাতিঘর / নবযুগ প্রকাশনী"
                    value={formData.pressName}
                    onChange={(e) => setFormData({ ...formData, pressName: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1">প্রতিষ্ঠানের ধরন</label>
                <select
                  value={formData.pressType}
                  onChange={(e) => setFormData({ ...formData, pressType: e.target.value })}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 px-3 text-xs focus:border-[#064E3B] focus:outline-none bg-white font-medium"
                >
                  <option>বাংলাবাজার সৃজনশীল প্রকাশনী</option>
                  <option>বুকস্টোর ও শোরুম (আউটলেট)</option>
                  <option>বিশ্ববিদ্যালয় / একাডেমিক প্রেস</option>
                  <option>অনলাইন বুকশপ ও বুক ক্যাফে</option>
                  <option>একক লেখক / লিটলম্যাগ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1">মোট প্রকাশিত বইয়ের সংখ্যা</label>
                <select
                  value={formData.activeTitles}
                  onChange={(e) => setFormData({ ...formData, activeTitles: e.target.value })}
                  className="w-full rounded-lg border border-[#0B192C]/20 py-2 px-3 text-xs focus:border-[#064E3B] focus:outline-none bg-white font-medium"
                >
                  <option>৫০টির নিচে</option>
                  <option>৫০ - ২০০টি বই</option>
                  <option>২০০ - ১,০০০টি বই</option>
                  <option>১,০০০ - ৫,০০০+ বই</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1">ইমেইল (ঐচ্ছিক)</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="email"
                    placeholder="contact@prokashoni.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0B192C] mb-1">বিশেষ কোনো চাহিদা বা বইমেলা স্টল সম্পর্কিত নোট</label>
              <textarea
                rows={2}
                placeholder="যেমন: বইমেলার জন্য ব্লুটুথ থার্মাল প্রিন্টার সংযোগ, লেখক রয়্যালটি বা গুদাম স্টক..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-lg border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#831843]/30 bg-[#FDF2F8] p-2.5 text-[11px] font-semibold text-[#831843]"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#064E3B] py-3 text-xs font-bold text-white shadow-md shadow-[#064E3B]/20 hover:bg-[#043E2F] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loading ? 'পাঠানো হচ্ছে…' : 'নিশ্চিত করুন ও ফ্রি ডেমো কল নির্ধারণ করুন'}
              </button>
              <p className="mt-2 text-center text-[10px] text-[#0B192C]/60 flex items-center justify-center gap-1 font-semibold">
                <Shield className="h-3 w-3 text-[#064E3B]" /> কোনো ক্রেডিট কার্ডের প্রয়োজন নেই • সম্পূর্ণ বাংলা সহায়তা
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
