import { qaGateEnabled } from '@/lib/qa-gate'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(qaGateEnabled() ? { disallow: '/' } : { allow: '/', disallow: ['/admin/', '/auth/', '/portal/', '/api/'] }),
    },
    sitemap: 'https://humanismoevolutivo.com/sitemap.xml',
  }
}
