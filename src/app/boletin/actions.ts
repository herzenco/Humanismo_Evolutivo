'use server';

import { headers } from 'next/headers';
import { hashToken, newToken, newsletterOrigin, tokenSchema } from '@/lib/newsletter';
import { removeNewsletterContact, syncNewsletterContact } from '@/lib/newsletter-resend';
import { createNewsletterClient } from '@/lib/supabase/newsletter';

async function getTokenHash(form: FormData) {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host');
  if (!host || !newsletterOrigin(new Request('https://' + host, { headers: requestHeaders }))) return null;
  const token = tokenSchema.safeParse(form.get('token'));
  return token.success ? hashToken(token.data) : null;
}

export async function confirmNewsletter(_previous: boolean | null, form: FormData) {
  const tokenHash = await getTokenHash(form);
  const client = createNewsletterClient();
  if (!client || !tokenHash) return false;
  const syncHash = hashToken(newToken());
  const { data, error } = await client.rpc('confirm_newsletter', { p_token_hash: tokenHash, p_sync_hash: syncHash });
  if (error || typeof data?.email !== 'string') return false;
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (segment) {
    const contactId = await syncNewsletterContact(data.email, segment);
    if (contactId) {
      const marker = await client.rpc('mark_newsletter_synced', {
        p_sync_hash: syncHash, p_contact_id: contactId, p_segment_id: segment,
      });
      if (!marker.error && marker.data === false) await removeNewsletterContact(data.email, segment);
    }
  }
  return true;
}

export async function unsubscribeNewsletter(_previous: boolean | null, form: FormData) {
  const tokenHash = await getTokenHash(form);
  const client = createNewsletterClient();
  if (!client || !tokenHash) return false;
  const { data, error } = await client.rpc('unsubscribe_newsletter', { p_token_hash: tokenHash });
  if (error || typeof data?.email !== 'string') return false;
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (segment) await removeNewsletterContact(data.email, data.segment_id || segment);
  return true;
}
