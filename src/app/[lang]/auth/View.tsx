import { redirect } from 'next/navigation'
import { BookOpenCheck, LibraryBig, Sparkles } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import { isEmailAccountClaims, safeAuthRedirect } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { AuthForms } from './AuthForms'

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function singleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams
  const next = safeAuthRedirect(singleValue(params.next))
  const defaultMode = singleValue(params.mode) === 'signup' ? 'signup' : 'signin'

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (isEmailAccountClaims(data?.claims)) redirect(next)
  }

  const pageMessage = singleValue(params.error)
    ? {
        tone: 'error' as const,
        title: 'No pudimos confirmar tu cuenta',
        description:
          'El enlace venció o ya fue utilizado. Intenta iniciar sesión o crea la cuenta nuevamente.',
      }
    : singleValue(params.signedOut)
      ? {
          tone: 'success' as const,
          title: 'Sesión cerrada',
          description: 'Tu sesión se cerró correctamente.',
        }
      : undefined

  return (
    <PageWrapper>
      <section className="design-auth-section">
        <div className="design-auth-layout">
          <div className="design-auth-intro"><span className="design-eyebrow">PORTAL EDUCATIVO</span><h1>Un espacio para <em>seguir evolucionando</em></h1><p>La conciencia crece cuando compartimos el conocimiento. Entra a tu espacio de aprendizaje y continúa el camino.</p><div className="design-auth-benefits"><p><BookOpenCheck size={22} />Explora nuevas perspectivas</p><p><LibraryBig size={22} />Todo tu aprendizaje en un lugar</p><p><Sparkles size={22} />A tu propio ritmo</p></div></div>
          <div className="design-auth-card"><span className="design-eyebrow">BIENVENIDO A TU ESPACIO</span><h2>{defaultMode === 'signup' ? 'Crea tu cuenta' : 'Nos alegra verte aquí'}</h2><p>Comienza o continúa tu camino de aprendizaje.</p><AuthForms configured={isSupabaseConfigured} defaultMode={defaultMode} next={next} pageMessage={pageMessage} /></div>
        </div>
      </section>
    </PageWrapper>
  )
}
