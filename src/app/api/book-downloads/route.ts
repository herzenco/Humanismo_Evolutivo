import { z } from 'zod';
import { getBooks } from '@/lib/qa-resources';
import { hashToken, hasHoneypot, newsletterOrigin } from '@/lib/newsletter';
import { createNewsletterClient } from '@/lib/supabase/newsletter';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).pipe(z.email()).transform(email => email.toLowerCase()),
  bookId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
});
const reply = (status: number) => Response.json({ ok: status === 200 }, {
  status, headers: { 'Cache-Control': 'private, no-store' },
});

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (process.env.VERCEL === '1' ? !newsletterOrigin(request) : request.headers.get('origin') !== origin) return reply(403);
  if (request.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json') return reply(415);
  const text = await request.text();
  if (Buffer.byteLength(text) > 4000) return reply(413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return reply(400); }
  if (hasHoneypot(body)) return reply(200);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return reply(400);
  const client = createNewsletterClient();
  if (!client) return reply(503);
  const book = (await getBooks()).find(book => book.id === parsed.data.bookId && book.downloadAvailable);
  if (!book) return reply(404);
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ?? '';
  const { data, error } = await client.rpc('record_book_download_contact', {
    p_email: parsed.data.email, p_name: parsed.data.name, p_book_id: book.id, p_book_title: book.title,
    p_ip_hash: hashToken(ip),
  });
  if (error) {
    console.error('Book download registration failed', { code: error.code });
    return reply(503);
  }
  return reply(data === true ? 200 : 429);
}
