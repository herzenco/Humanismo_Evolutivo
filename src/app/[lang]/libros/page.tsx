import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Libros de Marcos Constandse Madrazo' : 'Books by Marcos Constandse Madrazo', description: lang === 'es' ? 'Descubre y descarga libros de filosofía, espiritualidad y ecología de Marcos Constandse Madrazo, incluido Yo soy nosotros.' : 'Discover and download books on philosophy, spirituality and ecology by Marcos Constandse Madrazo, including I Am Us.', path: '/libros', language: lang, index: true });
}
export default function Page() { return <View />; }
