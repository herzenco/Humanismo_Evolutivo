import { NextRequest, NextResponse } from 'next/server';
import { createQaSession, QA_COOKIE, QA_SESSION_SECONDS, qaGateConfig, qaGateEnabled, qaReturnPath, validQaPassword, validQaSession } from '@/lib/qa-gate';
import { privateQaResponse, qaRequestOrigin } from '@/lib/qa-gate-response';

export const dynamic = 'force-dynamic';
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]!));

export function GET(request: NextRequest) {
  if (!qaGateEnabled()) return new NextResponse(null, { status:404 });
  let authenticated = false;
  try {
    authenticated = validQaSession(request.cookies.get(QA_COOKIE)?.value, new URL(qaRequestOrigin(request)).host, qaGateConfig());
  } catch {
    return privateQaResponse(new NextResponse('El acceso de QA no está configurado. Contacta al administrador.', { status:503 }));
  }
  const next = qaReturnPath(request.nextUrl.searchParams.get('next'));
  const invalid = request.nextUrl.searchParams.get('error') === 'invalid';
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Acceso privado · QA</title><style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:#173f2c;color:#173f2c;font:19px/1.6 system-ui,sans-serif}main{width:100%;max-width:480px;background:#faf7ef;padding:clamp(24px,6vw,44px);border-radius:24px}h1{font-size:32px;line-height:1.2}label{display:block;font-weight:600}input,button{width:100%;font:inherit;min-height:48px;border-radius:10px;padding:12px;margin-top:12px}input{border:2px solid #536357;background:white;color:#173f2c}button{border:0;background:#173f2c;color:white;font-weight:600;cursor:pointer}:focus-visible{outline:3px solid #2f6b45;outline-offset:4px}.error{color:#9f1239}small{font-size:16px}a{color:#173f2c}</style></head><body><main><small>HUMANISMO EVOLUTIVO · QA</small><h1>Acceso privado</h1><p>Este sitio de revisión está protegido. Introduce la contraseña que te compartieron para continuar.</p>${invalid ? '<p class="error" role="alert">La contraseña no es correcta. Intenta nuevamente.</p>' : ''}${authenticated ? `<p>Este navegador recordará tu acceso hasta por 30 días. Se renovará automáticamente mientras uses QA.</p><p><a href="${escape(next)}">Continuar al sitio</a></p><form action="/qa-access" method="post"><input type="hidden" name="logout" value="1"><button type="submit">Cerrar acceso</button></form>` : `<form action="/qa-access" method="post"><input type="hidden" name="next" value="${escape(next)}"><label for="password">Contraseña de QA</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button type="submit">Entrar al sitio</button></form><p><small>Este navegador recordará tu acceso hasta por 30 días, incluso si lo cierras. El portal educativo conserva su propio inicio de sesión.</small></p>`}</main></body></html>`;
  const response = privateQaResponse(new NextResponse(html, { headers:{'Content-Type':'text/html; charset=utf-8'} }));
  response.headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Native form POSTs need a same-origin Origin header for CSRF validation.
  // no-referrer makes browsers serialize that Origin as null.
  response.headers.set('Referrer-Policy', 'same-origin');
  return response;
}

export async function POST(request: NextRequest) {
  if (!qaGateEnabled()) return new NextResponse(null, { status:404 });
  if (request.headers.get('origin') !== qaRequestOrigin(request) ||
      !request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded') ||
      Number(request.headers.get('content-length')) > 4096) {
    return privateQaResponse(new NextResponse(null, { status:403 }));
  }
  let config;
  try { config = qaGateConfig(); } catch {
    return privateQaResponse(new NextResponse('Acceso de QA no disponible.', {status:503}));
  }
  const body = await request.text();
  if (body.length > 4096) return privateQaResponse(new NextResponse(null, { status:413 }));
  const form = new URLSearchParams(body);
  if (form.get('logout') === '1') {
    const response = privateQaResponse(NextResponse.redirect(new URL('/qa-access', qaRequestOrigin(request)),303));
    response.cookies.set(QA_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
    return response;
  }
  const next = qaReturnPath(form.get('next'));
  if (!validQaPassword(form.get('password') ?? '', config)) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const destination = new URL('/qa-access',qaRequestOrigin(request));
    destination.searchParams.set('error','invalid');
    destination.searchParams.set('next',next);
    return privateQaResponse(NextResponse.redirect(destination,303));
  }
  const response = privateQaResponse(NextResponse.redirect(new URL(next,qaRequestOrigin(request)),303));
  response.cookies.set(QA_COOKIE,createQaSession(new URL(qaRequestOrigin(request)).host,config),{
    httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:QA_SESSION_SECONDS,
  });
  return response;
}
