import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import styles from './newsletter.module.css';
import { notFound } from 'next/navigation';
import NewsletterForm from '@/components/layout/NewsletterForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { formatResourceDate } from '@/data/resources';
import { getMagazineArticles, qaResourceReaderConfigured } from '@/lib/qa-resources';
import { getSupabaseConfig } from "@/lib/supabase/config";
import { newsletterConfig } from '@/lib/newsletter';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

const copy = {
  es: {
    title: 'Boletín de Humanismo Evolutivo',
    description: 'Reflexiones, nuevos contenidos y eventos para seguir evolucionando juntos.',
    archive: 'Ediciones del boletín',
    monthly: 'Boletín mensual',
    subject: 'Un jardín para mirar de nuevo',
    intro: '¿Qué cambia cuando nos detenemos a observar un jardín? El Jardín de la Evolución invita a recorrer la historia de la vida y a preguntarnos qué lugar ocupamos en ella.',
    reflection: 'En tu próximo paseo, elige un detalle que normalmente pasarías por alto. Obsérvalo un momento y pregúntate qué te dice sobre el lugar que habitas.',
    garden: 'Recorrer los jardines',
    questions: 'Explorar las grandes preguntas',
    subscribe: 'Recibe el boletín cada mes',
    unavailable: 'Las suscripciones no están disponibles por el momento.',
  },
  en: {
    title: 'Evolutionary Humanism Newsletter',
    description: 'Reflections, new content and events to keep growing together.',
    archive: 'Newsletter issues',
    monthly: 'Monthly newsletter',
    subject: 'A garden worth a closer look',
    intro: 'What changes when we pause to observe a garden? The Garden of Evolution invites us to trace the history of life and ask where we fit in it.',
    reflection: 'On your next walk, choose a detail you would usually pass by. Spend a moment with it and ask what it tells you about the place you inhabit.',
    garden: 'Explore the gardens',
    questions: 'Explore the big questions',
    subscribe: 'Get the newsletter each month',
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
  const content = copy[lang];
  const articles = qaResourceReaderConfigured() ? await getMagazineArticles('boletin') : [];
  const firstMonth = '2026-11';
  const monthFormat = new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  const issuesByMonth = new Map<string, typeof articles>([[firstMonth, []]]);
  for (const article of articles) {
    const month = new Date(article.publishedAt).toISOString().slice(0, 7);
    const issues = issuesByMonth.get(month) ?? [];
    issues.push(article);
    issuesByMonth.set(month, issues);
  }
  const months = [...issuesByMonth.keys()].sort().reverse();
  const monthLabel = (month: string) => monthFormat.format(new Date(month + '-01T00:00:00Z'));

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
            {months.map(month => <li key={month}><a href={`#edicion-${month}`}>{monthLabel(month)}</a></li>)}
          </ul>
        </div>
        {months.map(month => (
          <section key={month} id={`edicion-${month}`} className={styles.month} aria-labelledby={`month-${month}`}>
            <h3 id={`month-${month}`}><time dateTime={month}>{monthLabel(month)}</time></h3>
            {month === firstMonth && issuesByMonth.get(month)?.length === 0 ? (
              <article className={styles.feature}>
                <div className={styles.cover}>
                  <Image src="/design/jardin-evolucion-panorama.webp" fill sizes="(max-width: 720px) 100vw, 1080px" alt={lang === 'es' ? 'Muro de mosaicos del Jardín de la Evolución' : 'Mosaic wall at the Garden of Evolution'} />
                </div>
                <div className={styles.editorial}>
                  <h4 className="font-heading">{content.subject}</h4>
                  <p className={styles.lead}>{content.intro}</p>
                  <p>{content.reflection}</p>
                  <div className={styles.links}>
                    <Link href="/jardines">{content.garden} <span aria-hidden="true">↗</span></Link>
                    <Link href="/51preguntas">{content.questions} <span aria-hidden="true">↗</span></Link>
                  </div>
                </div>
              </article>
            ) : null}
            {issuesByMonth.get(month)?.map(article => (
              <article className={styles.managed} key={article.id} id={article.slug}>
                <header>
                  <h4 className="font-heading">{article.title}</h4>
                  <p>{article.author} · <time dateTime={article.publishedAt}>{formatResourceDate(article.publishedAt)}</time></p>
                  <p>{article.excerpt}</p>
                </header>
                {article.design?.images.length ? <div className="newsletter-issue-photos" data-layout={article.design.layout}>
                  {article.design.images.map(image => <img key={image.path} loading="lazy"
                    src={getSupabaseConfig().url + "/storage/v1/object/public/qa-newsletter-images/" + image.path} alt={image.alt} />)}
                </div> : null}
                <div className="resource-article-body" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
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
