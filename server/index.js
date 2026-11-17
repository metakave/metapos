const http = require('http');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3001;
const SMTP_HOST = process.env.SMTP_HOST || 'smtppro.zoho.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false'; // default true for 465
const SMTP_USER = process.env.SMTP_USER || 'info@metamorphosis.com.bd';
const SMTP_PASS = process.env.SMTP_PASS || 'yF#3vcpp';
const MAIL_TO = process.env.MAIL_TO || 'sales@metamorphosis.com.bd';
const MAIL_CC = (process.env.MAIL_CC || 'info@metamorphosis.com.bd,marketing@metamorphosis.com.bd')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[SMTP] Connection verification failed:', error.message);
  } else {
    console.log('[SMTP] Ready to send emails via', SMTP_HOST, 'as', SMTP_USER);
  }
});

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Health check
  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Contact / Demo form submission
  if ((url.pathname === '/api/contact' || url.pathname === '/api/send-email') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against large payloads (1MB limit)
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const {
          name = '',
          phone = '',
          email = '',
          pressName = '',
          pressType = '',
          meetingFormat = '',
          catalogSize = '',
          selectedDate = '',
          selectedTime = '',
          notes = '',
          formType = 'contact', // 'demo' | 'meeting' | 'problem' | 'contact'
          plan = ''
        } = data;

        if (!name || (!phone && !email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'নাম এবং মোবাইল নম্বর বা ইমেইল আবশ্যক।' 
          }));
          return;
        }

        const typeLabels = {
          demo: 'ফ্রি ডেমো বুকিং (Schedule a Demo)',
          meeting: 'মিটিং নির্ধারণের অনুরোধ (Request a Meeting)',
          problem: 'সমস্যা রিপোর্ট / সাপোর্ট টিকিট (Report a Problem)',
          contact: 'যোগাযোগ ফর্ম (Contact Inquiry)'
        };
        const formTitle = typeLabels[formType] || 'নতুন অনুসন্ধান (New Lead)';

        const subject = `[MetaPOS] ${formTitle} - ${pressName || name}`;

        const textContent = `
MetaPOS ওয়েবসাইট থেকে নতুন বার্তা:
----------------------------------------
ফর্ম ক্যাটাগরি: ${formTitle}
নাম: ${name}
মোবাইল / WhatsApp: ${phone || 'দেওয়া হয়নি'}
ইমেইল: ${email || 'দেওয়া হয়নি'}
প্রকাশনী / প্রতিষ্ঠান: ${pressName || 'দেওয়া হয়নি'}
প্রতিষ্ঠান ধরন: ${pressType || 'দেওয়া হয়নি'}
প্যাকেজ / প্ল্যান: ${plan || 'N/A'}
সাক্ষাতের মাধ্যম: ${meetingFormat || 'N/A'}
পছন্দের তারিখ ও সময়: ${selectedDate ? `${selectedDate} নভেম্বর, ${selectedTime}` : 'N/A'}
বইয়ের ক্যাটালগ সাইজ: ${catalogSize || 'N/A'}

নোট / বিবরণ:
${notes || 'কোনো অতিরিক্ত নোট নেই।'}
----------------------------------------
IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'}
তারিখ: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (বাংলাদেশ সময়)
`;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 20px; color: #0B192C; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(11,25,44,0.06); }
    .header { background: #0B192C; color: #ffffff; padding: 24px 28px; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
    .header .tag { display: inline-block; background: #064E3B; color: #6EE7B7; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
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
        <span class="value">${name}</span>
      </div>
      <div class="field-row">
        <span class="label">মোবাইল / WhatsApp</span>
        <span class="value highlight">${phone || 'N/A'}</span>
      </div>
      <div class="field-row">
        <span class="label">ইমেইল</span>
        <span class="value">${email || 'N/A'}</span>
      </div>
      <div class="field-row">
        <span class="label">প্রকাশনী / প্রতিষ্ঠান</span>
        <span class="value highlight">${pressName || 'N/A'}</span>
      </div>
      ${pressType ? `
      <div class="field-row">
        <span class="label">ক্যাটাগরি</span>
        <span class="value">${pressType}</span>
      </div>` : ''}
      ${plan ? `
      <div class="field-row">
        <span class="label">নির্বাচিত প্যাকেজ</span>
        <span class="value highlight">${plan}</span>
      </div>` : ''}
      ${meetingFormat ? `
      <div class="field-row">
        <span class="label">সাক্ষাতের মাধ্যম</span>
        <span class="value">${meetingFormat}</span>
      </div>` : ''}
      ${selectedDate ? `
      <div class="field-row">
        <span class="label">তারিখ ও সময়</span>
        <span class="value highlight">${selectedDate} নভেম্বর, ${selectedTime} (বাংলাদেশ সময়)</span>
      </div>` : ''}
      ${catalogSize ? `
      <div class="field-row">
        <span class="label">ক্যাটালগ সাইজ</span>
        <span class="value">${catalogSize}</span>
      </div>` : ''}

      <div style="margin-top: 20px;">
        <span class="label" style="display:block; margin-bottom: 6px;">মন্তব্য / বিশেষ নোট:</span>
        <div class="notes-box">${(notes || 'কোনো অতিরিক্ত নোট দেওয়া হয়নি।').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      MetaPOS Bangladesh • Client IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'} • ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (BST)
    </div>
  </div>
</body>
</html>
`;

        const mailOptions = {
          from: `"MetaPOS Contact" <${SMTP_USER}>`,
          to: MAIL_TO,
          cc: MAIL_CC,
          subject: subject,
          text: textContent,
          html: htmlContent,
          replyTo: email || undefined,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[SMTP] Email sent successfully:', info.messageId, 'to:', MAIL_TO, 'cc:', MAIL_CC);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          messageId: info.messageId,
          message: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে।'
        }));
      } catch (err) {
        console.error('[SMTP] Error sending email:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি কল বা হোয়াটসঅ্যাপ করুন।' 
        }));
      }
    });
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[MetaPOS API] Listening on http://127.0.0.1:${PORT}`);
});
