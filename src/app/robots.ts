import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  // Utility pages use noindex metadata; allow crawling so that directive can be read.
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
