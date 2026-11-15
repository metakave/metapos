export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  specs: {
    users: string;
    locations: string;
    titles: string;
    support: string;
  };
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
}

export const PRICING_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 1999,
    priceYearly: 1699,
    description: 'উদীয়মান প্রকাশনা সংস্থা ও বাংলাবাজারের একক বইয়ের দোকানের জন্য।',
    badge: 'বইমেলা ফেভারিট',
    specs: {
      users: '৩ জন ইউজার',
      locations: '১টি কাউন্টার + মেলা স্টল',
      titles: 'সর্বোচ্চ ১,০০০টি বই',
      support: 'ফোন ও ইমেইল সাপোর্ট',
    },
    features: [
      'অফলাইন-ফার্স্ট পিওএস বিলিং ও ইনভেন্টরি',
      'MetaPOS Go (অমর একুশে বইমেলা ও ভ্রাম্যমাণ স্টল অ্যাপ)',
      'বারকোড ও ISBN-13 দ্রুত স্ক্যানার সাপোর্ট',
      'লেখক রয়্যালটি ক্যালকুলেটর (বেসিক)',
      'বিকাশ ও নগদ ডায়নামিক QR পেমেন্ট',
      'এসএমএস ইনভয়েস ও মেমো প্রিন্ট',
    ],
    ctaText: '৩০ দিনের ফ্রি ট্রায়াল',
    ctaVariant: 'secondary',
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 4999,
    priceYearly: 4249,
    description: 'প্রতিষ্ঠিত প্রকাশনী ও চেইন শপের জন্য যাদের নিয়মিত আউটলেট ও বইমেলার স্টল রয়েছে।',
    popular: true,
    badge: 'সবচেয়ে জনপ্রিয়',
    specs: {
      users: '২০ জন ইউজার',
      locations: '৩টি কাউন্টার · মেলা স্টল',
      titles: 'সর্বোচ্চ ১০,০০০টি বই',
      support: '২৪/৭ প্রায়োরিটি বাংলা সাপোর্ট',
    },
    features: [
      'Starter-এর সবকিছু অন্তর্ভুক্ত',
      'ডিরেক্ট অনলাইন বুকস্টোর ও প্রি-অর্ডার সাইট',
      'অটোমেটেড লেখক রয়্যালটি স্টেটমেন্ট (PDF)',
      'Steadfast, Pathao ও RedX কুরিয়ার এপিআই ইন্টিগ্রেশন',
      'লাইব্রেরি ও এজেন্টদের জন্য পাইকারি ডিসকাউন্ট স্ল্যাব',
      'বাংলাবাজার ও নীলক্ষেত কমিশন ট্র্যাকিং',
    ],
    ctaText: '৩০ দিনের ফ্রি ট্রায়াল',
    ctaVariant: 'primary',
  },
  {
    id: 'scale',
    name: 'Scale',
    priceMonthly: 14999,
    priceYearly: 12749,
    description: 'বৃহৎ প্রকাশনা সংস্থা, একাধিক প্রেস ও নিজস্ব ওয়্যারহাউজ নেটওয়ার্কের জন্য।',
    badge: 'সম্পূর্ণ অটোমেশন',
    specs: {
      users: '৫০ জন ইউজার',
      locations: '১০টি কাউন্টার · ৫টি ওয়্যারহাউজ',
      titles: 'আনলিমিটেড বই ও সংস্করণ',
      support: 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার',
    },
    features: [
      'Growth-এর সবকিছু অন্তর্ভুক্ত',
      'রকমারি ও ডিস্ট্রিবিউটর চালান রিকনসিলিয়েশন',
      'জাতীয় গ্রন্থকেন্দ্র ও সরকারি ক্রয়ের চালান জেনারেটর',
      'প্রিন্ট রান কস্টিং ও পেপার স্টক ট্র্যাকিং',
      'কাস্টম ডোমেইন সহ নিজস্ব ব্র্যান্ডেড পোর্টাল',
      'মাল্টি-ওয়্যারহাউজ পিক ও প্যাক কিউ',
    ],
    ctaText: 'ডেমো বুক করুন',
    ctaVariant: 'secondary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: -1, // Custom
    priceYearly: -1,
    description: 'শীর্ষ জাতীয় প্রকাশনা প্রতিষ্ঠান, বিশ্ববিদ্যালয় প্রেস ও সরকারি প্রকাশনা সংস্থার জন্য।',
    badge: 'কাস্টম সল্যুশন',
    specs: {
      users: 'আনলিমিটেড ইউজার',
      locations: 'আনলিমিটেড কাউন্টার ও ওয়্যারহাউজ',
      titles: 'আনলিমিটেড ক্যাটালগ ও জার্নাল',
      support: 'অন-সাইট ট্রেনিং ও ডেডিকেটেড এসএলএ',
    },
    features: [
      'Scale-এর সবকিছু অন্তর্ভুক্ত',
      'কাস্টম ইআরপি ও ট্যালি / অ্যাকাউন্টিং ইন্টিগ্রেশন',
      'আন্তর্জাতিক স্বত্ব ও অনুবাদ লাইসেন্সিং মডিউল',
      'অন-প্রিমাইস অথবা বিডির নিজস্ব ক্লাউড হোস্টিং',
      'মেলায় অতিরিক্ত ১০+ পোর্টেবল পিওএস টার্মিনাল সেটআপ',
      'ডেডিকেটেড অন-গ্রাউন্ড বইমেলা টেক সাপোর্ট',
    ],
    ctaText: 'এন্টারপ্রাইজ সেলসে কথা বলুন',
    ctaVariant: 'outline',
  },
];

export const TRUSTED_PUBLISHERS = [
  { name: 'বাতিঘর (Batighar)', type: 'বুক ক্যাফে ও প্রকাশনা', city: 'ঢাকা ও চট্টগ্রাম' },
  { name: 'প্রথমা প্রকাশন (Prothoma)', type: 'জাতীয় প্রকাশনা সংস্থা', city: 'কারওয়ান বাজার, ঢাকা' },
  { name: 'অন্যপ্রকাশ (Anyaprokash)', type: 'কথাসাহিত্য ও সৃজনশীল', city: 'বাংলাবাজার, ঢাকা' },
  { name: 'পাঠক সমাবেশ (Pathak Samabesh)', type: 'বুকস্টোর ও প্রকাশনী', city: 'শাহবাগ, ঢাকা' },
  { name: 'বেঙ্গল পাবলিকেশন্স (Bengal)', type: 'শিল্প ও সাহিত্য প্রকাশনা', city: 'ধানমন্ডি, ঢাকা' },
  { name: 'তাম্রলিপি (Tamralipi)', type: 'শিশুতোষ ও অনুবাদ সাহিত্য', city: 'বাংলাবাজার, ঢাকা' },
  { name: 'অ্যাডর্ন পাবলিকেশন (Adorn)', type: 'একাডেমিক ও গবেষণামূলক', city: 'ঢাকা' },
  { name: 'কাকলী প্রকাশনী (Kakoli)', type: 'ঐতিহ্যবাহী সাহিত্য প্রকাশনী', city: 'বাংলাবাজার, ঢাকা' },
];

export const ALL_FEATURES_COMPARISON = [
  {
    category: 'বুকস্টোর ও বইমেলা পিওএস (Bookstore & Fair POS)',
    features: [
      { name: 'অফলাইন-ফার্স্ট বিলিং ইঞ্জিন (ইন্টারনেট ছাড়াও ১০০% বিক্রয় সচল)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'বারকোড ও ISBN-13 দ্রুত স্ক্যানার সাপোর্ট', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'ক্যাশ, কার্ড ও বিকাশ/নগদ/রকেট স্প্লিট পেমেন্ট', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'MetaPOS Go (বইমেলা ও মোবাইল দিয়ে দ্রুত বিলিং অ্যাপ)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'থার্মাল পিওএস রিসিট ও বাংলা মেমো প্রিন্টিং (Bluetooth/USB)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'গ্রাহকদের জন্য বাংলা এসএমএস ই-মেমো ও ভ্যাট চালান', starter: true, growth: true, scale: true, enterprise: true },
    ],
  },
  {
    category: 'প্রকাশনা ও ক্যাটালগ ব্যবস্থাপনা (Catalog & Print Runs)',
    features: [
      { name: 'বই, ISBN, বাঁধাই সংস্করণ (হার্ডকভার, পেপারব্যাক, ই-বুক)', starter: '১,০০০টি', growth: '১০,০০০টি', scale: 'আনলিমিটেড', enterprise: 'আনলিমিটেড' },
      { name: 'জাতীয় গ্রন্থকেন্দ্র ও বিশ্বমানের ক্যাটাগরাইজেশন', starter: 'ম্যানুয়াল', growth: 'এআই সহায়ক', scale: 'স্বয়ংক্রিয়', enterprise: 'কাস্টম' },
      { name: 'প্রিন্ট রান, ফর্মা ও প্রেস খরচ ট্র্যাকিং', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'কাগজ (৭৫ গ্রাম অফসেট, নিউজপ্রিন্ট) ও প্লেট খরচ হিসাব', starter: false, growth: true, scale: true, enterprise: true },
    ],
  },
  {
    category: 'লেখক রয়্যালটি ও আর্থিক হিসাব (Royalties & Accounts)',
    features: [
      { name: 'স্বয়ংক্রিয় লেখক রয়্যালটি হিসাব ইঞ্জিন', starter: 'বেসিক', growth: 'টায়ার্ড রয়্যালটি', scale: 'অ্যাডভান্সড', enterprise: 'কাস্টম চুক্তি' },
      { name: 'লেখকের অগ্রিম সম্মানী (Advance) সমন্বয় ট্র্যাকিং', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'এক ক্লিকে লেখকের নামে বাংলা PDF রয়্যালটি স্টেটমেন্ট', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'বাংলাবাজার কমিশন ও ডিস্ট্রিবিউটর বাকি (Due) খাতা', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'রকমারি ও অন্যান্য অনলাইন সেলার রিকনসিলিয়েশন', starter: false, growth: false, scale: true, enterprise: true },
    ],
  },
  {
    category: 'অনলাইন অর্ডার ও কুরিয়ার বিতরণ (Delivery & D2C)',
    features: [
      { name: 'প্রকাশনীর নিজস্ব অনলাইন বুকশপ ও প্রি-অর্ডার পেজ', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'Steadfast, Pathao ও RedX অটোমেটেড পার্সেল বুকিং', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'ক্যাশ অন ডেলিভারি (COD) টাকা সংগ্রহ ট্র্যাকিং', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'লাইব্রেরি ও পাইকারি গ্রাহক ক্রয়াদেশ পোর্টাল', starter: false, growth: true, scale: true, enterprise: true },
    ],
  },
];
