import type { Metadata } from 'next';
import Link from '@/components/LocalizedLink';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import QuestionStructuredData from '@/components/questions/QuestionStructuredData';
import QuestionVideoPlayer from '@/components/questions/QuestionVideoPlayer';
import NewsletterForm from '@/components/layout/NewsletterForm';
import QuestionText from '@/components/questions/QuestionText';
import { questionKeywords, publishedQuestions, questionBySlug, questionPath, questionSlug as canonicalSlug } from '@/data/questions';
import { getQuestions } from '@/lib/qa-resources';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, isLanguage, localizedPath, type Language } from '@/lib/site';

type Props = { params: Promise<{ lang: string; questionSlug: string }> };

function titleFor(language: Language, number: number, title: string, source: Awaited<ReturnType<typeof getQuestions>>) {
  return language === 'en' ? source.find(question => question.number === number)?.titleEn ?? title : title;
}

export function generateStaticParams() {
  return ['es', 'en'].flatMap(lang => publishedQuestions().map(question => ({ lang, questionSlug: canonicalSlug(question) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, questionSlug } = await params;
  if (!isLanguage(lang)) notFound();
  const source = await getQuestions();
  const question = questionBySlug(questionSlug, source);
  if (!question) return { title: lang === 'en' ? 'Question not found' : 'Pregunta no encontrada', robots: { index: false, follow: false } };
  const title = titleFor(lang, question.number, question.title, source);
  const seoTitle = question.number === 51 ? (lang === 'es' ? 'Conclusión: ciencia, religión y autorrealización' : 'Conclusion: science, religion and self-realization') : title;
  const metadata = pageMetadata({ title: seoTitle, description: question.description, path: questionPath(question), language: lang });
  return {
    ...metadata,
    keywords: questionKeywords(question),
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      ...(question.videos?.length ? { images: [question.videos.find(video => video.orientation === 'horizontal')?.poster ?? question.videos[0].poster] } : {}),
      ...(question.publishedAt ? { publishedTime: question.publishedAt } : {}),
      ...(question.updatedAt ? { modifiedTime: question.updatedAt } : {}),
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { lang, questionSlug } = await params;
  if (!isLanguage(lang)) notFound();
  const source = await getQuestions();
  const question = questionBySlug(questionSlug, source);
  if (!question) notFound();
  if (questionSlug !== canonicalSlug(question)) permanentRedirect(localizedPath(questionPath(question), lang));
  const en = lang === 'en';
  const title = titleFor(lang, question.number, question.title, source);
  const narration = question.sections.filter(section => section.kind === 'narration');
  const published = publishedQuestions(source);
  const position = published.findIndex(item => item.number === question.number);
  const previous = published[position - 1];
  const next = published[position + 1];
  const canonical = absoluteUrl(questionPath(question), lang);
  return <PageWrapper>
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'Article', headline: title, description: question.description, mainEntityOfPage: canonical, url: canonical, articleBody: narration.flatMap(section => section.paragraphs).join('\n\n').replace(/\*\*/g, '').replace(/\*/g, ''), ...(question.author ? { author: { '@type': 'Person', name: question.author } } : {}), ...(question.publishedAt ? { datePublished: question.publishedAt } : {}), ...(question.updatedAt ? { dateModified: question.updatedAt } : {}) }} />
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: en ? 'Home' : 'Inicio', item: absoluteUrl('/', lang) }, { '@type': 'ListItem', position: 2, name: en ? 'The 51 questions' : 'Las 51 preguntas', item: absoluteUrl('/51preguntas', lang) }, { '@type': 'ListItem', position: 3, name: title, item: canonical }] }} />
    <article><header className="questions-hero"><div className="questions-reading-width"><Link href="/51preguntas" className="questions-back"><ArrowLeft size={16} />{en ? 'The 51 questions' : 'Las 51 preguntas'}</Link><span className="design-eyebrow">{en ? `QUESTION ${question.number} OF 51` : `PREGUNTA ${question.number} DE 51`}</span><h1>{title}</h1>{question.author ? <p className="questions-byline">{question.author}</p> : null}</div></header>
      <div className="questions-answer questions-reading-width">
        {question.videos?.length ? <QuestionVideoPlayer key={question.number} title={title} videos={question.videos} language={lang} /> : question.number >= 35 ? (
          <section className="question-video-notify" aria-labelledby="question-video-coming-soon">
            <h2 id="question-video-coming-soon">{en ? 'Coming soon' : 'Próximamente'}</h2>
            <p>{en ? 'Leave your details to get an email when this video is available.' : 'Deje sus datos para recibir un correo cuando se publique este video.'}</p>
            <NewsletterForm es={!en} question={question.number} />
          </section>
        ) : <p className="question-video-coming-soon">{en ? 'The video for this question will be available soon.' : 'El video de esta pregunta estará disponible próximamente.'}</p>}
        {en ? <p>This reflection is published in the author's Spanish.</p> : null}
        <section id="question-narration" aria-label={en ? 'Narrated version' : 'Versión narrada'}>
          {narration.flatMap(section => section.paragraphs).map((paragraph, index) => <p key={index}><QuestionText>{paragraph}</QuestionText></p>)}
        </section>
        {[40, 41, 42, 43].includes(question.number) && <Link href="/clases" className="design-button design-button-outline">
          {en ? 'Philosophy and anthropology courses in Cancún' : 'Cursos de filosofía y antropología en Cancún'}
        </Link>}
        <nav className="questions-pagination" aria-label={en ? 'Question navigation' : 'Navegación entre preguntas'}>{previous ? <Link href={questionPath(previous)}><ArrowLeft size={18} /><span><small>{en ? 'Previous question' : 'Pregunta anterior'}</small>{titleFor(lang, previous.number, previous.title, source)}</span></Link> : <span />}{next ? <Link href={questionPath(next)}><span><small>{en ? 'Next question' : 'Siguiente pregunta'}</small>{titleFor(lang, next.number, next.title, source)}</span><ArrowRight size={18} /></Link> : null}</nav>
        <Link href="/51preguntas" className="design-button design-button-outline"><List size={18} />{en ? 'View all questions' : 'Ver todas las preguntas'}</Link>
      </div>
    </article>
  </PageWrapper>;
}
