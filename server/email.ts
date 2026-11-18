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
