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

// Every feature listed here exists in the MetaPOS book counter today
// (Odoo 19 Point of Sale + Book Fair POS + Book Fair Stock). Plans differ by
// counters, users, catalogue size and the level of setup/support we provide.
export const PRICING_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 1999,
    priceYearly: 1699,
    description: 'একটি স্টল বা একটি দোকান — বইমেলায় প্রথমবার ডিজিটাল কাউন্টার চালাতে চাওয়া প্রকাশনীর জন্য।',
    badge: 'বইমেলা ফেভারিট',
    specs: {
      users: '৩ জন ইউজার',
      locations: '১টি কাউন্টার',
      titles: 'সর্বোচ্চ ১,০০০টি বই',
      support: 'ফোন ও ইমেইল সাপোর্ট',
    },
    features: [
      'ISBN বারকোড স্ক্যান করে বিক্রি, লেখক-প্রকাশক দিয়ে খোঁজা',
      'বই ক্যাটালগ: লেখক, প্রকাশক, ধরন, সিরিজ, সংস্করণ',
      'বইপ্রতি স্টক অন হ্যান্ড — বিক্রিতে কমে, ফেরতে বাড়ে',
      'বইমেলা মোড: জটিল হিসাব-নিকাশ ছাড়াই সহজ কাউন্টার',
      'ক্যাশ ও কার্ড পেমেন্ট, লাইনভিত্তিক ছাড়, রিসিট প্রিন্ট',
      'বিক্রয় ড্যাশবোর্ড: আয়, অর্ডার, বিক্রিত কপি',
    ],
    ctaText: '৩০ দিনের ফ্রি ট্রায়াল',
    ctaVariant: 'secondary',
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 4999,
    priceYearly: 4249,
    description: 'একাধিক কাউন্টার ও ক্যাশিয়ার নিয়ে বইমেলার প্যাভিলিয়ন বা নিয়মিত শোরুম চালানো প্রকাশনীর জন্য।',
    popular: true,
    badge: 'সবচেয়ে জনপ্রিয়',
    specs: {
      users: '২০ জন ইউজার',
      locations: '৩টি কাউন্টার',
      titles: 'সর্বোচ্চ ১০,০০০টি বই',
      support: 'প্রায়োরিটি বাংলা সাপোর্ট',
    },
    features: [
      'Starter-এর সবকিছু অন্তর্ভুক্ত',
      'কাউন্টারভিত্তিক বিক্রয় রিপোর্ট ও ফিল্টার',
      'ক্যাশিয়ার পারফরম্যান্স ও সেশনভিত্তিক ক্যাশ মিলানো',
      'শীর্ষ বই, লেখক, প্রকাশক ও ধরনভিত্তিক বিশ্লেষণ',
      'ঘণ্টাপ্রতি অর্ডার — ব্যস্ততম সময় চিহ্নিত করা',
      'বই বিক্রয় বিশ্লেষণ (পিভট/গ্রাফ) ও Excel এক্সপোর্ট',
    ],
    ctaText: '৩০ দিনের ফ্রি ট্রায়াল',
    ctaVariant: 'primary',
  },
  {
    id: 'scale',
    name: 'Scale',
    priceMonthly: 14999,
    priceYearly: 12749,
    description: 'অনেক শাখা বা বড় প্যাভিলিয়ন এবং পূর্ণাঙ্গ হিসাব রাখতে চাওয়া বড় প্রকাশনা সংস্থার জন্য।',
    badge: 'সম্পূর্ণ সেটআপ',
    specs: {
      users: '৫০ জন ইউজার',
      locations: '১০টি কাউন্টার',
      titles: 'আনলিমিটেড বই',
      support: 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার',
    },
    features: [
      'Growth-এর সবকিছু অন্তর্ভুক্ত',
      'প্রয়োজনে কাউন্টারপ্রতি পূর্ণ হিসাব ও ইনভেন্টরি চালু',
      'বিদ্যমান এক্সেল থেকে পুরো বই ক্যাটালগ ইমপোর্ট সহায়তা',
      'ব্যবহারকারীর ভূমিকা: ক্যাশিয়ার ও ম্যানেজার আলাদা অনুমতি',
      'বইমেলার আগে কাউন্টার সেটআপ ও কর্মী প্রশিক্ষণ',
    ],
    ctaText: 'ডেমো বুক করুন',
    ctaVariant: 'secondary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: -1, // Custom
    priceYearly: -1,
    description: 'শীর্ষ জাতীয় প্রকাশনা প্রতিষ্ঠান, বিশ্ববিদ্যালয় প্রেস ও বড় বুকস্টোর চেইনের জন্য।',
    badge: 'কাস্টম সল্যুশন',
    specs: {
      users: 'আনলিমিটেড ইউজার',
      locations: 'আনলিমিটেড কাউন্টার',
      titles: 'আনলিমিটেড বই',
      support: 'অন-সাইট ট্রেনিং ও ডেডিকেটেড এসএলএ',
    },
    features: [
      'Scale-এর সবকিছু অন্তর্ভুক্ত',
      'নিজস্ব সার্ভার (অন-প্রিমাইস) অথবা ক্লাউড হোস্টিং',
      'আপনার প্রয়োজন অনুযায়ী কাস্টম রিপোর্ট ও ফিচার',
      'বইমেলা চলাকালীন অন-গ্রাউন্ড টেক সাপোর্ট',
      'একাধিক প্রতিষ্ঠান (কোম্পানি) এক সিস্টেমে',
    ],
    ctaText: 'এন্টারপ্রাইজ সেলসে কথা বলুন',
    ctaVariant: 'outline',
  },
];

export const TRUSTED_PUBLISHERS = [
  { name: 'বাতিঘর (Batighar)', type: 'বুক ক্যাফে ও প্রকাশনা', city: 'ঢাকা ও চট্টগ্রাম' },
  { name: 'প্রথমা প্রকাশন (Prothoma)', type: 'জাতীয় প্রকাশনা সংস্থা', city: 'কারওয়ান বাজার, ঢাকা' },
  { name: 'অন্যপ্রকাশ (Anyaprokash)', type: 'কথাসাহিত্য ও সৃজনশীল', city: 'বাংলাবাজার, ঢাকা' },
  { name: 'পাঠক সমাবেশ (Pathak Samabesh)', type: 'বুকস্টোর ও প্রকাশনী', city: 'শাহবাগ, ঢাকা' },
  { name: 'বেঙ্গল পাবলিকেশন্স (Bengal)', type: 'শিল্প ও সাহিত্য প্রকাশনা', city: 'ধানমন্ডি, ঢাকা' },
  { name: 'তাম্রলিপি (Tamralipi)', type: 'শিশুতোষ ও অনুবাদ সাহিত্য', city: 'বাংলাবাজার, ঢাকা' },
  { name: 'অ্যাডর্ন পাবলিকেশন (Adorn)', type: 'একাডেমিক ও গবেষণামূলক', city: 'ঢাকা' },
  { name: 'কাকলী প্রকাশনী (Kakoli)', type: 'ঐতিহ্যবাহী সাহিত্য প্রকাশনী', city: 'বাংলাবাজার, ঢাকা' },
];

export const ALL_FEATURES_COMPARISON = [
  {
    category: 'বই কাউন্টার (Book Counter)',
    features: [
      { name: 'ISBN-13 বারকোড স্ক্যান — বইয়ের পেছনের বারকোডই পণ্যের বারকোড', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'শিরোনাম, লেখক, প্রকাশক, ধরন, সিরিজ বা ISBN দিয়ে বই খোঁজা', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'বইয়ের কার্ড, অর্ডার লাইন ও রিসিটে লেখকের নাম', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'ক্যাশ ও কার্ড; একাধিক পদ্ধতিতে ভাগ করে পরিশোধ', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'লাইনভিত্তিক ছাড় (%) ও বই ফেরত (রিফান্ড)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'কাউন্টার সংখ্যা', starter: '১টি', growth: '৩টি', scale: '১০টি', enterprise: 'আনলিমিটেড' },
    ],
  },
  {
    category: 'বই ক্যাটালগ ও স্টক (Catalogue & Stock)',
    features: [
      { name: 'বইয়ের তথ্য: লেখক (একাধিক), প্রকাশক, ধরন, সিরিজ, সংস্করণ, ভাষা, ফরম্যাট, পৃষ্ঠা, প্রকাশকাল', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'ISBN-10/13 যাচাই, ISBN-10 থেকে ISBN-13 রূপান্তর, ডুপ্লিকেট ISBN প্রতিরোধ', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'এক ক্লিকে ISBN থেকে বইয়ের তথ্য ও প্রচ্ছদ আনা (Open Library)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'বইপ্রতি স্টক অন হ্যান্ড; গণনার তালিকা ও পরিবর্তনের লগ', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'ক্যাটালগে বইয়ের সংখ্যা', starter: '১,০০০টি', growth: '১০,০০০টি', scale: 'আনলিমিটেড', enterprise: 'আনলিমিটেড' },
    ],
  },
  {
    category: 'ড্যাশবোর্ড ও রিপোর্ট (Dashboard & Reports)',
    features: [
      { name: 'আয়, অর্ডার, বিক্রিত কপি, গড় বাস্কেট — আগের সময়ের সাথে তুলনা', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'দৈনিক আয় ও ঘণ্টাপ্রতি অর্ডার (ব্যস্ততম সময়)', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'শীর্ষ বই, লেখক, প্রকাশক ও ধরনভিত্তিক আয়', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'ক্যাশিয়ার পারফরম্যান্স ও সেশনভিত্তিক ক্যাশ পার্থক্য', starter: false, growth: true, scale: true, enterprise: true },
      { name: 'বই বিক্রয় বিশ্লেষণ (পিভট/গ্রাফ) ও Excel এক্সপোর্ট', starter: false, growth: true, scale: true, enterprise: true },
    ],
  },
  {
    category: 'সেটআপ, হিসাব ও সাপোর্ট (Setup & Support)',
    features: [
      { name: 'বইমেলা মোড: স্টক মুভ, জার্নাল এন্ট্রি ও ইনভয়েস ছাড়াই সহজ কাউন্টার', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'সম্পূর্ণ বাংলা ইন্টারফেস', starter: true, growth: true, scale: true, enterprise: true },
      { name: 'কাউন্টারপ্রতি পূর্ণ হিসাব ও ইনভেন্টরি চালুর সুবিধা', starter: false, growth: false, scale: true, enterprise: true },
      { name: 'এক্সেল থেকে ক্যাটালগ ইমপোর্ট ও কর্মী প্রশিক্ষণ', starter: false, growth: false, scale: true, enterprise: true },
      { name: 'অন-প্রিমাইস হোস্টিং ও অন-গ্রাউন্ড বইমেলা সাপোর্ট', starter: false, growth: false, scale: false, enterprise: true },
    ],
  },
];
