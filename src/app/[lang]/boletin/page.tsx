import { notFound } from 'next/navigation';
import NewsletterForm from '@/components/layout/NewsletterForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { newsletterConfig } from '@/lib/newsletter';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

const copy = {
  es: {
    title: 'Boletín de Humanismo Evolutivo',
    description: 'Reflexiones, nuevos contenidos y eventos para seguir evolucionando juntos.',
    unavailable: 'Las suscripciones no están disponibles por el momento.',
  },
  en: {
    title: 'Evolutionary Humanism Newsletter',
    description: 'Reflections, new content and events to keep growing together.',
    unavailable: 'Subscriptions are currently unavailable.',
  },
};

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const { title, description } = copy[lang];
  return pageMetadata({ title, description, path: '/boletin', language: lang });
}

export default async function NewsletterPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const { title, description, unavailable } = copy[lang];

  return (
    <PageWrapper showFooterNewsletter={false}>
      <div className="newsletter-page">
        <section className="site-newsletter" aria-labelledby="newsletter-title">
          <div>
            <h1 id="newsletter-title" className="font-heading">{title}</h1>
            <p>{description}</p>
          </div>
          {newsletterConfig(process.env) ? <NewsletterForm es={lang === 'es'} /> : <p>{unavailable}</p>}
        </section>
      </div>
    </PageWrapper>
  );
}
