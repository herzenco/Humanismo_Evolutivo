'use server'

import { registerAccount } from '@/lib/register-account'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  authErrorMessage,
  type AuthActionState,
  safeAuthRedirect,
  signInSchema,
  signUpSchema,
} from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

function formValue(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function firstValidationMessage(issues: { message: string }[]) {
  return issues[0]?.message ?? 'Revisa los datos e intenta nuevamente.'
}

async function getSiteOrigin() {
  const requestHeaders = await headers()
  const requestOrigin = requestHeaders.get('origin')

  if (requestOrigin) {
    try {
      const parsed = new URL(requestOrigin)
      if (
        ['localhost', '127.0.0.1'].includes(parsed.hostname) &&
        ['http:', 'https:'].includes(parsed.protocol)
      ) {
        return parsed.origin
      }
    } catch {
      // Fall through to the configured public site URL.
    }
  }

  for (const candidate of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
  ]) {
    if (!candidate) continue
    try {
      const parsed = new URL(candidate)
      if (['http:', 'https:'].includes(parsed.protocol)) return parsed.origin
    } catch {
      // Try the next source.
    }
  }

  throw new Error('The site origin is not configured')
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = { email: formValue(formData, 'email') }
  const parsed = signInSchema.safeParse({
    ...values,
    password: formValue(formData, 'password'),
    next: formValue(formData, 'next'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: firstValidationMessage(parsed.error.issues),
      values,
    }
  }

  if (!isSupabaseConfigured) {
    return {
      status: 'error',
      message: 'El portal todavía no está configurado en este entorno.',
      values,
    }
  }

  const next = safeAuthRedirect(parsed.data.next)
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return { status: 'error', message: authErrorMessage(error), values }
    }
  } catch (error) {
    return { status: 'error', message: authErrorMessage(error), values }
  }

  revalidatePath('/', 'layout')
  redirect(next)
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = {
    firstName: formValue(formData, 'firstName'),
    lastName: formValue(formData, 'lastName'),
    email: formValue(formData, 'email'),
  }
  const parsed = signUpSchema.safeParse({
    ...values,
    password: formValue(formData, 'password'),
    confirmPassword: formValue(formData, 'confirmPassword'),
    next: formValue(formData, 'next'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: firstValidationMessage(parsed.error.issues),
      values,
    }
  }

  if (!isSupabaseConfigured) {
    return {
      status: 'error',
      message: 'El portal todavía no está configurado en este entorno.',
      values,
    }
  }

  const next = safeAuthRedirect(parsed.data.next)
  let hasSession = false

  try {
    const origin = await getSiteOrigin()

    const supabase = await createClient()
    const { data, error } = await registerAccount(supabase.auth, parsed.data, origin, next)

    if (error) {
      // Codes only: never log credentials, email, metadata, or Auth response bodies.
      console.error('portal_signup_failed', { code: error.code, status: error.status })
      return { status: 'error', message: authErrorMessage(error), values }
    }

    hasSession = Boolean(data.session)
  } catch (error) {
    return { status: 'error', message: authErrorMessage(error), values }
  }

  if (hasSession) {
    revalidatePath('/', 'layout')
    redirect(next)
  }

  return {
    status: 'confirmation',
    message:
      'Te enviamos un enlace de confirmación. Ábrelo desde tu correo para activar la cuenta y entrar al portal.',
    values,
  }
}
