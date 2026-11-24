import { notFound } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { formatResourceDate } from '@/data/resources';
import { getMagazineArticles, qaResourceReaderConfigured } from '@/lib/qa-resources';
import { isLanguage } from '@/lib/site';

export default async function NewsletterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang) || !qaResourceReaderConfigured()) notFound();
  const articles = await getMagazineArticles('boletin');
  const es = lang === 'es';

  return <PageWrapper>
    <section className="design-content-width design-media-list">
      <h1>{es ? 'Boletín' : 'Newsletter'}</h1>
      {articles.length === 0
        ? <p>{es ? 'Aún no hay ediciones publicadas.' : 'There are no published issues yet.'}</p>
        : articles.map(article => <article key={article.id} id={article.slug}>
          <header>
            <h2>{article.title}</h2>
            <p>{article.author} · <time dateTime={article.publishedAt}>{formatResourceDate(article.publishedAt)}</time></p>
            <p>{article.excerpt}</p>
          </header>
          <div className="resource-article-body" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
        </article>)}
    </section>
  </PageWrapper>;
}
