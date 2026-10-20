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
  const { data, error } = await educationAccess(parsed.data);
  if (error) {
    const status = educationErrorStatus(error.code);
    return response({ error: status === 403 ? 'You do not have access to this school or operation.' : status === 409 ? 'This membership or invitation conflicts with an existing record.' : status === 400 ? 'The supplied school, account or activity is not available.' : 'Education access is temporarily unavailable.' }, status);
  }
  return response({ data });
}
