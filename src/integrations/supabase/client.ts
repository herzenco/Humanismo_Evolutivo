import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let browserClient: SupabaseClient<Database> | null = null

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return browserClient
}

// Keep the original Lovable import path while avoiding build-time env reads.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, property, receiver) {
    return Reflect.get(getSupabaseClient(), property, receiver)
  },
})
