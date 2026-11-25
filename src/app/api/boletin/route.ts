import { hashToken, hasHoneypot, newToken, newsletterOrigin, signupSchema } from '@/lib/newsletter';
import { sendNewsletterConfirmation } from '@/lib/newsletter-resend';
import { createNewsletterClient } from '@/lib/supabase/newsletter';

const reply = (status = 200) => Response.json({ ok: status === 200 }, { status, headers: { 'Cache-Control': 'private, no-store' } });

export async function POST(request: Request) {
  const origin = newsletterOrigin(request);
  if (!origin) return reply(403);
  if (request.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json') return reply(415);
  const text = await request.text();
  if (Buffer.byteLength(text) > 20000) return reply(413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return reply(400); }
  if (hasHoneypot(body)) return reply();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return reply(400);
  const client = createNewsletterClient();
  if (!client || !process.env.NEWSLETTER_FROM_EMAIL || !process.env.RESEND_API_KEY) return reply(503);
  const { email, name, locale, question } = parsed.data;
  const ip = request.headers.get('x-vercel-forwarded-for') ?? '';
  const confirm = newToken();
  const baja = newToken();
  const { data, error } = await client.rpc('signup_newsletter_from_source', {
    p_source: question === undefined ? 'boletin' : `pregunta-${question}`,
    p_email: email, p_name: name ?? '', p_locale: locale, p_consent: true,
    p_ip_hash: hashToken(ip.split(',')[0].trim()),
    p_confirm_hash: hashToken(confirm), p_unsubscribe_hash: hashToken(baja),
  });
  if (error) console.error('Newsletter registration failed', { code: error.code });
  if (error || data === 'busy') return reply(503);
  if (data === 'limited') return reply(429);
  if (data !== 'send' && data !== 'skip') return reply(503);
  if (data === 'send') {
    const confirmUrl = new URL('/boletin/confirmar?token=' + confirm, origin);
    const bajaUrl = new URL('/boletin/baja?token=' + baja, origin);
    const sent = await sendNewsletterConfirmation(email, name, confirmUrl.href, bajaUrl.href, question);
    const delivery = await client.rpc('finish_newsletter_confirmation_delivery', {
      p_confirm_hash: hashToken(confirm), p_sent: sent,
    });
    if (delivery.error) console.error('Newsletter confirmation delivery state update failed', { code: delivery.error.code });
    if (!sent) return reply(503);
  }
  return reply();
}
