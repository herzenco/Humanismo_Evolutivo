import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { newsletterConfig } from '@/lib/newsletter';

export function createNewsletterClient() {
  const config = newsletterConfig(process.env);
  if (!config) return null;
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
