import { qaGateResponse, privateQaResponse, rememberQaAccess } from '@/lib/qa-gate-response'
import { qaGateEnabled } from '@/lib/qa-gate'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isEmailAccountClaims } from '@/lib/auth'
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config'
import { SITE_URL } from './lib/site'

const legacyHosts = new Set([
  'yosoynosotros.org',
  'www.yosoynosotros.org',
  'yosoynosotros.com',
  'www.yosoynosotros.com',
  'www.humanismoevolutivo.com',
])
const unlocalized = /^\/(portal|resources|51preguntas|qa-access)(\/|$)/
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

  if (pathname === '/es' || pathname.startsWith('/es/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return finish(request, NextResponse.redirect(url, 308))
  }

  const isFile = /\.[^/]+$/.test(pathname)
  const skipLocale = isFile || pathname.startsWith('/api') || pathname.startsWith('/_next') || unlocalized.test(pathname) || pathname === '/en' || pathname.startsWith('/en/')
  const needsAuth = authRoute.test(pathname)

  if (skipLocale) {
    const response = needsAuth ? await authProxy(request) : NextResponse.next({ request })
    return finish(request, response)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/es${pathname === '/' ? '' : pathname}`
  const rewritten = NextResponse.rewrite(url)
  if (!needsAuth) return finish(request, rewritten)
  const authed = await authProxy(request)
  if (authed.headers.get('location')) return finish(request, authed)
  return finish(request, copyAuthState(authed, rewritten))
}

export const config = { matcher: ['/:path*'] }
