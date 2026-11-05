import 'server-only';
import { cache } from 'react';
import type { ContentRecord } from '@/lib/content';
import type { Database } from '@/integrations/supabase/types';
type Tables = Database['public']['Tables'];
async function publicRows<T>(table: string, select: string): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(`${url}/rest/v1/${table}?select=${select}&order=updated_at.asc.nullsfirst`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60, tags: ['public-content'] },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Public content unavailable: ${table}`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}
export const getPublicSiteData = cache(async () => {
  const [content, images, series] = await Promise.all([
    publicRows<ContentRecord>('site_content', 'key,content,language'),
    publicRows<Tables['site_images']['Row']>('site_images', '*'),
    publicRows<Tables['podcast_series']['Row']>('podcast_series', '*'),
  ]);
  return { content, images, series };
});
