/** Browser reuse for public files; never share partial responses at the CDN. */
export function homeMediaCacheHeaders(gated: boolean) {
  return {
    'Cache-Control': gated ? 'private, no-store, max-age=0' : 'public, max-age=86400',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  };
}
