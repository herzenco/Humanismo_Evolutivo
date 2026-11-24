import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isSupabaseConfigured } from './config';

export function createContactWriter() {
  const key = process.env.CONTACT_SUPABASE_SECRET_KEY?.trim();
  if (!isSupabaseConfigured || !key?.startsWith('sb_secret_')) return null;
  return createClient(getSupabaseConfig().url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
