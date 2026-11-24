import type { MetadataRoute } from 'next';
import { absoluteUrl, languages } from '@/lib/site';
import { indexablePaths } from '@/lib/indexable-paths';
export default function sitemap(): MetadataRoute.Sitemap {
  // Do not invent lastModified timestamps; no authoritative revision dates are stored yet.
  return indexablePaths().flatMap(path => languages.map(language => ({
    url: absoluteUrl(path, language),
    alternates: { languages: { es: absoluteUrl(path), en: absoluteUrl(path, 'en'), 'x-default': absoluteUrl(path) } },
  })));
}
