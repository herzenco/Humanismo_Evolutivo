import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Contacto — Fundación Humanismo Evolutivo' : 'Contact — Evolutionary Humanism Foundation', description: lang === 'es' ? 'Contacta a la Fundación Humanismo Evolutivo para conocer sus actividades, colaborar o solicitar información sobre libros y conferencias.' : 'Contact the Evolutionary Humanism Foundation to learn about its activities, collaborate or ask about books and talks.', path: '/contacto', language: lang, index: true });
}
export default function Page() { return <View />; }
