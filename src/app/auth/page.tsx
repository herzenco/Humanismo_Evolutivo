import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BookOpenCheck, LibraryBig, Sparkles } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import { Card, CardContent } from '@/components/ui/card'
import { isEmailAccountClaims, safeAuthRedirect } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { AuthForms } from './AuthForms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Acceso al portal educativo',
  description: 'Inicia sesión o crea tu cuenta para entrar al portal educativo.',
  robots: { index: false, follow: false },
}

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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-14 sm:py-20">
        <div className="pointer-events-none absolute -left-32 top-8 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div className="max-w-xl text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-gold-dark" />
              Un espacio para aprender y profundizar
            </div>
            <h1 className="text-balance font-heading text-5xl font-medium leading-[0.98] text-primary sm:text-6xl">
              Portal educativo
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-muted-foreground lg:mx-0">
              Crea tu cuenta para entrar a la futura biblioteca de Humanismo Evolutivo
              Transpersonal.
            </p>

            <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:max-w-lg">
              <div className="flex items-start gap-3 rounded-2xl border bg-white/70 p-4 shadow-sm">
                <LibraryBig className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                <div>
                  <p className="font-medium text-primary">Todo en un lugar</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Libros, artículos, videos y podcasts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border bg-white/70 p-4 shadow-sm">
                <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                <div>
                  <p className="font-medium text-primary">Acceso personal</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tu biblioteca protegida por una cuenta segura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-primary/10 bg-white/95 shadow-2xl shadow-primary/10 backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <p className="font-heading text-3xl font-medium text-primary">Bienvenido</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Inicia sesión o registra una cuenta nueva en menos de un minuto.
                </p>
              </div>
              <AuthForms
                configured={isSupabaseConfigured}
                defaultMode={defaultMode}
                next={next}
                pageMessage={pageMessage}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </PageWrapper>
  )
}
