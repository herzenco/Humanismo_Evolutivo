'use server';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { newsletterSubscriptionSchema } from '@/lib/validation';

export type NewsletterActionState = {
  status: 'idle' | 'success' | 'error';
  code?: 'invalid_email' | 'unavailable';
};

export async function subscribeToNewsletter(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const honeypot = formData.get('website');

  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return { status: 'success' };
  }

  const parsed = newsletterSubscriptionSchema.safeParse({
    email: formData.get('email'),
    locale: formData.get('locale'),
  });

  if (!parsed.success) {
    return { status: 'error', code: 'invalid_email' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Newsletter subscription is unavailable: Supabase public environment variables are missing.');
    return { status: 'error', code: 'unavailable' };
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { error } = await supabase
    .from('newsletter_subscriptions')
    .insert({
      email: parsed.data.email,
      locale: parsed.data.locale,
    });

  if (error && error.code !== '23505') {
    console.error(`Newsletter subscription failed with database code ${error.code ?? 'unknown'}.`);
    return { status: 'error', code: 'unavailable' };
  }

  return { status: 'success' };
}
