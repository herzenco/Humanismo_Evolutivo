import { deliverSchoolInvitation } from '@/lib/education/mail';
import { isEmailAccountClaims } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { educationRequestSchema, educationErrorStatus } from '@/lib/education/contracts';
import { educationAccess, isEducationAccessEnabled } from '@/lib/education/server';

export const dynamic = 'force-dynamic';
const response = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function POST(request: Request) {
  if (!isEducationAccessEnabled) return response({ error: 'La gestión escolar no está disponible en este entorno.' }, 503);
  if (request.headers.get('origin') !== `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`) return response({ error: 'La solicitud debe proceder de este sitio.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'Se requiere una solicitud JSON.' }, 415);
  const client = await createClient();
  const { data: identity, error: authError } = await client.auth.getClaims();
  if (authError || !isEmailAccountClaims(identity?.claims)) return response({ error: 'Inicia sesión para continuar.' }, 401);
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 8192) return response({ error: 'La solicitud es demasiado grande.' }, 413);
  let input: unknown;
  try { input = JSON.parse(text); } catch { return response({ error: 'La solicitud no es válida.' }, 400); }
  const parsed = educationRequestSchema.safeParse(input);
  if (!parsed.success) return response({ error: 'La operación educativa no es válida.' }, 400);
  if(parsed.data.action === 'invitations.resend') {
    const {data,error}=await educationAccess({action:'invitations.prepare',input:parsed.data.input});
    if(error||!data)return response({error:'No tienes permiso para enviar esta invitación.'},403);
    return response({data:await deliverSchoolInvitation(parsed.data.input.invitationId)});
  }
  const { data, error } = await educationAccess(parsed.data);
  if (error) {
    const status = educationErrorStatus(error.code);
    return response({ error: status === 403 ? 'No tienes acceso a esta escuela u operación.' : status === 409 ? 'Esta membresía o invitación ya existe.' : status === 400 ? 'La escuela, cuenta o actividad no está disponible.' : 'La gestión escolar no está disponible temporalmente.' }, status);
  }
  if ((parsed.data.action==='invitations.create'||parsed.data.action==='schools.create') && data && typeof data==='object' && !Array.isArray(data) && typeof data.invitationId==='string') {
    return response({data:{...data,...await deliverSchoolInvitation(data.invitationId)}});
  }
  return response({ data });
}
