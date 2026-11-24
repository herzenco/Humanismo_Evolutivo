import { notFound } from 'next/navigation';
import NewsletterForm from '@/components/layout/NewsletterForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { formatResourceDate } from '@/data/resources';
import { getMagazineArticles, qaResourceReaderConfigured } from '@/lib/qa-resources';
import { newsletterConfig } from '@/lib/newsletter';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

const copy = {
  es: {
    title: 'Boletín de Humanismo Evolutivo',
    description: 'Reflexiones, nuevos contenidos y eventos para seguir evolucionando juntos.',
    archive: 'Ediciones del boletín',
    empty: 'Aún no hay ediciones publicadas.',
    unavailable: 'Las suscripciones no están disponibles por el momento.',
  },
  en: {
    title: 'Evolutionary Humanism Newsletter',
    description: 'Reflections, new content and events to keep growing together.',
    archive: 'Newsletter issues',
    empty: 'There are no published issues yet.',
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
  const { title, description, archive, empty, unavailable } = copy[lang];
  const archiveEnabled = qaResourceReaderConfigured();
  const articles = archiveEnabled ? await getMagazineArticles('boletin') : [];

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
      {archiveEnabled ? (
        <section className="design-content-width design-media-list" aria-labelledby="newsletter-issues">
          <h2 id="newsletter-issues">{archive}</h2>
          {articles.length === 0 ? <p>{empty}</p> : articles.map(article => (
            <article key={article.id} id={article.slug}>
              <header>
                <h3>{article.title}</h3>
                <p>{article.author} · <time dateTime={article.publishedAt}>{formatResourceDate(article.publishedAt)}</time></p>
                <p>{article.excerpt}</p>
              </header>
              {article.design?.images.length ? <div className="newsletter-issue-photos" data-layout={article.design.layout}>
                {article.design.images.map((image, index) => <img key={index} loading="lazy"
                  src={"/api/newsletter-image?path=" + encodeURIComponent(image.path)} alt={image.alt} />)}
              </div> : null}
              <div className="resource-article-body" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
            </article>
          ))}
        </section>
      ) : null}
    </PageWrapper>
  );
}
