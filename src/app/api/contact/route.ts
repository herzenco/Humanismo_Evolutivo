import { hasHoneypot } from '@/lib/newsletter';
import { contactSchema } from '@/lib/contact';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

async function notify(input: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.PORTAL_INVITATION_FROM;
  const to = 'humanismoevolutivo@gmail.com';
  if (!key || !from) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Contacto: ${input.subject}`,
      text: `${input.name} <${input.email}>${input.phone ? `\nTeléfono: ${input.phone}` : ''}\n\n${input.message}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  return response.ok;
}

export async function POST(request: Request) {
  const en = request.headers.get('accept-language')?.startsWith('en') ?? false;
  const fail = (status: number, es: string, english: string) =>
    reply({ error: en ? english : es }, status);

  if (!isSupabaseConfigured) return fail(503, 'El formulario no está disponible en este momento.', 'The form is currently unavailable.');
  if (request.headers.get('origin') !== new URL(request.url).origin) return fail(403, 'Solicitud no permitida.', 'This request is not allowed.');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return fail(415, 'Se requiere JSON.', 'A JSON request is required.');
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 20000) return fail(413, 'El mensaje es demasiado largo.', 'Your message is too long.');
  let body: unknown;
  try { body = JSON.parse(text); } catch { return fail(400, 'Solicitud inválida.', 'Invalid request.'); }
  if (hasHoneypot(body)) return reply({ ok: true });
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return fail(400, 'Revisa los campos del formulario.', 'Check the form fields and try again.');
  const client = await createClient();
  const { data, error } = await client.rpc('submit_contact_submission', {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_phone: parsed.data.phone || '',
    p_subject: parsed.data.subject,
    p_message: parsed.data.message,
    p_consent: true,
    p_locale: parsed.data.locale,
  });
  if (error || !data) return fail(503, 'No pudimos guardar tu mensaje. Intenta más tarde.', 'We could not save your message. Please try again later.');
  await notify(parsed.data).catch(() => false);
  return reply({ ok: true });
}

export async function GET() {
  if (!isSupabaseConfigured) return reply({ error: 'No disponible.' }, 503);
  const client = await createClient();
  const { data, error } = await client.rpc('list_contact_submissions');
  if (error) return reply({ error: 'No tienes permiso para ver estos mensajes.' }, 403);
  return reply({ data });
}
