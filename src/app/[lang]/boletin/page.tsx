import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import styles from './newsletter.module.css';
import { notFound } from 'next/navigation';
import NewsletterForm from '@/components/layout/NewsletterForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { formatResourceDate } from '@/data/resources';
import { copy, editionsByMonth, editionSlug, monthLabel } from './editions';
import { newsletterConfig } from '@/lib/newsletter';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

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
  const content = copy[lang];
  const editions = await editionsByMonth();

  return (
    <PageWrapper showFooterNewsletter={false}>
      <header className={styles.masthead}>
        <p>{content.monthly}</p>
        <h1 className="font-heading">{content.title}</h1>
        <div>{content.description}</div>
      </header>
      <section className={styles.archive} aria-labelledby="newsletter-issues">
        <div className={styles.index}>
          <h2 id="newsletter-issues" className="font-heading">{content.archive}</h2>
          <ul>
            {editions.map(([month]) => <li key={month}><Link href={`/boletin/${editionSlug(month, lang)}`}>{monthLabel(month, lang)}</Link></li>)}
          </ul>
        </div>
        {editions.map(([month, articles]) => (
          <section key={month} id={`edicion-${month}`} className={styles.month} aria-labelledby={`month-${month}`}>
            <h3 id={`month-${month}`}><time dateTime={month}>{monthLabel(month, lang)}</time></h3>
            {articles.length === 0 ? (
              <article className={styles.feature}>
                <div className={styles.cover}>
                  <Image src="/design/jardin-evolucion-panorama.webp" fill sizes="(max-width: 720px) 100vw, 1080px" alt={lang === 'es' ? 'Muro de mosaicos del Jardín de la Evolución' : 'Mosaic wall at the Garden of Evolution'} />
                </div>
                <div className={styles.editorial}>
                  <h4 className="font-heading">{content.subject}</h4>
                  <p className={styles.lead}>{content.intro}</p>
                  <div className={styles.links}>
                    <Link href={`/boletin/${editionSlug(month, lang)}`}>{content.read}</Link>
                  </div>
                </div>
              </article>
            ) : null}
            {articles.map(article => (
              <article className={styles.managed} key={article.id} id={article.slug}>
                <header>
                  <h4 className="font-heading"><Link href={`/boletin/${editionSlug(month, lang)}#${article.slug}`}>{article.title}</Link></h4>
                  <p>{article.author} · <time dateTime={article.publishedAt}>{formatResourceDate(article.publishedAt)}</time></p>
                  <p>{article.excerpt}</p>
                </header>
                <div className={styles.links}>
                  <Link href={`/boletin/${editionSlug(month, lang)}#${article.slug}`}>{content.read}</Link>
                </div>
              </article>
            ))}
          </section>
        ))}
        <section className={`site-newsletter ${styles.subscribe}`} aria-labelledby="newsletter-title">
          <h2 id="newsletter-title" className="font-heading">{content.subscribe}</h2>
          {newsletterConfig(process.env) ? <NewsletterForm es={lang === 'es'} /> : <p>{content.unavailable}</p>}
        </section>
      </section>
    </PageWrapper>
  );
}
