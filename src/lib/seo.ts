import type { Metadata } from 'next';
import { qaGateEnabled } from '@/lib/qa-gate';
import { absoluteUrl, SITE_NAME, SITE_URL, type Language } from '@/lib/site';
export const SOCIAL_IMAGE = '/lovable-uploads/129f3007-ae15-429d-9345-8117265510b8.png';
export function pageMetadata({ title, description, path, language, image = SOCIAL_IMAGE, index = true }: {
  title: string; description: string; path: string; language: Language; image?: string; index?: boolean;
}): Metadata {
  const url = absoluteUrl(path, language);
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title, description,
    alternates: { canonical: url, languages: { es: absoluteUrl(path), en: absoluteUrl(path, 'en'), 'x-default': absoluteUrl(path) } },
    robots: { index: index && !qaGateEnabled(), follow: !qaGateEnabled() },
    openGraph: { type: 'website', title: fullTitle, description, url, siteName: SITE_NAME,
      locale: language === 'es' ? 'es_MX' : 'en_US', alternateLocale: language === 'es' ? 'en_US' : 'es_MX',
      images: [{ url: new URL(image, SITE_URL).href, alt: title }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [new URL(image, SITE_URL).href] },
  };
}
