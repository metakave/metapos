import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  LifeBuoy, 
  CalendarClock, 
  Presentation, 
  ArrowUpRight, 
  Check, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Mail, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface ContactPageProps {
  onOpenSignIn?: () => void;
  onOpenChat?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenSignIn, onOpenChat }) => {
  const [activeFormTab, setActiveFormTab] = useState<'demo' | 'meeting' | 'problem'>('demo');
  const [selectedDate, setSelectedDate] = useState<number>(20); // Nov 20
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pressName: '',
    pressType: 'বাংলাবাজার সৃজনশীল প্রকাশনী',
    meetingFormat: 'গুগল মিট অনলাইন (Google Meet)',
    catalogSize: '৫০ - ৫০০টি বই',
    notes: '',
  });

  const availableDates = [
    { day: 'বুধ', date: 18, available: true },
    { day: 'বৃহঃ', date: 19, available: true },
    { day: 'শুক্র', date: 20, available: true },
    { day: 'শনি', date: 21, available: true },
    { day: 'রবি', date: 22, available: true },
    { day: 'সোম', date: 23, available: true },
  ];

  const availableTimes = [
    '10:30 AM',
    '11:30 AM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM'
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedDate,
          selectedTime,
          formType: activeFormTab,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error || 'ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি কল করুন।');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError('সার্ভারে সংযোগ করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন বা হটলাইনে কল করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FBFBFA]">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-[60px] pt-4 pb-14 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-12 gap-8 lg:gap-14">
          
          {/* LEFT COLUMN: Header, 5 Action Buttons, and Embedded Booking Widget (col-span-12 md:col-span-7) */}
          <div className="col-span-12 md:col-span-7">
            {/* Tag Badge */}
            <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-4">
              যোগাযোগ ও সহায়তা (Get Help)
            </span>

            {/* H1 matching Foodops */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] leading-[1.08] tracking-tight">
              যেভাবেই যোগাযোগ করুন না কেন, <br />
              <span className="font-serif italic font-normal text-[#064E3B]">আমরা সর্বদা</span> আপনার পাশে।
            </h1>

            {/* Subtitle matching Foodops */}
            <p className="mt-5 text-sm sm:text-base text-[#0B192C]/80 leading-relaxed max-w-lg font-medium">
              কল, চ্যাট বা বুকিং — আপনার প্রতিটি অনুরোধ একটি নির্ধারিত ট্র্যাকিং রেফারেন্স সহ দ্রুত সমাধান করা হয়।
            </p>

            {/* 5 Action Cards Grid (Foodops layout) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Call Us */}
              <a
                href="tel:+8801700000000"
                className="text-left border-2 border-[#0B192C]/10 bg-white p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#064E3B] hover:shadow-md active:scale-[0.99] group"
              >
                <div className="h-9 w-9 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-3 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm text-[#0B192C]">সরাসরি কল করুন (Call us)</p>
                <p className="mt-1 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                  হটলাইন +৮৮০ ১৭০০-০০০০০০ — মোবাইলে ট্যাপ করে সরাসরি কল করুন।
                </p>
              </a>

              {/* 2. Chat Now */}
              <button
                onClick={onOpenChat}
                className="text-left border-2 border-[#0B192C]/10 bg-white p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#064E3B] hover:shadow-md active:scale-[0.99] group"
              >
                <div className="h-9 w-9 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-3 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm text-[#0B192C]">চ্যাট করুন (Chat now)</p>
                <p className="mt-1 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                  আমাদের বাংলা সহকারী সহায়িকা থেকে তাৎক্ষণিক উত্তর দেয়।
                </p>
              </button>

              {/* 3. Report a Problem */}
              <button
                onClick={() => {
                  setActiveFormTab('problem');
                  const el = document.getElementById('booking-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left border-2 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] group ${
                  activeFormTab === 'problem' ? 'border-[#831843] bg-[#FAF9F5]' : 'border-[#0B192C]/10 bg-white hover:border-[#831843]'
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-[#FFE4E6] text-[#831843] flex items-center justify-center mb-3 group-hover:bg-[#831843] group-hover:text-white transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm text-[#0B192C]">সমস্যা জানান (Report a problem)</p>
                <p className="mt-1 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                  সংক্ষেপে লিখুন — আমাদের প্রকাশনা সাপোর্ট টিম দ্রুত সমাধান প্রদান করবে।
                </p>
              </button>

              {/* 4. Request a Meeting */}
              <button
                onClick={() => {
                  setActiveFormTab('meeting');
                  const el = document.getElementById('booking-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left border-2 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] group ${
                  activeFormTab === 'meeting' ? 'border-[#064E3B] bg-[#FAF9F5]' : 'border-[#0B192C]/10 bg-white hover:border-[#064E3B]'
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center mb-3 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm text-[#0B192C]">বৈঠকের অনুরোধ (Request a meeting)</p>
                <p className="mt-1 text-xs text-[#0B192C]/70 leading-relaxed font-medium">
                  বাংলাবাজার বা কাওরান বাজার অফিসে সরাসরি সাক্ষাতের সময় নির্ধারণ করুন।
                </p>
              </button>

              {/* 5. Schedule a Demo */}
              <button
                onClick={() => {
                  setActiveFormTab('demo');
                  const el = document.getElementById('booking-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left border-2 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] group sm:col-span-2 ${
                  activeFormTab === 'demo' ? 'border-[#064E3B] bg-[#ECFDF5]/50 ring-1 ring-[#064E3B]' : 'border-[#0B192C]/10 bg-white hover:border-[#064E3B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                    <Presentation className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0B192C]">ফ্রি ডেমো বুক করুন (Schedule a demo)</p>
                    <p className="mt-0.5 text-xs text-[#0B192C]/70 font-medium">
                      আপনার প্রকাশনী ও মেলা স্টলের জন্য MetaPOS-এর একটি পূর্ণাঙ্গ সরাসরি ওয়াকথ্রু।
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Help / Live notice matching Foodops */}
            <div id="booking-section" className="mt-12 scroll-mt-28 border-t border-[#0B192C]/10 pt-8">
              <p className="mb-4 text-xs sm:text-sm text-[#0B192C]/75 font-medium">
                ইতিমধ্যেই মেলা স্টল বা কাউন্টারে লাইভ আছেন এবং জরুরি সহায়তা প্রয়োজন?{' '}
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="underline font-bold text-[#064E3B] hover:text-[#043E2F]"
                >
                  চ্যাট ওপেন করুন
                </button>{' '}
                — এটি তাৎক্ষণিক সমাধান দেবে এবং সাপোর্ট টিকিট তৈরি করবে।
              </p>

              {/* Form Navigation Tabs matching Foodops */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <button
                  onClick={() => { setActiveFormTab('demo'); setSubmitted(false); }}
                  className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all ${
                    activeFormTab === 'demo'
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                      : 'border-[#0B192C]/15 bg-white text-[#0B192C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  ফ্রি ডেমো সিডিউল করুন (Schedule a demo)
                </button>
                <button
                  onClick={() => { setActiveFormTab('meeting'); setSubmitted(false); }}
                  className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all ${
                    activeFormTab === 'meeting'
                      ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-xs'
                      : 'border-[#0B192C]/15 bg-white text-[#0B192C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  মিটিং নির্ধারণ (Request a meeting)
                </button>
                <button
                  onClick={() => { setActiveFormTab('problem'); setSubmitted(false); }}
                  className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all ${
                    activeFormTab === 'problem'
                      ? 'bg-[#831843] text-white border-[#831843] shadow-xs'
                      : 'border-[#0B192C]/15 bg-white text-[#0B192C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  সমস্যা রিপোর্ট (Report a problem)
                </button>
              </div>

              {/* Embedded Booking Box (Foodops Calendar & Booking Embed style) */}
              <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 shadow-sm">
                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0B192C]">
                      {activeFormTab === 'demo' ? 'ডেমো সময় সংরক্ষিত হয়েছে!' : activeFormTab === 'meeting' ? 'মিটিং অনুরোধ গৃহীত হয়েছে!' : 'সাপোর্ট টিকিট তৈরি হয়েছে!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0B192C]/80 max-w-md mx-auto leading-relaxed font-medium">
                      ধন্যবাদ, <strong className="text-[#0B192C]">{formData.name || 'প্রকাশক'}</strong>। আপনার প্রকাশনী <strong className="text-[#0B192C]">{formData.pressName || 'প্রতিষ্ঠান'}</strong>-এর জন্য নির্ধারিত সময়: <strong className="text-[#064E3B]">{selectedDate} নভেম্বর, {selectedTime} (বাংলাদেশ সময়)</strong>। আমাদের প্রতিনিধি আপনার মোবাইল <span className="text-[#064E3B] font-bold">{formData.phone}</span>-এ কনফার্মেশন লিংক পাঠাচ্ছেন।
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#043E2F]"
                      >
                        নতুন সময়সূচী দেখুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Date & Time Picker */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wide flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#064E3B]" />
                          <span>তারিখ নির্বাচন করুন (নভেম্বর ২০২৬)</span>
                        </label>
                        <span className="text-[11px] font-bold text-[#064E3B]">বাংলাদেশ সময় (GMT+6)</span>
                      </div>

                      {/* Date Pills */}
                      <div className="grid grid-cols-6 gap-2">
                        {availableDates.map((item) => {
                          const isSelected = selectedDate === item.date;
                          return (
                            <button
                              type="button"
                              key={item.date}
                              onClick={() => setSelectedDate(item.date)}
                              className={`py-2 px-1 rounded-xl text-center border transition-all ${
                                isSelected
                                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                                  : 'bg-[#FAF9F5] border-[#0B192C]/10 text-[#0B192C] hover:bg-[#F4F4F0]'
                              }`}
                            >
                              <span className="block text-[10px] opacity-80">{item.day}</span>
                              <span className="text-sm font-bold">{item.date}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Clock className="h-3.5 w-3.5 text-[#064E3B]" />
                        <span>উপযুক্ত সময় নির্বাচন করুন</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                        {availableTimes.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              type="button"
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 rounded-lg border text-center font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#0B192C] text-white border-[#0B192C]'
                                  : 'bg-[#FAF9F5] border-[#0B192C]/10 text-[#0B192C] hover:bg-slate-200'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact & Publisher Details */}
                    <div className="pt-2 border-t border-[#0B192C]/10 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">আপনার নাম *</label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: মো. রফিকুল ইসলাম"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">মোবাইল / হোয়াটসঅ্যাপ নম্বর *</label>
                          <input
                            type="tel"
                            required
                            placeholder="017xxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">প্রকাশনী বা শোরুমের নাম *</label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: বাতিঘর / নবযুগ প্রকাশনী"
                            value={formData.pressName}
                            onChange={(e) => setFormData({ ...formData, pressName: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">ইমেইল ঠিকানা</label>
                          <input
                            type="email"
                            placeholder="example@press.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">সাক্ষাতের মাধ্যম</label>
                          <select
                            value={formData.meetingFormat}
                            onChange={(e) => setFormData({ ...formData, meetingFormat: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none bg-white font-medium"
                          >
                            <option>গুগল মিট অনলাইন (Google Meet)</option>
                            <option>বাংলাবাজার প্রধান অফিসে সরাসরি</option>
                            <option>কাওরান বাজার টেকনোলজি অফিসে</option>
                            <option>ফোনে সরাসরি বিস্তারিত আলোচনা</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0B192C] mb-1">বইয়ের ক্যাটালগ সাইজ</label>
                          <select
                            value={formData.catalogSize}
                            onChange={(e) => setFormData({ ...formData, catalogSize: e.target.value })}
                            className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none bg-white font-medium"
                          >
                            <option>১ - ৫০টি বই</option>
                            <option>৫০ - ৫০০টি বই</option>
                            <option>৫০০ - ৫,০০০টি বই</option>
                            <option>৫,০০০+ বই (আনলিমিটেড)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B192C] mb-1">বিশেষ কোনো আগ্রহ বা বইমেলা সংক্রান্ত নোট</label>
                        <textarea
                          rows={2}
                          placeholder="যেমন: বইমেলার অফলাইন টার্মিনাল সেটআপ, লেখক রয়্যালটি মডিউল বা কুরিয়ার ইন্টিগ্রেশন..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full rounded-xl border border-[#0B192C]/20 p-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#043E2F] shadow-md shadow-[#064E3B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>ইমেইল পাঠানো হচ্ছে...</span>
                        </div>
                      ) : (
                        <>
                          <span>{activeFormTab === 'demo' ? 'ডেমো সময় নিশ্চিত করুন' : activeFormTab === 'meeting' ? 'মিটিং কনফার্ম করুন' : 'টিকিট সাবমিট করুন'}</span>
                          <span className="text-amber-300 font-normal">({selectedDate} নভেম্বর, {selectedTime})</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer note matching Foodops */}
                <p className="mt-4 text-xs text-[#0B192C]/60 font-medium">
                  সময়সূচী বাংলাদেশ সময় (GMT+6) অনুযায়ী নির্ধারিত।{' '}
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-[#064E3B] font-bold"
                  >
                    সরাসরি হোয়াটসঅ্যাপে কথা বলতে ক্লিক করুন
                  </a>{' '}
                  যদি কোনো সমস্যা হয়।
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Tablet / Visual photo card & customer login link matching Foodops (col-span-12 md:col-span-5 md:col-start-8) */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 space-y-8">
            {/* Visual Touchscreen POS Card on Tablet */}
            <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-2xl bg-[#0B192C] border-2 border-[#0B192C]/10 relative shadow-xl p-6 flex flex-col justify-between text-white">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#064E3B]/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#831843]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-[#064E3B] flex items-center justify-center text-xs font-bold">MP</div>
                    <span className="text-xs font-bold">MetaPOS Counter Live</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                    মেলা মোড সচল
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
                    বইমেলার প্রতিটি মুহূর্তকে লাভজনক করুন
                  </p>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    হাতে ট্যাবলেট বা ফোনে যেকোনো কর্মীর হাতে সম্পূর্ণ ক্যাশ কাউন্টার।
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    অফলাইনে বিলিং, কিউআর স্ক্যানে পেমেন্ট এবং ২ সেকেন্ডে ক্যাশ মেমো প্রিন্ট।
                  </p>
                </div>
              </div>

              {/* Tablet screen preview mockup inside */}
              <div className="relative z-10 rounded-xl bg-slate-900/90 border border-slate-700 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>স্টল প্যাভিলিয়ন #১২</span>
                  <span className="text-emerald-400 font-bold">দৈনিক সেলস: ৳৮২,৪০০</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-800 text-[11px]">
                  <span className="font-bold text-white">চিলেকোঠার সেপাই (হার্ডবাউন্ড)</span>
                  <span className="font-bold text-amber-300">৳৪১২ (২৫% ছাড়)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-800 text-[11px]">
                  <span className="font-bold text-white">নকশী কাঁথার মাঠ</span>
                  <span className="font-bold text-emerald-300">৳২৪০ (২৫% ছাড়)</span>
                </div>
              </div>
            </div>

            {/* Already a customer block matching Foodops */}
            <div className="rounded-2xl border-2 border-[#0B192C]/10 bg-white p-6 shadow-xs space-y-4">
              <div>
                <span className="block text-xs tracking-[0.2em] uppercase font-bold text-[#831843] mb-1">
                  ইতিমধ্যেই MetaPOS ব্যবহার করছেন? (Already a customer?)
                </span>
                <p className="text-xs sm:text-sm text-[#0B192C]/80 font-medium">
                  আপনার কাউন্টার অর্ডার, বইমেলা স্টক ও লেখক রয়্যালটি খাতা পরিচালনা করতে লগইন করুন।
                </p>
              </div>

              <div>
                <button
                  onClick={onOpenSignIn}
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#064E3B] hover:text-[#043E2F]"
                >
                  <span>কাউন্টার পোর্টালে লগইন করুন (Login)</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <div className="pt-3 border-t border-[#0B192C]/10 text-xs text-[#0B192C]/70 space-y-1 font-medium">
                <p>MetaPOS Technologies BD দ্বারা পরিচালিত।</p>
                <p>সরাসরি প্রকাশনা হেল্পলাইন: <strong>+৮৮০ ১৭০০-০০০০০০</strong></p>
                <p>বাংলাবাজার শাখা: <strong>১৬/এ নর্থব্রুক হল রোড, ঢাকা</strong></p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
