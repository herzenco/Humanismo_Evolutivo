import { type NextRequest } from 'next/server'
import { handleAuthConfirmation } from '@/lib/supabase/confirmation'

export async function GET(request: NextRequest) {
  return handleAuthConfirmation(request)
}
