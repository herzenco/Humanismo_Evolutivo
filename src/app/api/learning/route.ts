import { z } from 'zod';
import { learningAccess } from '@/lib/learning/server';
import { createClient } from '@/lib/supabase/server';
import { isEmailAccountClaims } from '@/lib/auth';
const input = z.object({ action: z.enum(['save','complete']), course: z.string().max(100), lesson: z.number().int().min(1).max(500), reflection: z.string().max(20000), reviewed: z.boolean() }).strict();
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Solicitud no permitida.' },403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Se requiere JSON.' },415);
  const client = await createClient();
  const { data, error } = await client.auth.getClaims();
  if (error || !isEmailAccountClaims(data?.claims)) return reply({ error: 'Inicia sesión para continuar.' },401);
  const text = await request.text();
  if (new TextEncoder().encode(text).length>90000) return reply({ error: 'El texto es demasiado largo.' },413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return reply({ error: 'Solicitud inválida.' },400); }
  const parsed = input.safeParse(body);
  if (!parsed.success) return reply({ error: 'Revisa los datos de la clase.' },400);
  const { action, course, lesson, reflection, reviewed } = parsed.data;
  const result = await learningAccess(action,course,lesson,{ reflection,reviewed });
  if (result.error) return reply({ error: result.error.code === '42501' ? 'Completa las clases anteriores para continuar.' : result.error.code === '23514' ? 'Revisa la clase y escribe una reflexión de al menos 20 caracteres.' : 'No se pudo guardar. Tu siguiente clase permanece bloqueada; vuelve a intentarlo.' },result.error.code === '42501' ? 403 : result.error.code === '23514' ? 400 : 503);
  return reply({ data: result.data });
}
