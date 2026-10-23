import { deliverSchoolInvitation } from '@/lib/education/mail';
import { isEmailAccountClaims } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { educationRequestSchema, educationErrorStatus } from '@/lib/education/contracts';
import { educationAccess, isEducationAccessEnabled } from '@/lib/education/server';

export const dynamic = 'force-dynamic';
const response = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function POST(request: Request) {
  if (!isEducationAccessEnabled) return response({ error: 'Education access is not enabled in this environment.' }, 503);
  if (request.headers.get('origin') !== new URL(request.url).origin) return response({ error: 'Same-origin request required.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'JSON required.' }, 415);
  const client = await createClient();
  const { data: identity, error: authError } = await client.auth.getClaims();
  if (authError || !isEmailAccountClaims(identity?.claims)) return response({ error: 'Authentication required.' }, 401);
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 8192) return response({ error: 'Request too large.' }, 413);
  let input: unknown;
  try { input = JSON.parse(text); } catch { return response({ error: 'Invalid JSON.' }, 400); }
  const parsed = educationRequestSchema.safeParse(input);
  if (!parsed.success) return response({ error: 'Invalid education operation.' }, 400);
  if(parsed.data.action === 'invitations.resend') {
    const {data,error}=await educationAccess({action:'invitations.prepare',input:parsed.data.input});
    if(error||!data)return response({error:'No tienes permiso para enviar esta invitación.'},403);
    return response({data:await deliverSchoolInvitation(parsed.data.input.invitationId)});
  }
  const { data, error } = await educationAccess(parsed.data);
  if (error) {
    const status = educationErrorStatus(error.code);
    return response({ error: status === 403 ? 'You do not have access to this school or operation.' : status === 409 ? 'This membership or invitation conflicts with an existing record.' : status === 400 ? 'The supplied school, account or activity is not available.' : 'Education access is temporarily unavailable.' }, status);
  }
  if ((parsed.data.action==='invitations.create'||parsed.data.action==='schools.create') && data && typeof data==='object' && !Array.isArray(data) && typeof data.invitationId==='string') {
    return response({data:{...data,...await deliverSchoolInvitation(data.invitationId)}});
  }
  return response({ data });
}
