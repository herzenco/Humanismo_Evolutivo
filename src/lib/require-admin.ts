import 'server-only';
import { createClient } from '@/lib/supabase/server';
export async function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: role, error: roleError } = await client.from('user_roles').select('role')
    .eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  return !roleError && role ? client : null;
}
