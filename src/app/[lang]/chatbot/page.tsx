import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Conversaciones sobre Humanismo Evolutivo' : 'Conversations about Evolutionary Humanism', description: lang === 'es' ? 'Explora preguntas frecuentes sobre la filosofía, los libros y las ideas de Marcos Constandse Madrazo.' : 'Explore frequently asked questions about the philosophy, books and ideas of Marcos Constandse Madrazo.', path: '/chatbot', language: lang, index: true });
}
export default function Page() { return <View />; }
