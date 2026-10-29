import { qaGateResponse, privateQaResponse, rememberQaAccess } from '@/lib/qa-gate-response'
import { qaGateEnabled } from '@/lib/qa-gate'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isEmailAccountClaims } from '@/lib/auth'
import { EN_ENABLED, PORTAL_ENABLED, englishRedirectTarget, isPortalEntryPath } from '@/lib/release-flags'
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config'
import { SITE_URL } from './lib/site'

const legacyHosts = new Set([
  'yosoynosotros.org',
  'www.yosoynosotros.org',
  'yosoynosotros.com',
  'www.yosoynosotros.com',
  'www.humanismoevolutivo.com',
])
const authRoute = /^\/(?:(?:en|es)\/)?(auth|portal|admin)(\/|$)/

function copyAuthState(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options)
  })

  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = source.headers.get(header)
    if (value) target.headers.set(header, value)
  }

  return target
}

async function authProxy(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request })
  }

  const { url, publishableKey } = getSupabaseConfig()
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
        Object.entries(headers).forEach(([name, value]) =>
          supabaseResponse.headers.set(name, value),
        )
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const pathname = request.nextUrl.pathname
  const isProtectedRoute = /^\/(?:(?:en|es)\/)?(portal|admin)(\/|$)/.test(pathname)

  if (!isEmailAccountClaims(data?.claims) && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
    return copyAuthState(supabaseResponse, NextResponse.redirect(redirectUrl))
  }

  return supabaseResponse
}

function finish(request: NextRequest, response: NextResponse) {
  return qaGateEnabled() ? rememberQaAccess(request, privateQaResponse(response)) : response
}

export async function proxy(request: NextRequest) {
  const blocked = qaGateResponse(request)
  if (blocked) return blocked

  const { pathname, hostname } = request.nextUrl
  if (legacyHosts.has(hostname)) {
    const canonical = new URL(pathname + request.nextUrl.search, SITE_URL)
    return NextResponse.redirect(canonical, 308)
  }

  // Locale rewrites live in next.config so this proxy does not run twice and drop the QA cookie.
  if (!EN_ENABLED) {
    const target = englishRedirectTarget(pathname)
    if (target) {
      const url = request.nextUrl.clone()
      url.pathname = target.pathname
      if (target.fallback) url.search = ''
      return finish(request, NextResponse.redirect(url, 308))
    }
  }

  // Hide portal and auth before the session proxy can send visitors to sign-in.
  // Route layouts also call notFound() if a request reaches the segment.
  if (!PORTAL_ENABLED && isPortalEntryPath(pathname)) {
    return finish(request, new NextResponse(null, {
      status: 404,
      headers: { 'x-robots-tag': 'noindex', 'content-type': 'text/plain; charset=utf-8' },
    }))
  }

  const response = authRoute.test(pathname) ? await authProxy(request) : NextResponse.next({ request })
  return finish(request, response)
}

export const config = { matcher: ['/:path*'] }
