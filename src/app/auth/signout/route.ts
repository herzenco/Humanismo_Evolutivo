import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut({ scope: 'local' })
    } catch {
      // Cookie cleanup below still signs this browser out during an outage.
    }
  }

  cookieStore.getAll().forEach(({ name }) => {
    if (/^sb-[a-z0-9]+-auth-token(?:-code-verifier|\.\d+)?$/i.test(name)) {
      cookieStore.set(name, '', { path: '/', maxAge: 0 })
    }
  })

  revalidatePath('/', 'layout')
  const redirectUrl = new URL('/auth', request.url)
  redirectUrl.searchParams.set('signedOut', '1')
  return NextResponse.redirect(redirectUrl, { status: 303 })
}
