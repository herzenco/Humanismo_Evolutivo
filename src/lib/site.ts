export const SITE_URL = 'https://www.humanismoevolutivo.com';
export const SITE_NAME = 'Humanismo Evolutivo';
export type Language = 'es' | 'en';
export const languages: Language[] = ['es', 'en'];
export function isLanguage(value: string): value is Language {
  return value === 'es' || value === 'en';
}
export function unlocalizedPath(path: string) {
  return path.replace(/^\/(en|es)(?=\/|\?|#|$)/, '') || '/';
}
export function localizedPath(path: string, language: Language) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const clean = unlocalizedPath(path);
  return language === 'en' ? `/en${clean === '/' ? '' : clean}` : clean;
}
export function absoluteUrl(path: string, language: Language = 'es') {
  return new URL(localizedPath(path, language), SITE_URL).href.replace(/\/$/, '');
}
