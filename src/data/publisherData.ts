export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  badge?: string;
  popular?: boolean;
  trial: string;
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

// MetaPOS book counter features tailored for Bangladeshi publishers and book fair stalls.
// Plans differ by counters, users, catalogue size and the level of setup/support provided.
export const PRICING_PLANS: Plan[] = [
  {
    id: 'nexus',
    name: 'Nexus',
    priceMonthly: 1990,
    priceYearly: 1690,
    description: 'একক শোরুম ও নতুন প্রকাশকদের কাউন্টার বিলিং ও বই বিক্রয়ের জন্য।',
    trial: '7 Days Free Trial',
    specs: {
      users: '৫ জন ইউজার',
      locations: '২ টি কাউন্টার',
      titles: 'সর্বোচ্চ ১,৫০০টি বই',
      support: 'ফোন ও ইমেইল সাপোর্ট',
    },
    features: [
      'স্মার্ট বই অনুসন্ধান: ISBN, বারকোড স্ক্যান এবং লেখক ও প্রকাশকের নামে বই খোঁজা',
      'বইয়ের ক্যাটালগ: লেখক, প্রকাশক, ধরন, সিরিজ ও সংস্করণ অনুযায়ী বই সাজানো',
      'তাৎক্ষণিক স্টক ব্যবস্থাপনা: বই বিক্রিতে স্টক কমবে এবং ফেরতে স্টক বাড়বে',
      'বইমেলা মোড: দ্রুত ও সহজে কাউন্টারে বিক্রয় ও বিল তৈরি',
      'পেমেন্ট ও বিলিং: নগদ ও কার্ড পেমেন্ট, বইভিত্তিক ছাড় এবং রসিদ প্রিন্ট',
      'বিক্রয় ড্যাশবোর্ড: মোট আয়, অর্ডার সংখ্যা ও বিক্রিত বইয়ের হিসাব',
    ],
    ctaText: '৭ দিনের ফ্রি ট্রায়াল শুরু করুন',
    ctaVariant: 'secondary',
  },
  {
    id: 'spark',
    name: 'Spark',
    priceMonthly: 4990,
    priceYearly: 4240,
    description: 'প্রতিষ্ঠিত প্রকাশনী ও বইয়ের শোরুমের বিস্তারিত বিক্রয় ও কর্মী বিশ্লেষণের জন্য।',
    popular: true,
    badge: 'সবচেয়ে জনপ্রিয়',
    trial: '7 Days Free Trial',
    specs: {
      users: '১০ জন ইউজার',
      locations: '৫ টি কাউন্টার',
      titles: 'সর্বোচ্চ ১২,০০০টি বই',
      support: 'প্রায়োরিটি সাপোর্ট',
    },
    features: [
      'Nexus - এর সবকিছু অন্তর্ভুক্ত',
      'কাউন্টারভিত্তিক রিপোর্ট: কাউন্টার অনুযায়ী বিক্রয় প্রতিবেদন ও ফিল্টার',
      'ক্যাশিয়ার পারফরম্যান্স: কর্মীভিত্তিক বিক্রয় বিশ্লেষণ ও সেশনভিত্তিক ক্যাশ মিলানো',
      'বই বিক্রয় বিশ্লেষণ: শীর্ষ বই, লেখক, প্রকাশক ও বইয়ের ধরনভিত্তিক বিশ্লেষণ',
      'সময়ভিত্তিক বিক্রয়: ঘণ্টাভিত্তিক অর্ডার বিশ্লেষণ ও ব্যস্ততম সময় শনাক্তকরণ',
      'রিপোর্ট ও ডেটা এক্সপোর্ট: পিভট টেবিল, গ্রাফ ও Excel-এ রিপোর্ট ডাউনলোড',
    ],
    ctaText: '৭ দিনের ফ্রি ট্রায়াল শুরু করুন',
    ctaVariant: 'primary',
  },
  {
    id: 'rise',
    name: 'Rise',
    priceMonthly: 12500,
    priceYearly: 10625,
    description: 'মাল্টি-কাউন্টার প্রকাশনা সংস্থা, বইমেলার বড় স্টল ও ক্যাটালগ অটোমেশনের জন্য।',
    badge: 'মাল্টি-কাউন্টার এক্সক্লুসিভ',
    trial: '7 Days Free Trial',
    specs: {
      users: '২০ জন ইউজার',
      locations: '১০টি কাউন্টার',
      titles: 'আনলিমিটেড বই',
      support: 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার',
    },
    features: [
      'Spark - এর সবকিছু অন্তর্ভুক্ত',
      'কাউন্টারভিত্তিক ব্যবস্থাপনা: প্রয়োজন অনুযায়ী প্রতিটি কাউন্টারের পূর্ণ হিসাব ও ইনভেন্টরি পরিচালনা',
      'বইয়ের তথ্য আমদানি: বিদ্যমান Excel ফাইল থেকে সম্পূর্ণ বইয়ের ক্যাটালগ ইমপোর্টের সুবিধা',
      'ব্যবহারকারী অনুমতি নিয়ন্ত্রণ: ক্যাশিয়ার ও ম্যানেজারের জন্য পৃথক ভূমিকা ও প্রবেশাধিকার নির্ধারণ',
      'সেটআপ ও প্রশিক্ষণ: বইমেলার আগে কাউন্টার সেটআপ, সফটওয়্যার কনফিগারেশন ও কর্মীদের প্রশিক্ষণ',
    ],
    ctaText: '৭ দিনের ফ্রি ট্রায়াল শুরু করুন',
    ctaVariant: 'secondary',
  },
  {
    id: 'titan',
    name: 'Titan',
    priceMonthly: -1, // Custom
    priceYearly: -1,
    description: 'শীর্ষ জাতীয় প্রকাশনা প্রতিষ্ঠান, বিশ্ববিদ্যালয় প্রেস ও একাধিক কোম্পানির সেন্ট্রাল সিস্টেম।',
    badge: 'কাস্টম এন্টারপ্রাইজ',
    trial: '7 Days Free Trial',
    specs: {
      users: 'প্রয়োজন অনুযায়ী ইউজার',
      locations: 'কাস্টম কাউন্টার নেটওয়ার্ক',
      titles: 'আনলিমিটেড বই ও সংস্করণ',
      support: 'অন-গ্রাউন্ড টেক সাপোর্ট',
    },
    features: [
      'আপনার প্রয়োজন অনুযায়ী কাস্টম রিপোর্ট ও ফিচার',
      'একাধিক প্রতিষ্ঠান (কোম্পানি) এক সিস্টেমে',
      'বইমেলা চলাকালীন অন-গ্রাউন্ড টেক সাপোর্ট',
      'লেখক ও প্রকাশকভিত্তিক কমিশন হিসাব ও ব্যবস্থাপনা',
      'সম্পূর্ণ ই-কমার্স ওয়েবসাইট ও অনলাইন স্টোর পরিচালনা',
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
    category: 'কাউন্টার ও পিওএস বিলিং (POS & Counter Billing)',
    features: [
      { name: 'কাউন্টার সংখ্যা', nexus: '২ টি কাউন্টার', spark: '৫ টি কাউন্টার', rise: '১০টি কাউন্টার', titan: 'কাস্টম' },
      { name: 'ইউজার অ্যাক্সেস', nexus: '৫ জন ইউজার', spark: '১০ জন ইউজার', rise: '২০ জন ইউজার', titan: 'প্রয়োজন অনুযায়ী' },
      { name: 'বইমেলা মোড (দ্রুত ও সহজে কাউন্টারে বিক্রয় ও বিল তৈরি)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'পেমেন্ট ও বিলিং (নগদ ও কার্ড পেমেন্ট, বইভিত্তিক ছাড় ও রসিদ প্রিন্ট)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'কাউন্টারভিত্তিক বিক্রয় প্রতিবেদন ও ফিল্টার', nexus: false, spark: true, rise: true, titan: true },
      { name: 'ক্যাশিয়ার পারফরম্যান্স ও সেশনভিত্তিক ক্যাশ মিলানো', nexus: false, spark: true, rise: true, titan: true },
      { name: 'কাউন্টারভিত্তিক পূর্ণ হিসাব ও ইনভেন্টরি পরিচালনা', nexus: false, spark: false, rise: true, titan: true },
    ],
  },
  {
    category: 'ক্যাটালগ ও ইনভেন্টরি ব্যবস্থাপনা (Catalog & Inventory)',
    features: [
      { name: 'বইয়ের ক্যাটালগ ধারণক্ষমতা', nexus: 'সর্বোচ্চ ১,৫০০টি বই', spark: 'সর্বোচ্চ ১২,০০০টি বই', rise: 'আনলিমিটেড বই', titan: 'আনলিমিটেড বই' },
      { name: 'স্মার্ট বই অনুসন্ধান (ISBN, বারকোড স্ক্যান এবং লেখক/প্রকাশকের নামে খোঁজা)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'বইয়ের ক্যাটালগ (লেখক, প্রকাশক, ধরন, সিরিজ ও সংস্করণ অনুযায়ী সাজানো)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'তাৎক্ষণিক স্টক ব্যবস্থাপনা (বিক্রিতে স্টক কমবে ও ফেরতে বাড়বে)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'Excel ফাইল থেকে সম্পূর্ণ বইয়ের ক্যাটালগ ইমপোর্ট', nexus: false, spark: false, rise: true, titan: true },
      { name: 'লেখক ও প্রকাশকভিত্তিক কমিশন হিসাব ও ব্যবস্থাপনা', nexus: false, spark: false, rise: false, titan: true },
      { name: 'সম্পূর্ণ ই-কমার্স ওয়েবসাইট ও অনলাইন স্টোর পরিচালনা', nexus: false, spark: false, rise: false, titan: true },
    ],
  },
  {
    category: 'রিপোর্টিং, ডেটা অ্যানালিটিক্স ও এক্সপোর্ট (Analytics & Reports)',
    features: [
      { name: 'বিক্রয় ড্যাশবোর্ড (মোট আয়, অর্ডার সংখ্যা ও বিক্রিত বইয়ের হিসাব)', nexus: true, spark: true, rise: true, titan: true },
      { name: 'বই বিক্রয় বিশ্লেষণ (শীর্ষ বই, লেখক, প্রকাশক ও ধরনভিত্তিক)', nexus: false, spark: true, rise: true, titan: true },
      { name: 'সময়ভিত্তিক বিক্রয় (ঘণ্টাভিত্তিক অর্ডার বিশ্লেষণ ও ব্যস্ততম সময়)', nexus: false, spark: true, rise: true, titan: true },
      { name: 'রিপোর্ট ও ডেটা এক্সপোর্ট (পিভট টেবিল, গ্রাফ ও Excel ডাউনলোড)', nexus: false, spark: true, rise: true, titan: true },
      { name: 'আপনার প্রয়োজন অনুযায়ী কাস্টম রিপোর্ট ও ফিচার', nexus: false, spark: false, rise: false, titan: true },
      { name: 'একাধিক প্রতিষ্ঠান (কোম্পানি) এক সিস্টেমে', nexus: false, spark: false, rise: false, titan: true },
    ],
  },
  {
    category: 'অনুমতি, ট্রেনিং ও টেক সাপোর্ট (RBAC, Training & Support)',
    features: [
      { name: 'ফ্রি ট্রায়াল (Free Trial)', nexus: '৭ দিন', spark: '৭ দিন', rise: '৭ দিন', titan: '৭ দিন' },
      { name: 'সাপোর্ট চ্যানেল', nexus: 'ফোন ও ইমেইল', spark: 'প্রায়োরিটি সাপোর্ট', rise: 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার', titan: 'অন-গ্রাউন্ড টেক সাপোর্ট' },
      { name: 'ব্যবহারকারী অনুমতি নিয়ন্ত্রণ (ক্যাশিয়ার ও ম্যানেজারের পৃথক ভূমিকা)', nexus: false, spark: false, rise: true, titan: true },
      { name: 'বইমেলার আগে কাউন্টার সেটআপ ও কর্মীদের প্রশিক্ষণ', nexus: false, spark: false, rise: true, titan: true },
      { name: 'বইমেলা চলাকালীন অন-গ্রাউন্ড টেক সাপোর্ট', nexus: false, spark: false, rise: false, titan: true },
    ],
  },
];
