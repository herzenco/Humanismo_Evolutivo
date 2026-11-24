import { NextResponse, type NextRequest } from 'next/server';
import { SITE_URL } from './lib/site';
const legacyHosts = new Set(['yosoynosotros.org', 'www.yosoynosotros.org', 'yosoynosotros.com', 'www.yosoynosotros.com', 'humanismoevolutivo.com']);
export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  if (legacyHosts.has(hostname)) {
    const canonical = new URL(pathname + request.nextUrl.search, SITE_URL);
    return NextResponse.redirect(canonical, 308);
  }
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }
  if (pathname === '/en' || pathname.startsWith('/en/')) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}
export const config = { matcher: ['/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)'] };
