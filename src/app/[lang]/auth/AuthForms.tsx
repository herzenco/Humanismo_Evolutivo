'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { signInAction, signUpAction } from './actions'
import { initialAuthActionState, type AuthActionState } from '@/lib/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type AuthFormsProps = {
  configured: boolean
  defaultMode: 'signin' | 'signup'
  next: string
  pageMessage?: { tone: 'success' | 'error'; title: string; description: string }
}

function SubmitButton({ idleLabel, disabled }: { idleLabel: string; disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" size="lg" disabled={disabled || pending}>
      {pending ? 'Procesando…' : idleLabel}
    </Button>
  )
}

function FormNotice({ state }: { state: AuthActionState }) {
  if (!state.message || state.status === 'idle') return null

  const success = state.status === 'confirmation'
  return (
    <Alert
      variant={success ? 'default' : 'destructive'}
      className={success ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : undefined}
    >
      {success && <CheckCircle2 className="h-4 w-4" />}
      <AlertTitle>{success ? 'Revisa tu correo' : 'No pudimos continuar'}</AlertTitle>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  )
}

export function AuthForms({ configured, defaultMode, next, pageMessage }: AuthFormsProps) {
  const [signInState, signInFormAction] = useActionState(
    signInAction,
    initialAuthActionState,
  )
  const [signUpState, signUpFormAction] = useActionState(
    signUpAction,
    initialAuthActionState,
  )

  return (
    <div className="space-y-6">
      {pageMessage && (
        <Alert
          variant={pageMessage.tone === 'error' ? 'destructive' : 'default'}
          className={
            pageMessage.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
              : undefined
          }
        >
          {pageMessage.tone === 'success' && <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{pageMessage.title}</AlertTitle>
          <AlertDescription>{pageMessage.description}</AlertDescription>
        </Alert>
      )}

      {!configured && (
        <Alert variant="destructive">
          <AlertTitle>Portal no configurado</AlertTitle>
          <AlertDescription>
            La conexión segura del portal no está disponible en este entorno.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={defaultMode} className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-primary/5 p-1">
          <TabsTrigger value="signin" className="rounded-lg">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="signup" className="rounded-lg">Crear cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-6">
          <form action={signInFormAction} className="space-y-5">
            <input type="hidden" name="next" value={next} />
            <FormNotice state={signInState} />
            <div className="space-y-2">
              <Label htmlFor="signin-email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="signin-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="tu@email.com" defaultValue={signInState.values?.email} className="h-11 pl-10" required disabled={!configured} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Contraseña</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="signin-password" name="password" type="password" autoComplete="current-password" className="h-11 pl-10" required disabled={!configured} />
              </div>
            </div>
            <SubmitButton idleLabel="Entrar al portal" disabled={!configured} />
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <form action={signUpFormAction} className="space-y-5">
            <input type="hidden" name="next" value={next} />
            <FormNotice state={signUpState} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="signup-first-name">Nombre</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="signup-first-name" name="firstName" autoComplete="given-name" defaultValue={signUpState.values?.firstName} className="h-11 pl-10" maxLength={80} required disabled={!configured} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-last-name">Apellido</Label>
                <Input id="signup-last-name" name="lastName" autoComplete="family-name" defaultValue={signUpState.values?.lastName} className="h-11" maxLength={80} required disabled={!configured} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="signup-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="tu@email.com" defaultValue={signUpState.values?.email} className="h-11 pl-10" maxLength={255} required disabled={!configured} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Contraseña</Label>
              <Input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} className="h-11" aria-describedby="password-help" required disabled={!configured} />
              <p id="password-help" className="text-xs text-muted-foreground">Usa al menos 8 caracteres.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirmar contraseña</Label>
              <Input id="signup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} className="h-11" required disabled={!configured} />
            </div>
            <SubmitButton idleLabel="Crear mi cuenta" disabled={!configured} />
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Al crear tu cuenta podrás acceder al portal educativo. Tu contenido estará disponible cuando abramos la biblioteca.
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
