import assert from 'node:assert/strict'
import test from 'node:test'
import {
  authErrorMessage,
  isEmailAccountClaims,
  safeAuthRedirect,
  signInSchema,
  signUpSchema,
} from '../src/lib/auth.ts'

test('accepts only non-anonymous accounts with a valid email claim', () => {
  assert.equal(
    isEmailAccountClaims({ email: 'person@example.com', is_anonymous: false }),
    true,
  )
  assert.equal(
    isEmailAccountClaims({ email: 'person@example.com', is_anonymous: true }),
    false,
  )
  assert.equal(isEmailAccountClaims({ email: '' }), false)
  assert.equal(isEmailAccountClaims({ sub: 'user-without-email' }), false)
})

test('allows only portal and admin return paths', () => {
  assert.equal(safeAuthRedirect('/portal'), '/portal')
  assert.equal(safeAuthRedirect('/portal/library?tab=books'), '/portal/library?tab=books')
  assert.equal(safeAuthRedirect('/admin?section=content'), '/admin?section=content')
  assert.equal(safeAuthRedirect('/resources'), '/portal')
  assert.equal(safeAuthRedirect('//evil.example/portal'), '/portal')
  assert.equal(safeAuthRedirect('/\\evil.example/portal'), '/portal')
  assert.equal(safeAuthRedirect('https://evil.example/portal'), '/portal')
})

test('normalizes sign-in emails and requires a password', () => {
  const result = signInSchema.parse({
    email: '  PERSON@EXAMPLE.COM ',
    password: 'secret',
    next: '/portal',
  })

  assert.equal(result.email, 'person@example.com')
  assert.throws(() => signInSchema.parse({ email: 'not-an-email', password: '' }))
})

test('validates the complete portal registration payload', () => {
  const result = signUpSchema.parse({
    firstName: '  Ana ',
    lastName: ' Pérez  ',
    email: 'ANA@EXAMPLE.COM',
    password: 'a secure password',
    confirmPassword: 'a secure password',
    next: '/portal',
  })

  assert.equal(result.firstName, 'Ana')
  assert.equal(result.lastName, 'Pérez')
  assert.equal(result.email, 'ana@example.com')
  assert.throws(() =>
    signUpSchema.parse({
      firstName: 'Ana',
      lastName: 'Pérez',
      email: 'ana@example.com',
      password: 'password one',
      confirmPassword: 'password two',
    }),
  )
})

test('returns non-enumerating Spanish authentication errors', () => {
  assert.equal(
    authErrorMessage(new Error('Invalid login credentials')),
    'El correo o la contraseña no coinciden.',
  )
  assert.equal(
    authErrorMessage(new Error('Unexpected internal detail')),
    'No pudimos completar la solicitud. Intenta nuevamente.',
  )
})
