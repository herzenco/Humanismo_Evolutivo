import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'
import {
  getSupabaseConfig,
  isSupabaseConfigured,
} from '@/lib/supabase/config'

let browserClient: SupabaseClient<Database> | null = null

export { isSupabaseConfigured }

export function getSupabaseClient() {
  const { url, publishableKey } = getSupabaseConfig()

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, publishableKey)
  }

  return browserClient
}

// Keep the original Lovable import path while avoiding build-time env reads.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, property, receiver) {
    return Reflect.get(getSupabaseClient(), property, receiver)
  },
})
