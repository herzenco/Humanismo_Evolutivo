import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Humanismo Evolutivo - Marcos Constandse Madrazo' : 'Evolutionary Humanism - Marcos Constandse Madrazo', description: lang === 'es' ? 'Explora los libros, podcasts y la filosofía transpersonal de Marcos Constandse Madrazo: conciencia, espiritualidad, ecología y humanidad.' : 'Explore books, podcasts and the transpersonal philosophy of Marcos Constandse Madrazo: consciousness, spirituality, ecology and humanity.', path: '/', language: lang, index: true });
}
export default function Page() { return <View />; }
