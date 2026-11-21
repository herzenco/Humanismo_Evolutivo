import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Contacto - Fundación Humanismo Evolutivo' : 'Contact - Evolutionary Humanism Foundation', description: lang === 'es' ? 'Contacta a la Fundación Humanismo Evolutivo para pedir información sobre los cursos en Cancún, libros y conferencias, o para colaborar.' : 'Contact the Evolutionary Humanism Foundation to ask about courses in Cancún, books and talks, or to collaborate.', path: '/contacto', language: lang, index: true });
}
export default function Page() { return <View phone={process.env.CONTACT_PUBLIC_PHONE?.trim()} />; }
