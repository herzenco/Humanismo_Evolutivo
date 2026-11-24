import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '404 | Humanismo Evolutivo', robots: { index: false, follow: true } };
export default function GlobalNotFound() {
  return <html lang="es"><body><main className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-heading">404</h1><p>Página no encontrada / Page not found</p>
    <Link href="/">Inicio</Link><Link href="/en">Home in English</Link>
  </main></body></html>;
}
