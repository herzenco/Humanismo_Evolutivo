import type { Metadata } from 'next';
export const SITE_ORIGIN = 'https://humanismoevolutivo.com';
export function pageMetadata(path: string, title: string, description: string, keywords?: string[]): Metadata {
  const url = `${SITE_ORIGIN}${path}`;
  return { title, description, keywords, alternates: { canonical: url }, openGraph: { title, description, url, type: 'website', locale: 'es_MX', siteName: 'Humanismo Evolutivo' }, twitter: { card: 'summary', title, description } };
}
