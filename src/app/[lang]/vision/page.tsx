import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Nuestra visión del Humanismo Evolutivo' : 'Our vision of Evolutionary Humanism', description: lang === 'es' ? 'Conoce nuestra visión transpersonal: ciencia, espiritualidad y ecología para una humanidad consciente e interconectada.' : 'Discover our transpersonal vision: science, spirituality and ecology for a conscious, interconnected humanity.', path: '/vision', language: lang, index: true });
}
export default function Page() { return <View />; }
