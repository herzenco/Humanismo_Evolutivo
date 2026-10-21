import { qaGateResponse, privateQaResponse } from '@/lib/qa-gate-response'
import { qaGateEnabled } from '@/lib/qa-gate'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isEmailAccountClaims } from '@/lib/auth'
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config'

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

  // Keep this immediately after client creation so token refreshes remain reliable.
  const { data } = await supabase.auth.getClaims()
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/portal') ||
    request.nextUrl.pathname.startsWith('/admin')

  if (!isEmailAccountClaims(data?.claims) && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.search = ''
    redirectUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )

    return copyAuthState(
      supabaseResponse,
      NextResponse.redirect(redirectUrl),
    )
  }

  return supabaseResponse
}

export async function proxy(request: NextRequest) {
  const blocked = qaGateResponse(request)
  if (blocked) return blocked
  const authRoute = /^\/(auth|portal|admin)(\/|$)/.test(request.nextUrl.pathname)
  const response = authRoute ? await authProxy(request) : NextResponse.next({ request })
  return qaGateEnabled() ? privateQaResponse(response) : response
}

// No extension/API exclusions: QA pages, RSC, images and downloads all require access.
export const config = { matcher: ['/:path*'] }
