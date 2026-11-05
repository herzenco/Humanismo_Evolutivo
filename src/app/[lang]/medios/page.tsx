import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Podcasts y videos de Humanismo Evolutivo' : 'Evolutionary Humanism podcasts and videos', description: lang === 'es' ? 'Escucha episodios y descubre videos sobre conciencia, filosofía transpersonal, ecología y el arte de vivir con sentido.' : 'Listen to episodes and discover videos about consciousness, transpersonal philosophy, ecology and a meaningful life.', path: '/medios', language: lang, index: true });
}
export default function Page() { return <View />; }
