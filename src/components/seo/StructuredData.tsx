"use client";
import { useLanguage } from '@/contexts/LanguageContext';
import { absoluteUrl, SITE_URL } from '@/lib/site';
import JsonLd from './JsonLd';
interface BookStructuredDataProps {
  title: string; subtitle: string; author: string; description: string[]; keywords: string[]; coverImage: string; url: string;
}
export function BookStructuredData({ title, subtitle, author, description, keywords, coverImage, url }: BookStructuredDataProps) {
  const { language } = useLanguage();
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Book', name: title, alternateName: subtitle,
    author: { '@type': 'Person', name: author }, description: description.join(' '), keywords: keywords.join(', '),
    image: new URL(coverImage, SITE_URL).href, inLanguage: language,
    publisher: { '@type': 'Organization', name: 'Fundación Humanismo Evolutivo', url: SITE_URL },
    url: absoluteUrl(new URL(url, SITE_URL).pathname, language),
  }} />;
}
interface PersonStructuredDataProps { name: string; jobTitle: string; description: string; image: string; url: string; }
export function PersonStructuredData({ name, jobTitle, description, image, url }: PersonStructuredDataProps) {
  const { language } = useLanguage();
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name, jobTitle, description,
    image: new URL(image, SITE_URL).href, url: absoluteUrl(new URL(url, SITE_URL).pathname, language),
  }} />;
}
