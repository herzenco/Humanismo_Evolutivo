import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { safeAuthRedirect } from '@/lib/auth'
import { isSupabaseConfigured } from './config'
import { createClient } from './server'

const emailOtpTypes = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  return response
}

export async function handleAuthConfirmation(request: NextRequest) {
  const next = safeAuthRedirect(request.nextUrl.searchParams.get('next'))
  const errorUrl = new URL('/auth', request.url)
  errorUrl.searchParams.set('error', 'confirmation')
  errorUrl.searchParams.set('next', next)

  if (!isSupabaseConfigured) {
    return noStore(NextResponse.redirect(errorUrl, { status: 303 }))
  }

  const code = request.nextUrl.searchParams.get('code')
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const rawType = request.nextUrl.searchParams.get('type')
  const type = emailOtpTypes.has(rawType as EmailOtpType)
    ? (rawType as EmailOtpType)
    : null
  const supabase = await createClient()

  let succeeded = false
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    succeeded = !error
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    succeeded = !error
  }

  if (!succeeded) {
    return noStore(NextResponse.redirect(errorUrl, { status: 303 }))
  }

  return noStore(
    NextResponse.redirect(new URL(next, request.url), { status: 303 }),
  )
}
