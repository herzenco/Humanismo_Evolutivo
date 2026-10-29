import Link from 'next/link';
import type { Metadata } from 'next';
import { EN_ENABLED } from '@/lib/release-flags';
import './globals.css';
export const metadata: Metadata = { title: '404 | Humanismo Evolutivo', robots: { index: false, follow: true } };
// Global 404 has no route params, so set lang from the URL before paint.
const ENGLISH_LANG_SCRIPT = "if(/^\\/en(\\/|$)/.test(location.pathname))document.documentElement.lang='en'";
export default function GlobalNotFound() {
  return <html lang="es"><head><script dangerouslySetInnerHTML={{ __html: ENGLISH_LANG_SCRIPT }} /></head><body><main className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-heading">404</h1><p>Página no encontrada / Page not found</p>
    <Link href="/">Inicio</Link>{EN_ENABLED ? <Link href="/en">Home in English</Link> : null}
  </main></body></html>;
}
