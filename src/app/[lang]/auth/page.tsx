import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Iniciar sesión' : 'Sign in', description: lang === 'es' ? 'Accede a tu cuenta de Humanismo Evolutivo.' : 'Sign in to your Evolutionary Humanism account.', path: '/auth', language: lang, index: false });
}
export default function Page() { return <View />; }
