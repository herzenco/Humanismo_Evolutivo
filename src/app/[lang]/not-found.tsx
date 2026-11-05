"use client";
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/contexts/LanguageContext';
export default function NotFound() {
  const { language } = useLanguage();
  return <main className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-heading">404</h1>
    <p>{language === 'es' ? 'Página no encontrada' : 'Page not found'}</p>
    <Link href="/">{language === 'es' ? 'Volver al inicio' : 'Return home'}</Link>
  </main>;
}
