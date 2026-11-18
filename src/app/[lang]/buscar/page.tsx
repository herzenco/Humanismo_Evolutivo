import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Buscar contenido' : 'Search content', description: lang === 'es' ? 'Busca libros, podcasts y videos de Marcos Constandse Madrazo.' : 'Search books, podcasts and videos by Marcos Constandse Madrazo.', path: '/buscar', language: lang, index: false });
}
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q) ?? '';
  return <View key={query} query={query} />;
}
