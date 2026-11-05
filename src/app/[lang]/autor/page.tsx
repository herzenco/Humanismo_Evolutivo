import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Marcos Constandse Madrazo - Autor y filósofo' : 'Marcos Constandse Madrazo - Author and philosopher', description: lang === 'es' ? 'Conoce la trayectoria de Marcos Constandse Madrazo y su visión del Humanismo Evolutivo, la conciencia y nuestra conexión con la naturaleza.' : 'Discover Marcos Constandse Madrazo and his vision of Evolutionary Humanism, consciousness and our connection with nature.', path: '/autor', language: lang, index: true });
}
export default function Page() { return <View />; }
