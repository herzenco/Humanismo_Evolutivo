import { contactSchema, verifyTurnstile } from '@/lib/contact';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

async function notify(input: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_INVITATION_FROM || process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_NOTIFY_EMAIL || 'humanismoevolutivo@gmail.com';
  // TODO: set RESEND_API_KEY and PORTAL_INVITATION_FROM (or CONTACT_FROM_EMAIL) so this notification is delivered.
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
  if (!isSupabaseConfigured) return reply({ error: 'El formulario no está disponible en este momento.' }, 503);
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Solicitud no permitida.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Se requiere JSON.' }, 415);
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 20000) return reply({ error: 'El mensaje es demasiado largo.' }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return reply({ error: 'Solicitud inválida.' }, 400); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return reply({ error: parsed.error.issues[0]?.message || 'Revisa los campos del formulario.' }, 400);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  if (!await verifyTurnstile(parsed.data.turnstileToken, ip)) return reply({ error: 'No pudimos verificar que eres una persona. Intenta de nuevo.' }, 400);
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
  if (error || !data) return reply({ error: 'No pudimos guardar tu mensaje. Intenta más tarde.' }, 503);
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
