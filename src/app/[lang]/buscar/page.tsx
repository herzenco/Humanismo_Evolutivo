import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Buscar en Humanismo Evolutivo' : 'Search Evolutionary Humanism', description: lang === 'es' ? 'Busca libros, podcasts y videos de Marcos Constandse Madrazo.' : 'Search books, podcasts and videos by Marcos Constandse Madrazo.', path: '/buscar', language: lang, index: false });
}
export default function Page() { return <View />; }
