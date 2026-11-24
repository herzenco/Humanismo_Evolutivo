import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Política de privacidad' : 'Privacy policy', description: lang === 'es' ? 'Información sobre el tratamiento y la protección de datos personales en la Fundación Humanismo Evolutivo.' : 'Information about the handling and protection of personal data at the Evolutionary Humanism Foundation.', path: '/privacidad', language: lang, index: true });
}
export default function Page() { return <View />; }
