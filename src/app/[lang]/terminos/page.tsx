import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Términos y condiciones de uso' : 'Terms and conditions', description: lang === 'es' ? 'Consulta los términos y condiciones de uso del sitio de la Fundación Humanismo Evolutivo.' : 'Read the terms and conditions for using the Evolutionary Humanism Foundation website.', path: '/terminos', language: lang, index: true });
}
export default function Page() { return <View />; }
