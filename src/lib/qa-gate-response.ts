import { NextResponse, type NextRequest } from 'next/server';
import { QA_COOKIE, QA_SESSION_SECONDS, createQaSession, shouldRenewQaSession, qaGateConfig, qaGateEnabled, validQaSession } from './qa-gate';

// Next's route-handler URL can use an internal hostname. Bind redirects and
// cookies to the actual Host received by this deployment, never forwarded-host.
export function qaRequestOrigin(request: NextRequest) {
  const origin = new URL(request.url);
  const host = request.headers.get('host');
  if (host) origin.host = host;
  return origin.origin;
}

export function privateQaResponse(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Vercel-CDN-Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export function qaGateResponse(request: NextRequest): NextResponse | null {
  if (!qaGateEnabled()) return null;
  // The self-contained gate uses no public scripts, fonts or images.
  if (request.nextUrl.pathname === '/qa-access') return null;
  try {
    const config = qaGateConfig();
    if (validQaSession(request.cookies.get(QA_COOKIE)?.value, new URL(qaRequestOrigin(request)).host, config)) return null;
  } catch {
    return privateQaResponse(new NextResponse('El acceso de QA no está configurado. Contacta al administrador.', { status: 503 }));
  }
  if (!['GET', 'HEAD'].includes(request.method) || request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname.startsWith('/_next/')) {
    return privateQaResponse(NextResponse.json({ error: 'Se requiere la contraseña de QA.' }, { status: 401 }));
  }
  const destination = new URL('/qa-access', qaRequestOrigin(request));
  destination.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return privateQaResponse(NextResponse.redirect(destination, 303));
}

export function rememberQaAccess(request: NextRequest, response: NextResponse) {
  if (!qaGateEnabled() || request.nextUrl.pathname === '/qa-access') return response;
  const config = qaGateConfig();
  const host = new URL(qaRequestOrigin(request)).host;
  if (shouldRenewQaSession(request.cookies.get(QA_COOKIE)?.value, host, config)) {
    response.cookies.set(QA_COOKIE, createQaSession(host, config), {
      httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge:QA_SESSION_SECONDS,
    });
  }
  return response;
}
