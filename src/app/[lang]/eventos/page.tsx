import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Conferencias y eventos' : 'Talks and events', description: lang === 'es' ? 'Explora conferencias, encuentros y presentaciones de Marcos Constandse Madrazo sobre Humanismo Evolutivo y conciencia.' : 'Explore talks, gatherings and presentations by Marcos Constandse Madrazo on Evolutionary Humanism and consciousness.', path: '/eventos', language: lang, index: true });
}
export default function Page() { return <View />; }
