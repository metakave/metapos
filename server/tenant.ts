import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { db, now } from './db.ts';

const execFileAsync = promisify(execFile);

export const RESERVED_SUBDOMAINS = new Set([
  'www',
  'admin',
  'api',
  'app',
  'mail',
  'ftp',
  'portal',
  'status',
  'support',
  'billing',
  'postgres',
  'template0',
  'template1',
  'metapos_tpl',
  'root',
  'localhost',
]);

export interface TenantCredentials {
  url: string;
  shop: string;
  ownerLogin: string;
  ownerPassword: string;
  adminLogin?: string;
  adminPassword?: string;
  created: string;
}

export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  const sub = subdomain.trim().toLowerCase();
  if (sub.length < 2 || sub.length > 30) {
    return { valid: false, error: 'সাবডোমেন ২ থেকে ৩০ অক্ষরের মধ্যে হতে হবে।' };
  }
  if (!/^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/.test(sub)) {
    return {
      valid: false,
      error: 'সাবডোমেনে শুধু ইংরেজি ছোট হাতের অক্ষর (a-z), সংখ্যা (0-9) এবং হাইফেন (-) ব্যবহার করা যাবে (হাইফেন দিয়ে শুরু বা শেষ হতে পারবে না)।',
    };
  }
  if (RESERVED_SUBDOMAINS.has(sub)) {
    return { valid: false, error: 'এই সাবডোমেনটি সংরক্ষিত। অনুগ্রহ করে অন্য নাম বেছে নিন।' };
  }
  return { valid: true };
}

export async function isSubdomainAvailable(subdomain: string): Promise<{ available: boolean; reason?: string }> {
  const check = validateSubdomain(subdomain);
  if (!check.valid) {
    return { available: false, reason: check.error };
  }

  const sub = subdomain.trim().toLowerCase();

  // Check SQLite records first
  const existingInDb = db.prepare('SELECT 1 FROM demo_stores WHERE subdomain = ?').get(sub);
  if (existingInDb) {
    return { available: false, reason: 'এই সাবডোমেনটি ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য নাম বেছে নিন।' };
  }

  // Check on server if metapos-tenant script or PostgreSQL database exists
  if (fs.existsSync('/usr/local/sbin/metapos-tenant')) {
    try {
      const { stdout } = await execFileAsync('sudo', [
        '-u',
        'postgres',
        'psql',
        '-tAqc',
        `SELECT 1 FROM pg_database WHERE datname='${sub}'`,
      ]);
      if (stdout.trim() === '1') {
        return { available: false, reason: 'এই সাবডোমেনটি ইতিমধ্যে নিবন্ধিত রয়েছে।' };
      }
    } catch (err) {
      console.error('[Tenant Check] DB check error:', err);
    }
  }

  return { available: true };
}

export async function createTenantStore(options: {
  subdomain: string;
  shopName: string;
  ownerEmail: string;
  ownerName?: string;
  phone?: string;
}): Promise<TenantCredentials> {
  const sub = options.subdomain.trim().toLowerCase();
  const shop = options.shopName.trim();
  const email = options.ownerEmail.trim().toLowerCase();

  const val = validateSubdomain(sub);
  if (!val.valid) {
    throw new Error(val.error || 'ভুল সাবডোমেন');
  }

  const scriptPath = '/usr/local/sbin/metapos-tenant';
  const isServerEnv = fs.existsSync(scriptPath);

  if (!isServerEnv) {
    // In local dev mock environment:
    console.log(`[Tenant Dev Mock] Creating store: ${sub} (${shop}) for ${email}`);
    const mockCreds: TenantCredentials = {
      url: `https://${sub}.metaposbd.com`,
      shop,
      ownerLogin: email,
      ownerPassword: 'demo' + Math.random().toString(36).substring(2, 8),
      adminLogin: 'admin',
      adminPassword: 'admin' + Math.random().toString(36).substring(2, 12),
      created: now(),
    };
    return mockCreds;
  }

  // Execute tenant creation on production server
  console.log(`[Tenant Creation] Running metapos-tenant create ${sub} "${shop}" ${email}`);
  try {
    const { stdout, stderr } = await execFileAsync(
      'sudo',
      [scriptPath, 'create', sub, shop, email],
      { timeout: 90_000 },
    );
    console.log('[Tenant Creation] Output:', stdout, stderr);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Tenant Creation] Error:', errorMsg);
    throw new Error('স্টোর তৈরি করতে সমস্যা হয়েছে: ' + errorMsg);
  }

  // Read credentials file
  const credPath = `/root/metapos-tenants/${sub}.cred`;
  try {
    const { stdout } = await execFileAsync('sudo', ['cat', credPath]);
    const lines = stdout.split('\n');
    const creds: Record<string, string> = {};
    for (const line of lines) {
      const idx = line.indexOf('=');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        creds[key] = value;
      }
    }

    return {
      url: creds.url || `https://${sub}.metaposbd.com`,
      shop: creds.shop || shop,
      ownerLogin: creds.owner_login || email,
      ownerPassword: creds.owner_password || '',
      adminLogin: creds.admin_login,
      adminPassword: creds.admin_password,
      created: creds.created || now(),
    };
  } catch (err) {
    console.error('[Tenant Creation] Could not read cred file:', err);
    throw new Error('স্টোর তৈরি হয়েছে কিন্তু ক্রেডেনশিয়াল ফাইল পড়া যায়নি।');
  }
}
