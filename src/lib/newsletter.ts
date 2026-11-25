import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';

const liveHost = 'iwtcdjkawcjsxmwhzlot.supabase.co';
const origins = new Set(['https://humanismoevolutivo.com', 'https://qa.humanismoevolutivo.com']);

export function newsletterConfig(env: NodeJS.ProcessEnv) {
  const { NEWSLETTER_ENVIRONMENT: environment, NEWSLETTER_SUPABASE_URL: url, NEWSLETTER_SUPABASE_SECRET_KEY: key } = env;
  if ((environment !== 'qa' && environment !== 'production') || !url || !key?.startsWith('sb_secret_')) return null;
  try {
    const target = new URL(url);
    if (target.origin !== url.replace(/\/$/, '') || target.protocol !== 'https:' || !/^[a-z0-9]+\.supabase\.co$/.test(target.host)) return null;
    return ((environment === 'production') === (target.host === liveHost)) ? { url, key } : null;
  } catch {
    return null;
  }
}

export const signupSchema = z.object({
  email: z.string().trim().max(254).email().transform(email => email.toLowerCase()),
  name: z.string().trim().max(120).optional(),
  locale: z.enum(['es', 'en']).default('es'),
  consent: z.literal(true),
  question: z.number().int().min(35).max(51).optional(),
}).refine(value => value.question === undefined || Boolean(value.name), { path: ['name'] });

export function newsletterOrigin(request: Request) {
  const host = request.headers.get('host');
  const origin = host ? `https://${host.toLowerCase()}` : new URL(request.url).origin;
  return origins.has(origin) && request.headers.get('origin') === origin ? origin : null;
}

export function hasHoneypot(body: unknown) {
  return typeof body === 'object' && body !== null && 'website' in body
    && typeof body.website === 'string' && body.website.length > 0;
}

export const newToken = () => randomBytes(32).toString('base64url');
export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex');
export const tokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
