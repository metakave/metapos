import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtppro.zoho.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const SMTP_USER = process.env.SMTP_USER || 'info@metamorphosis.com.bd';
const SMTP_PASS = process.env.SMTP_PASS || 'yF#3vcpp';
const MAIL_TO = process.env.MAIL_TO || 'sales@metamorphosis.com.bd';
const MAIL_CC = (process.env.MAIL_CC || 'info@metamorphosis.com.bd,marketing@metamorphosis.com.bd')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('[SMTP] Connection verification failed:', error.message);
  } else {
    console.log('[SMTP] Ready to send emails via', SMTP_HOST, 'as', SMTP_USER);
  }
});

export interface NotificationEmailPayload {
  formType: 'demo' | 'meeting' | 'problem' | 'contact' | string;
  name: string;
  phone?: string | null;
  email?: string | null;
  pressName?: string | null;
  pressType?: string | null;
  plan?: string | null;
  meetingFormat?: string | null;
  selectedDate?: string | null;
  selectedTime?: string | null;
  catalogSize?: string | null;
  notes?: string | null;
  ip?: string;
}

export async function sendNotificationEmail(data: NotificationEmailPayload): Promise<boolean> {
  const typeLabels: Record<string, string> = {
    demo: 'ফ্রি ডেমো বুকিং (Schedule a Demo)',
    meeting: 'মিটিং নির্ধারণের অনুরোধ (Request a Meeting)',
    problem: 'সমস্যা রিপোর্ট / সাপোর্ট টিকিট (Report a Problem)',
    contact: 'যোগাযোগ ফর্ম (Contact Inquiry)',
  };

  const formTitle = typeLabels[data.formType] || 'নতুন অনুসন্ধান (New Lead)';
  const subject = `[MetaPOS] ${formTitle} - ${data.pressName || data.name}`;

  const textContent = `
MetaPOS ওয়েবসাইট থেকে নতুন বার্তা:
----------------------------------------
ফর্ম ক্যাটাগরি: ${formTitle}
নাম: ${data.name}
মোবাইল / WhatsApp: ${data.phone || 'দেওয়া হয়নি'}
ইমেইল: ${data.email || 'দেওয়া হয়নি'}
প্রকাশনী / প্রতিষ্ঠান: ${data.pressName || 'দেওয়া হয়নি'}
প্রতিষ্ঠান ধরন: ${data.pressType || 'দেওয়া হয়নি'}
প্যাকেজ / প্ল্যান: ${data.plan || 'N/A'}
সাক্ষাতের মাধ্যম: ${data.meetingFormat || 'N/A'}
পছন্দের তারিখ ও সময়: ${data.selectedDate ? `${data.selectedDate} ${data.selectedTime || ''}` : 'N/A'}
বইয়ের ক্যাটালগ সাইজ: ${data.catalogSize || 'N/A'}

নোট / বিবরণ:
${data.notes || 'কোনো অতিরিক্ত নোট নেই।'}
----------------------------------------
IP: ${data.ip || 'Unknown'}
সময়: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (বাংলাদেশ সময়)
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #0B192C; padding: 24px; color: #ffffff; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .tag { display: inline-block; background: #064E3B; color: #6EE7B7; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .content { padding: 28px; }
    .field-row { display: flex; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .label { width: 180px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .value { flex: 1; font-size: 14px; font-weight: 600; color: #0B192C; }
    .highlight { color: #064E3B; font-weight: 700; }
    .notes-box { margin-top: 18px; padding: 16px; background: #FAF9F5; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.6; color: #334155; }
    .footer { padding: 16px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>MetaPOS — ${formTitle}</h2>
      <span class="tag">নতুন লিড ও যোগাযোগ</span>
    </div>
    <div class="content">
      <div class="field-row">
        <span class="label">নাম</span>
        <span class="value">${data.name}</span>
      </div>
      <div class="field-row">
        <span class="label">মোবাইল / WhatsApp</span>
        <span class="value highlight">${data.phone || 'N/A'}</span>
      </div>
      <div class="field-row">
        <span class="label">ইমেইল</span>
        <span class="value">${data.email || 'N/A'}</span>
      </div>
      <div class="field-row">
        <span class="label">প্রকাশনী / প্রতিষ্ঠান</span>
        <span class="value highlight">${data.pressName || 'N/A'}</span>
      </div>
      ${data.pressType ? `
      <div class="field-row">
        <span class="label">ক্যাটাগরি</span>
        <span class="value">${data.pressType}</span>
      </div>` : ''}
      ${data.plan ? `
      <div class="field-row">
        <span class="label">নির্বাচিত প্যাকেজ</span>
        <span class="value highlight">${data.plan}</span>
      </div>` : ''}
      ${data.meetingFormat ? `
      <div class="field-row">
        <span class="label">সাক্ষাতের মাধ্যম</span>
        <span class="value">${data.meetingFormat}</span>
      </div>` : ''}
      ${data.selectedDate ? `
      <div class="field-row">
        <span class="label">তারিখ ও সময়</span>
        <span class="value highlight">${data.selectedDate} ${data.selectedTime || ''} (বাংলাদেশ সময়)</span>
      </div>` : ''}
      ${data.catalogSize ? `
      <div class="field-row">
        <span class="label">ক্যাটালগ সাইজ</span>
        <span class="value">${data.catalogSize}</span>
      </div>` : ''}

      <div style="margin-top: 20px;">
        <span class="label" style="display:block; margin-bottom: 6px;">মন্তব্য / বিশেষ নোট:</span>
        <div class="notes-box">${(data.notes || 'কোনো অতিরিক্ত নোট দেওয়া হয়নি।').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      MetaPOS Bangladesh • Client IP: ${data.ip || 'Unknown'} • ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (BST)
    </div>
  </div>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"MetaPOS Contact" <${SMTP_USER}>`,
      to: MAIL_TO,
      cc: MAIL_CC,
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: data.email || undefined,
    });
    console.log('[SMTP] Email sent successfully:', info.messageId, 'to:', MAIL_TO);
    return true;
  } catch (err) {
    console.error('[SMTP] Error sending email:', err);
    return false;
  }
}

export interface DemoStoreEmailPayload {
  shopName: string;
  subdomain: string;
  storeUrl: string;
  ownerName?: string;
  ownerEmail: string;
  ownerPassword: string;
  adminLogin?: string;
  adminPassword?: string;
  phone?: string;
  ip?: string;
}

export const DEMO_STORE_CC = [
  'business@metamorphosis.com.bd',
  'coo@metamorphosis.com.bd',
  'sales@metamorphosis.com.bd',
];

export async function sendDemoStoreCreatedEmail(data: DemoStoreEmailPayload): Promise<boolean> {
  const subject = `[MetaPOS] আপনার ডেমো স্টোর প্রস্তুত — ${data.shopName} (${data.storeUrl})`;

  const textContent = `
অভিনন্দন! আপনার MetaPOS ডেমো স্টোর সফলভাবে প্রস্তুত করা হয়েছে।
--------------------------------------------------
দোকান / প্রকাশনীর নাম: ${data.shopName}
স্টোরের ঠিকানা: ${data.storeUrl}

লগইন ক্রেডেনশিয়াল:
ব্যবহারকারী (Login): ${data.ownerEmail}
পাসওয়ার্ড (Password): ${data.ownerPassword}

প্রবেশের লিংক:
${data.storeUrl}

শুরুর ধাপসমূহ:
১. উপরে দেওয়া লিংকে ক্লিক করে আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।
২. "Point of Sale" (কাউন্টার) চালু করুন।
৩. বারকোড স্ক্যানার দিয়ে বইয়ের পেছনের ISBN স্ক্যান করে বিক্রি বা ক্যাশ ড্রয়ার টেস্ট করুন।

যেকোনো সহায়তায় সরাসরি কল করুন: +৮৮০ ১৭০০-০০০০০০ অথবা ইমেইল করুন: sales@metamorphosis.com.bd
--------------------------------------------------
(MetaPOS Bangladesh • Metamorphosis Ltd)
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0B192C; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(11,25,44,0.08); border: 1px solid #e2e8f0; }
    .header { background: #0B192C; padding: 32px 28px; color: #ffffff; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 800; }
    .badge { display: inline-block; background: #064E3B; color: #6EE7B7; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
    .content { padding: 32px 28px; }
    .hero-btn { display: block; text-align: center; background: #064E3B; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-size: 15px; margin: 24px 0; }
    .cred-box { background: #FAF9F5; border: 2px dashed #064E3B/30; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { font-weight: 700; color: #64748b; }
    .cred-val { font-weight: 800; color: #0B192C; font-family: monospace; font-size: 14px; }
    .highlight-pass { color: #064E3B; font-size: 15px; }
    .steps { background: #F1F5F9; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; line-height: 1.6; }
    .steps ol { margin: 8px 0 0 0; padding-left: 20px; }
    .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Demo Store Created</span>
      <h1 style="margin-top: 12px;">আপনার MetaPOS লাইভ ডেমো স্টোর প্রস্তুত!</h1>
      <p style="margin: 0; color: #94A3B8; font-size: 14px;">${data.shopName} এর জন্য ডেডিকেটেড পিওএস কাউন্টার ও ক্লাউড সিস্টেম চালু হয়েছে।</p>
    </div>

    <div class="content">
      <p style="font-size: 14px; line-height: 1.6; margin-top: 0;">
        প্রিয় <strong>${data.ownerName || data.shopName}</strong>,<br>
        MetaPOS প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার অনুরোধ অনুযায়ী অমর একুশে বইমেলা ও শোরুম বিক্রয়ের সম্পূর্ণ ডেমো স্টোর কনফিগার করা হয়েছে।
      </p>

      <a href="${data.storeUrl}" class="hero-btn" target="_blank">
        🚀 সরাসরি আপনার স্টোরে প্রবেশ করুন (${data.subdomain}.metaposbd.com)
      </a>

      <div class="cred-box">
        <div style="font-size: 12px; font-weight: 800; color: #064E3B; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
          🔑 আপনার লগইন ক্রেডেনশিয়াল
        </div>
        <div class="cred-row">
          <span class="cred-label">স্টোর লিংক</span>
          <span class="cred-val"><a href="${data.storeUrl}" style="color: #064E3B;">${data.storeUrl}</a></span>
        </div>
        <div class="cred-row">
          <span class="cred-label">ইউজার / লগইন ইমেইল</span>
          <span class="cred-val">${data.ownerEmail}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">পাসওয়ার্ড</span>
          <span class="cred-val highlight-pass">${data.ownerPassword}</span>
        </div>
        ${data.phone ? `
        <div class="cred-row">
          <span class="cred-label">মোবাইল</span>
          <span class="cred-val">${data.phone}</span>
        </div>` : ''}
      </div>

      <div class="steps">
        <strong>⚡ কীভাবে শুরু করবেন?</strong>
        <ol>
          <li>উপরে দেওয়া বাটনে ক্লিক করে আপনার স্টোরে যান।</li>
          <li>আপনার ইমেইল ও পাসওয়ার্ড প্রদান করে সাইন ইন করুন।</li>
          <li><strong>Point of Sale</strong> মডিউলে ঢুকে বইমেলা কাউন্টার সেশন চালু করুন।</li>
          <li>ISBN বারকোড স্ক্যানার দিয়ে স্ক্যান করুন অথবা বই নির্বাচন করে ক্যাশ বা বিকাশ দিয়ে বিল কাটুন।</li>
        </ol>
      </div>

      <p style="font-size: 13px; color: #475569; margin-bottom: 0;">
        প্রয়োজনে আমাদের ইঞ্জিনিয়ার বা সাপোর্ট টিমের সরাসরি সহায়তা পেতে কল করুন: <strong>+৮৮০ ১৭০০-০০০০০০</strong> অথবা রিপ্লাই দিন এই ইমেইলে।
      </p>
    </div>

    <div class="footer">
      MetaPOS Bangladesh • Metamorphosis Ltd<br>
      বাংলাবাজার শাখা: ১৬/এ নর্থব্রুক হল রোড, ঢাকা • হেল্পলাইন: +৮৮০ ১৭০০-০০০০০০
    </div>
  </div>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"MetaPOS Instant Store" <${SMTP_USER}>`,
      to: data.ownerEmail,
      cc: DEMO_STORE_CC,
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: 'sales@metamorphosis.com.bd',
    });
    console.log('[SMTP Demo Store] Email sent successfully:', info.messageId, 'to:', data.ownerEmail, 'cc:', DEMO_STORE_CC);
    return true;
  } catch (err) {
    console.error('[SMTP Demo Store] Error sending email:', err);
    return false;
  }
}
