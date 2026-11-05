import test from 'node:test'
import assert from 'node:assert/strict'
import { EN_ENABLED, PORTAL_ENABLED, englishRedirectTarget, hreflangLanguages, isPortalEntryPath } from '../src/lib/release-flags.ts'

test('portal and English default off', () => {
  assert.equal(PORTAL_ENABLED, false)
  assert.equal(EN_ENABLED, false)
})

test('English paths redirect to the Spanish path or home', () => {
  assert.deepEqual(englishRedirectTarget('/en', false), { pathname: '/', fallback: false })
  assert.deepEqual(englishRedirectTarget('/en/libros/x', false), { pathname: '/libros/x', fallback: false })
  assert.deepEqual(englishRedirectTarget('/en/libros', false), { pathname: '/libros', fallback: false })
  assert.deepEqual(englishRedirectTarget('/en/51preguntas/pregunta_1', false), { pathname: '/51preguntas/pregunta_1', fallback: false })
  assert.deepEqual(englishRedirectTarget('/en/resources/nota', false), { pathname: '/resources/nota', fallback: false })
  assert.deepEqual(englishRedirectTarget('/en/missing', false), { pathname: '/', fallback: true })
  assert.deepEqual(englishRedirectTarget('/en/auth', false), { pathname: '/', fallback: true })
  assert.deepEqual(englishRedirectTarget('/en/portal/cursos/a', false), { pathname: '/', fallback: true })
  assert.deepEqual(englishRedirectTarget('/en/auth', true), { pathname: '/auth', fallback: false })
  assert.equal(englishRedirectTarget('/libros'), null)
  assert.equal(englishRedirectTarget('/english'), null)
})

test('portal and auth paths are recognized without matching the public site', () => {
  for (const path of ['/portal', '/portal/cursos/a/clases/1', '/auth', '/auth/callback', '/es/auth', '/en/portal']) {
    assert.equal(isPortalEntryPath(path), true, path)
  }
  for (const path of ['/', '/libros', '/autor', '/api/contact']) {
    assert.equal(isPortalEntryPath(path), false, path)
  }
})

test('hreflang keeps Spanish and drops the English alternate while English is off', () => {
  const es = 'https://humanismoevolutivo.com/libros/yo-soy-nosotros'
  const en = 'https://humanismoevolutivo.com/en/libros/yo-soy-nosotros'
  const hidden = hreflangLanguages(es, en, false)
  assert.deepEqual(Object.keys(hidden), ['es', 'x-default'])
  assert.equal(hidden.en, undefined)
  assert.equal(hidden.es, es)
  assert.equal(hidden['x-default'], es)
  const shown = hreflangLanguages('https://humanismoevolutivo.com/autor', 'https://humanismoevolutivo.com/en/autor', true)
  assert.equal(shown.en, 'https://humanismoevolutivo.com/en/autor')
  assert.equal(shown.es, 'https://humanismoevolutivo.com/autor')
})
