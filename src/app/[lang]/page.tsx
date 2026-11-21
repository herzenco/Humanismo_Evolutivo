import { notFound } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, SITE_NAME, isLanguage } from '@/lib/site';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Humanismo Evolutivo - Marcos Constandse Madrazo' : 'Evolutionary Humanism - Marcos Constandse Madrazo', description: lang === 'es' ? 'Explora los libros, podcasts y la filosofía transpersonal de Marcos Constandse Madrazo: conciencia, espiritualidad, ecología y humanidad.' : 'Explore books, podcasts and the transpersonal philosophy of Marcos Constandse Madrazo: consciousness, spirituality, ecology and humanity.', path: '/', language: lang, index: true });
}
export default function Page() {
  const url = absoluteUrl('/');
  return <>
    <JsonLd data={{
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', '@id': `${url}#website`, url, name: SITE_NAME, publisher: { '@id': `${url}#fundacion` } },
        { '@type': 'Organization', '@id': `${url}#fundacion`, url, name: 'Fundación Humanismo Evolutivo' },
      ],
    }} />
    <View />
  </>;
}
