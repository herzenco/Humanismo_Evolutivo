import { notFound } from 'next/navigation'
import { PORTAL_ENABLED } from '@/lib/release-flags'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!PORTAL_ENABLED) notFound()
  return children
}
