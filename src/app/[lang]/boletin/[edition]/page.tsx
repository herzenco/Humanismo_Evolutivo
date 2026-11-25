import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import PageWrapper from '@/components/layout/PageWrapper';
import { formatResourceDate } from '@/data/resources';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { copy, editionsByMonth, editionSlug, monthLabel } from '../editions';
import styles from '../newsletter.module.css';

type Props = { params: Promise<{ lang: string; edition: string }> };

async function getEdition(params: Props['params']) {
  const { lang, edition } = await params;
  if (!isLanguage(lang)) notFound();
  const issue = (await editionsByMonth()).find(([month]) => editionSlug(month, lang) === edition);
  if (!issue) notFound();
  return { lang, edition, month: issue[0], articles: issue[1], content: copy[lang] };
}

export async function generateMetadata({ params }: Props) {
  const { lang, edition, month, articles, content } = await getEdition(params);
  return pageMetadata({
    title: `${content.monthly} · ${monthLabel(month, lang)}`,
    description: articles[0]?.excerpt ?? content.intro, language: lang, path: `/boletin/${edition}`,
  });
}

export default async function NewsletterEditionPage({ params }: Props) {
  const { lang, month, articles, content } = await getEdition(params);
  return <PageWrapper showFooterNewsletter={false}>
    <header className={styles.masthead}>
      <p>{content.monthly}</p>
      <h1 className="font-heading">{monthLabel(month, lang)}</h1>
      <Link href="/boletin" className="underline">{content.back}</Link>
    </header>
    <div className={styles.archive}>
      <section className={styles.month} aria-label={content.archive}>
        {articles.length === 0 ? <article className={styles.feature}>
          <div className={styles.cover}>
            <Image src="/design/jardin-evolucion-panorama.webp" fill sizes="(max-width: 720px) 100vw, 1080px"
              alt={lang === 'es' ? 'Muro de mosaicos del Jardín de la Evolución' : 'Mosaic wall at the Garden of Evolution'} />
          </div>
          <div className={styles.editorial}>
            <h2 className="font-heading">{content.subject}</h2>
            <p className={styles.lead}>{content.intro}</p>
            <p>{content.reflection}</p>
          </div>
        </article> : articles.map(article => <article className={styles.managed} key={article.id} id={article.slug}>
          <header>
            <h2 className="font-heading">{article.title}</h2>
            <p>{article.author} · <time dateTime={article.publishedAt}>{formatResourceDate(article.publishedAt)}</time></p>
            <p>{article.excerpt}</p>
          </header>
          {article.design?.images.length ? <div className="newsletter-issue-photos" data-layout={article.design.layout}>
            {article.design.images.map(image => <img key={image.path} loading="lazy"
              src={`/api/newsletter-image?path=${encodeURIComponent(image.path)}`} alt={image.alt} />)}
          </div> : null}
          <div className="resource-article-body" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
        </article>)}
      </section>
    </div>
  </PageWrapper>;
}
