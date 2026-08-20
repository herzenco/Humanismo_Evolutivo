import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .email('Escribe un correo electrónico válido.')
  .max(255, 'El correo electrónico es demasiado largo.')
  .transform((value) => value.toLowerCase())

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .max(128, 'La contraseña es demasiado larga.')

const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(80, `${label} es demasiado largo.`)

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Escribe tu contraseña.')
    .max(128, 'La contraseña es demasiado larga.'),
  next: z.string().optional(),
})

export const signUpSchema = z
  .object({
    firstName: nameSchema('El nombre'),
    lastName: nameSchema('El apellido'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    next: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export type AuthActionState = {
  status: 'idle' | 'error' | 'confirmation'
  message?: string
  values?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

export const initialAuthActionState: AuthActionState = { status: 'idle' }

export function isEmailAccountClaims(
  claims: unknown,
): claims is { email: string; is_anonymous?: false; user_metadata?: Record<string, unknown> } {
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) return false

  const record = claims as Record<string, unknown>
  return (
    record.is_anonymous !== true &&
    typeof record.email === 'string' &&
    emailSchema.safeParse(record.email).success
  )
}

export function safeAuthRedirect(value: unknown, fallback = '/portal') {
  if (typeof value !== 'string' || !value.startsWith('/')) return fallback

  try {
    const base = new URL('https://humanismo.local')
    const target = new URL(value, base)
    const allowedPath =
      target.pathname === '/portal' ||
      target.pathname.startsWith('/portal/') ||
      target.pathname === '/admin' ||
      target.pathname.startsWith('/admin/')

    if (target.origin !== base.origin || !allowedPath) return fallback
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return fallback
  }
}

export function authErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'El correo o la contraseña no coinciden.'
  }
  if (message.includes('email not confirmed')) {
    return 'Confirma tu correo electrónico antes de iniciar sesión.'
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'Elige una contraseña más segura.'
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Hiciste demasiados intentos. Espera unos minutos y vuelve a intentar.'
  }
  if (message.includes('signup') && message.includes('disabled')) {
    return 'El registro no está disponible en este momento.'
  }

  return 'No pudimos completar la solicitud. Intenta nuevamente.'
}
