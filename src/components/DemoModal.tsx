import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Building,
  Mail,
  User,
  Shield,
  Phone,
  Loader2,
  AlertCircle,
  Sparkles,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { api, errorMessage } from '../lib/api';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  defaultTab?: 'instant' | 'call';
}

interface CreatedStoreData {
  url: string;
  shop: string;
  ownerLogin: string;
  ownerPassword: string;
  subdomain: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'Spark',
  defaultTab = 'instant',
}) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'call'>(defaultTab);

  // Instant store form state
  const [instantForm, setInstantForm] = useState({
    shopName: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });
  const [subdomainEdited, setSubdomainEdited] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available?: boolean;
    error?: string;
  }>({ checking: false });

  // Creation progress states
  const [creating, setCreating] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [createdStore, setCreatedStore] = useState<CreatedStoreData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Call booking form state
  const [callSubmitted, setCallSubmitted] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callForm, setCallForm] = useState({
    name: '',
    phone: '',
    email: '',
    pressName: '',
    pressType: 'বাংলাবাজার সৃজনশীল প্রকাশনী',
    activeTitles: '৫০ - ৫০০টি বই',
    preferredDate: '2026-11-20',
    notes: '',
  });

  const [instantError, setInstantError] = useState<string | null>(null);

  // Slug generator
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
  };

  // Auto-generate subdomain from shop name if not manually edited
  const handleShopNameChange = (val: string) => {
    const updated = { ...instantForm, shopName: val };
    if (!subdomainEdited) {
      const slug = slugify(val);
      if (slug.length >= 2) {
        updated.subdomain = slug;
      }
    }
    setInstantForm(updated);
  };

  // Check subdomain availability with debounce
  useEffect(() => {
    const sub = instantForm.subdomain.trim().toLowerCase();
    if (sub.length < 2) {
      setSubdomainStatus({ checking: false, available: undefined });
      return;
    }

    if (!/^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/.test(sub)) {
      setSubdomainStatus({
        checking: false,
        available: false,
        error: 'ছোট হাতের ইংরেজি অক্ষর (a-z), সংখ্যা (0-9) ও হাইফেন (-) ব্যবহার করুন (২-৩০ অক্ষর)',
      });
      return;
    }

    setSubdomainStatus({ checking: true });
    const timer = setTimeout(async () => {
      try {
        const res = await api<{ available: boolean; reason?: string }>(`/tenants/check?subdomain=${sub}`);
        setSubdomainStatus({
          checking: false,
          available: res.available,
          error: res.available ? undefined : res.reason || 'সাবডোমেনটি ইতিমধ্যে ব্যবহৃত হয়েছে।',
        });
      } catch {
        setSubdomainStatus({ checking: false, available: true });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [instantForm.subdomain]);

  if (!isOpen) return null;

  // Handle instant store creation
  const handleInstantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = instantForm.subdomain.trim().toLowerCase();
    if (!sub || sub.length < 2) {
      setInstantError('অনুগ্রহ করে একটি সঠিক সাবডোমেন দিন (২-৩০ অক্ষর)।');
      return;
    }
    if (subdomainStatus.available === false) {
      setInstantError(subdomainStatus.error || 'এই সাবডোমেনটি গ্রহণযোগ্য নয়।');
      return;
    }

    setCreating(true);
    setInstantError(null);
    setProgressStep(1);

    const stepTimer1 = setTimeout(() => setProgressStep(2), 2000);
    const stepTimer2 = setTimeout(() => setProgressStep(3), 5000);

    try {
      const res = await api<{
        success: boolean;
        url: string;
        shop: string;
        ownerLogin: string;
        ownerPassword: string;
      }>('/tenants/create', {
        method: 'POST',
        body: {
          subdomain: sub,
          shopName: instantForm.shopName,
          ownerEmail: instantForm.ownerEmail,
          ownerName: instantForm.ownerName || instantForm.shopName,
          phone: instantForm.ownerPhone,
        },
      });

      setCreatedStore({
        url: res.url,
        shop: res.shop,
        ownerLogin: res.ownerLogin,
        ownerPassword: res.ownerPassword,
        subdomain: sub,
      });
    } catch (err) {
      setInstantError(errorMessage(err));
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setCreating(false);
      setProgressStep(0);
    }
  };

  // Handle call scheduling form submission
  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallLoading(true);
    setCallError(null);
    try {
      await api('/leads', { method: 'POST', body: { ...callForm, plan: initialPlan } });
      setCallSubmitted(true);
    } catch (err) {
      setCallError(errorMessage(err));
    } finally {
      setCallLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleClose = () => {
    setCreatedStore(null);
    setCallSubmitted(false);
    setInstantError(null);
    setCallError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#0B192C]/10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#0B192C]/10 bg-[#0B192C] text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00D492] text-[#0B192C] flex items-center justify-center shadow-inner">
              <Zap className="h-5 w-5 text-[#0B192C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">MetaPOS ফ্রি ডেমো</h3>
                <span className="rounded-full bg-[#00D492]/20 text-[#00D492] text-[10px] font-extrabold px-2 py-0.5 border border-[#00D492]/30">
                  ৭ দিনের ফ্রি ট্রায়াল
                </span>
              </div>
              <p className="text-[11px] text-slate-300">১০ সেকেন্ডে নিজস্ব পিওএস ও বুকস্টোর ক্লাউড সার্ভার প্রস্তুত</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher (Only when not viewing success screen) */}
        {!createdStore && !callSubmitted && (
          <div className="flex border-b border-[#0B192C]/10 bg-[#FAF9F5] p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('instant')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'instant'
                  ? 'bg-white text-[#00875A] shadow-xs border border-[#00D492]/30'
                  : 'text-[#0B192C]/70 hover:text-[#0B192C] hover:bg-white/50'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-[#00D492]" />
              <span>তাত্ক্ষণিক লাইভ ডেমো স্টোর</span>
              <span className="text-[10px] bg-[#E6FBF4] text-[#00875A] px-1.5 py-0.2 rounded font-black border border-[#00D492]/30">
                স্বয়ংক্রিয়
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('call')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'call'
                  ? 'bg-white text-[#0B192C] shadow-xs border border-[#0B192C]/20'
                  : 'text-[#0B192C]/70 hover:text-[#0B192C] hover:bg-white/50'
              }`}
            >
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span>বিশেষজ্ঞের ডেমো মিটিং</span>
            </button>
          </div>
        )}

        {/* Tab 1: Instant Store Creation Success */}
        {createdStore ? (
          <div className="p-7 space-y-5 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[#E6FBF4] text-[#00875A] flex items-center justify-center shadow-lg shadow-[#00D492]/10 border border-[#00D492]/30 animate-bounce">
              <CheckCircle className="h-9 w-9 text-[#00875A]" />
            </div>

            <div>
              <span className="inline-block rounded-full bg-[#E6FBF4] text-[#00875A] text-[11px] font-black px-3 py-1 border border-[#00D492]/30 mb-2">
                🎉 স্টোর প্রস্তুত ও সক্রিয়
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B192C]">
                {createdStore.shop} এর ডেমো কাউন্টার লাইভ!
              </h4>
              <p className="mt-1 text-xs text-[#0B192C]/75 max-w-md mx-auto">
                আপনার ক্লাউড পিওএস ও বুকস্টোর ইনস্ট্যান্স সম্পূর্ণ প্রস্তুত। লগইন ক্রেডেনশিয়াল আপনার ইমেইল{' '}
                <strong className="text-[#00875A] font-bold">{createdStore.ownerLogin}</strong> এ পাঠিয়ে দেওয়া হয়েছে।
              </p>
            </div>

            {/* Direct Open Store CTA */}
            <div className="p-4 bg-gradient-to-br from-[#0B192C] to-[#070F1A] border-2 border-[#00D492] rounded-2xl text-white shadow-lg text-left">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D492] flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#00D492]" /> আপনার ডেমো স্টোর URL
                </span>
                <span className="text-[10px] font-extrabold bg-[#00D492] text-[#0B192C] px-2 py-0.5 rounded">লাইভ পিওএস</span>
              </div>
              <div className="flex items-center justify-between bg-black/40 rounded-xl p-2.5 font-mono text-xs text-white gap-2 border border-white/10">
                <span className="truncate font-bold text-[#00D492]">{createdStore.url}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdStore.url, 'url')}
                  className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded text-[11px] font-sans font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedField === 'url' ? <Check className="h-3 w-3 text-[#00D492]" /> : <Copy className="h-3 w-3" />}
                  {copiedField === 'url' ? 'কপি হয়েছে' : 'কপি'}
                </button>
              </div>

              <a
                href={createdStore.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3.5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00D492] hover:bg-[#00B87D] text-[#0B192C] font-extrabold text-xs py-3 shadow-md transition-all active:scale-95"
              >
                <span>স্টোরে প্রবেশ করে কাউন্টার চালু করুন</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Credentials Card */}
            <div className="rounded-2xl border-2 border-dashed border-[#00D492]/40 bg-[#FAF9F5] p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#00875A] uppercase tracking-wider">
                  🔑 লগইন ক্রেডেনশিয়াল
                </span>
                <span className="text-[10px] text-[#0B192C]/60 font-semibold">নিরাপদে সংরক্ষণ করুন</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#0B192C]/10 text-xs">
                <span className="text-[#0B192C]/60 font-semibold">ইমেইল / আইডি:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0B192C] font-mono">{createdStore.ownerLogin}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdStore.ownerLogin, 'email')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="কপি করুন"
                  >
                    {copiedField === 'email' ? <Check className="h-3 w-3 text-[#00875A]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#0B192C]/10 text-xs">
                <span className="text-[#0B192C]/60 font-semibold">পাসওয়ার্ড:</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#00875A] font-mono tracking-wider">{createdStore.ownerPassword}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdStore.ownerPassword, 'pass')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="কপি করুন"
                  >
                    {copiedField === 'pass' ? <Check className="h-3 w-3 text-[#00875A]" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl bg-[#0B192C] py-2.5 text-xs font-bold text-white hover:bg-[#0B192C]/90"
              >
                ধন্যবাদ, সম্পন্ন করুন
              </button>
            </div>
          </div>
        ) : callSubmitted ? (
          /* Tab 2: Call Booking Success */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-[#0B192C]">ডেমো রিকোয়েস্ট সফল হয়েছে!</h4>
            <p className="text-xs text-[#0B192C]/80 max-w-sm mx-auto leading-relaxed font-medium">
              ধন্যবাদ, <strong className="text-[#0B192C]">{callForm.name || 'প্রকাশক'}</strong>। আপনার প্রকাশনী{' '}
              <strong className="text-[#0B192C]">{callForm.pressName || 'আপনার প্রতিষ্ঠান'}</strong>-এর জন্য আমাদের পাবলিশিং স্পেশালিস্ট{' '}
              <span className="text-[#064E3B] font-bold">{callForm.phone || callForm.email}</span> নম্বরে যোগাযোগ করবেন।
            </p>
            <div className="rounded-xl bg-[#FAF9F5] border border-[#0B192C]/10 p-3 text-xs text-[#0B192C] font-semibold inline-block">
              📅 {callForm.preferredDate} • সরাসরি বাংলাবাজার/অফিসে অথবা গুগল মিটে ৩০ মিনিটের সেশন
            </div>
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="rounded-xl bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#043E2F]"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        ) : activeTab === 'instant' ? (
          /* Tab 1: Instant Demo Store Form */
          <form onSubmit={handleInstantSubmit} className="p-6 space-y-4 text-xs">
            {creating ? (
              <div className="py-10 px-4 text-center space-y-5">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#064E3B]/20 border-t-[#064E3B] animate-spin" />
                  <Zap className="h-6 w-6 text-[#064E3B] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0B192C]">আপনার ডেমো স্টোর তৈরি হচ্ছে...</h4>
                  <p className="text-xs text-[#0B192C]/70 mt-1">এটি সাধারণত ৫ থেকে ১০ সেকেন্ড সময় নেয়</p>
                </div>

                <div className="max-w-xs mx-auto space-y-2 text-left text-xs bg-[#FAF9F5] p-3.5 rounded-xl border border-[#0B192C]/10">
                  <div className="flex items-center gap-2 text-[#0B192C]">
                    <span className={`h-2 w-2 rounded-full ${progressStep >= 1 ? 'bg-[#064E3B]' : 'bg-slate-300'}`} />
                    <span className={progressStep >= 1 ? 'font-bold text-[#064E3B]' : 'text-slate-500'}>
                      ১. ক্লাউড ডেটাবেস প্রস্তুত হচ্ছে...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0B192C]">
                    <span className={`h-2 w-2 rounded-full ${progressStep >= 2 ? 'bg-[#064E3B]' : 'bg-slate-300'}`} />
                    <span className={progressStep >= 2 ? 'font-bold text-[#064E3B]' : 'text-slate-500'}>
                      ২. বইমেলা পিওএস ও ক্যাটালগ কনফিগার হচ্ছে...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0B192C]">
                    <span className={`h-2 w-2 rounded-full ${progressStep >= 3 ? 'bg-[#064E3B]' : 'bg-slate-300'}`} />
                    <span className={progressStep >= 3 ? 'font-bold text-[#064E3B]' : 'text-slate-500'}>
                      ৩. পাসওয়ার্ড তৈরি ও ইমেইল পাঠানো হচ্ছে...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-[#FEF3C7] border border-[#D97706]/30 p-3 text-[#78350F] text-[11px] flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>কোনো ক্রেডিট কার্ড লাগবে না • ৭ দিনের পূর্ণ ডেমো ট্রায়াল</span>
                  </div>
                  <span className="font-extrabold text-[#064E3B] bg-white px-2 py-0.5 rounded shadow-xs">ফ্রি</span>
                </div>

                {/* Shop Name */}
                <div>
                  <label className="block font-bold text-[#0B192C] mb-1">
                    দোকান বা প্রকাশনীর নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: অনন্যা প্রকাশন বা Batighar"
                      value={instantForm.shopName}
                      onChange={(e) => handleShopNameChange(e.target.value)}
                      className="w-full rounded-xl border border-[#0B192C]/20 py-2.5 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none font-semibold text-[#0B192C]"
                    />
                  </div>
                </div>

                {/* Subdomain Input with Live Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[#0B192C]">
                      আপনার স্টোরের সাবডোমেন URL <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-[#0B192C]/60 font-medium">ইংরেজি ছোট অক্ষরের ২-৩০ বর্ণ</span>
                  </div>
                  <div className="relative flex rounded-xl border border-[#0B192C]/20 overflow-hidden focus-within:border-[#064E3B] bg-white">
                    <span className="inline-flex items-center px-3 bg-slate-100 text-slate-500 text-xs font-mono font-medium border-r border-[#0B192C]/10">
                      https://
                    </span>
                    <input
                      type="text"
                      required
                      pattern="^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$"
                      placeholder="myshop"
                      value={instantForm.subdomain}
                      onChange={(e) => {
                        setSubdomainEdited(true);
                        setInstantForm({ ...instantForm, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });
                      }}
                      className="flex-1 py-2.5 px-3 text-xs font-mono font-bold text-[#0B192C] focus:outline-none"
                    />
                    <span className="inline-flex items-center px-3 bg-[#FAF9F5] text-[#064E3B] text-xs font-mono font-bold border-l border-[#0B192C]/10">
                      .metaposbd.com
                    </span>
                  </div>

                  {/* Subdomain availability indicator */}
                  <div className="mt-1 text-[11px] font-semibold flex items-center gap-1.5 min-h-[18px]">
                    {subdomainStatus.checking && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> যাচাই করা হচ্ছে...
                      </span>
                    )}
                    {!subdomainStatus.checking && subdomainStatus.available === true && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <strong>{instantForm.subdomain}.metaposbd.com</strong> প্রস্তুত ও ফাঁকা আছে
                      </span>
                    )}
                    {!subdomainStatus.checking && subdomainStatus.available === false && (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {subdomainStatus.error}
                      </span>
                    )}
                  </div>
                </div>

                {/* Login Email */}
                <div>
                  <label className="block font-bold text-[#0B192C] mb-1">
                    আপনার ইমেইল ঠিকানা (লগইন ও পাসওয়ার্ড প্রেরণের জন্য) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                    <input
                      type="email"
                      required
                      placeholder="owner@press.com"
                      value={instantForm.ownerEmail}
                      onChange={(e) => setInstantForm({ ...instantForm, ownerEmail: e.target.value })}
                      className="w-full rounded-xl border border-[#0B192C]/20 py-2.5 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none font-medium"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-[#0B192C]/60 font-medium">
                    এই ইমেইলটি আপনার ডেমো স্টোরের অ্যাডমিন ইউজার হবে এবং পাসওয়ার্ড সাথে সাথে ইমেইল করা হবে।
                  </p>
                </div>

                {/* Owner Name & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0B192C] mb-1">স্বত্বাধিকারী / প্রতিনিধির নাম</label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                      <input
                        type="text"
                        placeholder="যেমন: মো. রফিকুল ইসলাম"
                        value={instantForm.ownerName}
                        onChange={(e) => setInstantForm({ ...instantForm, ownerName: e.target.value })}
                        className="w-full rounded-xl border border-[#0B192C]/20 py-2.5 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0B192C] mb-1">মোবাইল / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                      <input
                        type="tel"
                        placeholder="01700-000000"
                        value={instantForm.ownerPhone}
                        onChange={(e) => setInstantForm({ ...instantForm, ownerPhone: e.target.value })}
                        className="w-full rounded-xl border border-[#0B192C]/20 py-2.5 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>

                {instantError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-[#831843]/30 bg-[#FDF2F8] p-3 text-xs font-semibold text-[#831843]"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{instantError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creating || subdomainStatus.available === false}
                    className="w-full rounded-xl bg-[#064E3B] py-3.5 text-xs font-extrabold text-white shadow-lg shadow-[#064E3B]/25 hover:bg-[#043E2F] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Zap className="h-4 w-4 text-amber-300" />
                    <span>⚡ আমার লাইভ ডেমো স্টোর তৈরি করুন (Instant Setup)</span>
                  </button>
                  <p className="mt-2 text-center text-[10px] text-[#0B192C]/60 flex items-center justify-center gap-1 font-semibold">
                    <Shield className="h-3 w-3 text-[#064E3B]" /> সম্পূর্ণ সুরক্ষিত ক্লাউড ইনস্ট্যান্স • তাৎক্ষণিক প্রবেশাধিকার
                  </p>
                </div>
              </>
            )}
          </form>
        ) : (
          /* Tab 2: Call Booking Form */
          <form onSubmit={handleCallSubmit} className="p-6 space-y-4 text-xs">
            <div className="rounded-lg bg-[#FEF3C7] border border-[#D97706]/30 p-3 text-[#78350F] text-[11px] flex items-center justify-between font-medium">
              <span>নির্বাচিত প্যাকেজ: <strong className="text-[#0B192C]">{initialPlan} Plan</strong></span>
              <span className="font-bold text-[#064E3B]">৭ দিনের ফ্রি ট্রায়াল</span>
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
                    value={callForm.name}
                    onChange={(e) => setCallForm({ ...callForm, name: e.target.value })}
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
                    placeholder="01700-000000"
                    value={callForm.phone}
                    onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1">প্রকাশনী বা প্রতিষ্ঠানের নাম</label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: অনন্যা প্রকাশনী"
                    value={callForm.pressName}
                    onChange={(e) => setCallForm({ ...callForm, pressName: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1">ইমেইল ঠিকানা</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0B192C]/40" />
                  <input
                    type="email"
                    placeholder="example@press.com"
                    value={callForm.email}
                    onChange={(e) => setCallForm({ ...callForm, email: e.target.value })}
                    className="w-full rounded-lg border border-[#0B192C]/20 py-2 pl-8 pr-3 text-xs focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1">প্রতিষ্ঠানের ধরন</label>
                <select
                  value={callForm.pressType}
                  onChange={(e) => setCallForm({ ...callForm, pressType: e.target.value })}
                  className="w-full rounded-lg border border-[#0B192C]/20 p-2 text-xs focus:border-[#064E3B] focus:outline-none bg-white"
                >
                  <option>বাংলাবাজার সৃজনশীল প্রকাশনী</option>
                  <option>বুকস্টোর ও শোরুম (আউটলেট)</option>
                  <option>অনলাইন বুকশপ ও বুক ক্যাফে</option>
                  <option>বিশ্ববিদ্যালয় / একাডেমিক প্রেস</option>
                  <option>একক লেখক / লিটলম্যাগ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1">ক্যাটালগে সক্রিয় বইয়ের সংখ্যা</label>
                <select
                  value={callForm.activeTitles}
                  onChange={(e) => setCallForm({ ...callForm, activeTitles: e.target.value })}
                  className="w-full rounded-lg border border-[#0B192C]/20 p-2 text-xs focus:border-[#064E3B] focus:outline-none bg-white"
                >
                  <option>৫০টির নিচে</option>
                  <option>৫০ - ২০০টি বই</option>
                  <option>২০০ - ১,০০০টি বই</option>
                  <option>১,০০০ - ৫,০০০+ বই</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0B192C] mb-1">বিশেষ কোনো চাহিদা বা বইমেলা স্টল সম্পর্কিত নোট</label>
              <textarea
                rows={2}
                placeholder="যেমন: বইমেলায় কয়টি কাউন্টার লাগবে, থার্মাল প্রিন্টার, ক্যাটালগ ইমপোর্ট..."
                value={callForm.notes}
                onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })}
                className="w-full rounded-lg border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            {callError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#831843]/30 bg-[#FDF2F8] p-2.5 text-[11px] font-semibold text-[#831843]"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{callError}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={callLoading}
                className="w-full rounded-xl bg-[#064E3B] py-3 text-xs font-bold text-white shadow-md shadow-[#064E3B]/20 hover:bg-[#043E2F] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {callLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {callLoading ? 'পাঠানো হচ্ছে…' : 'নিশ্চিত করুন ও ফ্রি ডেমো কল নির্ধারণ করুন'}
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
