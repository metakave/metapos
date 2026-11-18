import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import express, { type NextFunction, type Request, type Response } from 'express';
import { DB_PATH } from './db.ts';
import { ensureAdmin, loadUser, purgeExpiredSessions } from './auth.ts';
import { HttpError } from './http.ts';
import { publicRouter } from './routes/public.ts';
import { adminRouter } from './routes/admin.ts';

const production = process.argv.includes('--production') || process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || '127.0.0.1';

ensureAdmin();
purgeExpiredSessions();
setInterval(purgeExpiredSessions, 3_600_000).unref();

const app = express();
app.disable('x-powered-by');
// Set TRUST_PROXY=1 behind nginx/Caddy so rate limits and secure cookies see the real client.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

// ---------- API ----------

const api = express.Router();
api.use(express.json({ limit: '50kb' }));

// CSRF guard: every state-changing call must carry a custom header, which a
// cross-site form or <img> cannot send without a CORS preflight (and we allow none).
api.use((req, _res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.get('X-Requested-With') !== 'metapos') {
    return next(new HttpError(403, 'অনুরোধটি গ্রহণযোগ্য নয়'));
  }
  next();
});
api.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
api.use(loadUser);
api.use('/admin', adminRouter);
api.use(publicRouter);
api.use((_req, _res, next) => next(new HttpError(404, 'API পাওয়া যায়নি')));

api.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err && typeof err === 'object' && 'type' in err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'অনুরোধের ডেটা সঠিক নয়' });
  }
  if (err && typeof err === 'object' && 'type' in err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'অনুরোধের ডেটা অনেক বড়' });
  }
  console.error(err);
  res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
});

app.use('/api', api);

// ---------- frontend ----------

const server = http.createServer(app);

if (production) {
  const dist = path.resolve('dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('dist/ পাওয়া যায়নি — আগে `npm run build` চালান।');
    process.exit(1);
  }
  // Hashed bundles can be cached forever; other public files (logo etc.) cannot.
  app.use('/assets', express.static(path.join(dist, 'assets'), { maxAge: '1y', immutable: true }));
  app.use(express.static(dist, { index: false }));
  // SPA fallback: every non-API route serves index.html (no long cache).
  app.get(/.*/, (_req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    // 'native' imports vite.config.ts directly instead of bundling it to a temp
    // file, which `node --watch` would otherwise see and restart on forever.
    configLoader: 'native',
    server: { middlewareMode: true, hmr: { server } },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

server.listen(PORT, HOST, () => {
  console.log(`\n  MetaPOS ${production ? '(production)' : '(dev)'} চলছে: http://${HOST}:${PORT}/`);
  console.log(`  ড্যাশবোর্ড: http://${HOST}:${PORT}/admin`);
  console.log(`  ডেটাবেস:   ${DB_PATH}\n`);
});
