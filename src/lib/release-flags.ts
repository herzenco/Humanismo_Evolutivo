/**
 * Spanish-only release switches. Both default off so the portal and English
 * stay hidden until a later deploy sets the matching variable to "true".
 * The underlying pages, copy, and routes stay in the codebase.
 */
export const PORTAL_ENABLED =
  process.env.NEXT_PUBLIC_PORTAL_ENABLED === 'true' || process.env.NEXT_PUBLIC_PORTAL_ENABLED === '1'

export const EN_ENABLED =
  process.env.NEXT_PUBLIC_EN_ENABLED === 'true' || process.env.NEXT_PUBLIC_EN_ENABLED === '1'

/** Public Spanish sections. Mirrors the locale rewrites in next.config.ts, plus /resources. */
const SPANISH_ROOTS = new Set([
  'autor',
  'libros',
  'medios',
  'eventos',
  'contacto',
  'vision',
  'privacidad',
  'terminos',
  'buscar',
  'chatbot',
  'video',
  '51preguntas',
  'resources',
])

export type EnglishRedirect = { pathname: string; fallback: boolean }

/** Map /en and /en/* onto the Spanish path, or / when that path is not public. */
export function englishRedirectTarget(pathname: string, portalEnabled = PORTAL_ENABLED): EnglishRedirect | null {
  let rest: string | null = null
  if (pathname === '/en') rest = '/'
  else if (pathname.startsWith('/en/')) rest = pathname.slice(3) || '/'
  else return null

  if (rest === '/') return { pathname: '/', fallback: false }
  const root = rest.split('/')[1] ?? ''
  const allowed = SPANISH_ROOTS.has(root) || (portalEnabled && (root === 'auth' || root === 'portal'))
  if (!allowed || !rest.startsWith('/')) return { pathname: '/', fallback: true }
  return { pathname: rest, fallback: false }
}

export function isPortalEntryPath(pathname: string) {
  return /^\/(?:(?:en|es)\/)?(auth|portal)(\/|$)/.test(pathname)
}

export function hreflangLanguages(esUrl: string, enUrl: string, englishEnabled = EN_ENABLED) {
  if (!englishEnabled) return { es: esUrl, 'x-default': esUrl }
  return { es: esUrl, en: enUrl, 'x-default': esUrl }
}
