import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import QuestionStructuredData from '@/components/questions/QuestionStructuredData';
import QuestionVideoPlayer from '@/components/questions/QuestionVideoPlayer';
import QuestionText from '@/components/questions/QuestionText';
import { questionKeywords, publishedQuestions, questionBySlug, questionPath, questionsCanonicalOrigin } from '@/data/questions';

type Props = { params: Promise<{ questionSlug: string }> };

export function generateStaticParams() {
  return publishedQuestions().map(question => ({ questionSlug: `pregunta_${question.number}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const question = questionBySlug((await params).questionSlug);
  if (!question) return { title: 'Pregunta no encontrada', robots: { index: false, follow: false } };
  const canonical = `${questionsCanonicalOrigin}${questionPath(question.number)}`;
  return {
    title: question.title,
    description: question.description,
    keywords: questionKeywords(question),
    alternates: { canonical },
    openGraph: { type: 'article', title: question.title, description: question.description, url: canonical, ...(question.publishedAt ? { publishedTime: question.publishedAt } : {}), ...(question.updatedAt ? { modifiedTime: question.updatedAt } : {}) },
  };
}

export default async function QuestionPage({ params }: Props) {
  const question = questionBySlug((await params).questionSlug);
  if (!question) notFound();
  const narration = question.sections.filter(section => section.kind === 'narration');
  const published = publishedQuestions();
  const position = published.findIndex(item => item.number === question.number);
  const previous = published[position - 1];
  const next = published[position + 1];
  const canonical = `${questionsCanonicalOrigin}${questionPath(question.number)}`;
  return <PageWrapper>
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'Article', headline: question.title, description: question.description, mainEntityOfPage: canonical, url: canonical, articleBody: narration.flatMap(section => section.paragraphs).join('\n\n').replace(/\*\*/g, '').replace(/\*/g, ''), ...(question.author ? { author: { '@type': 'Person', name: question.author } } : {}), ...(question.publishedAt ? { datePublished: question.publishedAt } : {}), ...(question.updatedAt ? { dateModified: question.updatedAt } : {}) }} />
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: questionsCanonicalOrigin }, { '@type': 'ListItem', position: 2, name: 'Las 51 preguntas', item: `${questionsCanonicalOrigin}/51preguntas` }, { '@type': 'ListItem', position: 3, name: question.title, item: canonical }] }} />
    <article><header className="questions-hero"><div className="questions-reading-width"><Link href="/51preguntas" className="questions-back"><ArrowLeft size={16} />Las 51 preguntas</Link><span className="design-eyebrow">PREGUNTA {question.number} DE 51</span><h1>{question.title}</h1>{question.author ? <p className="questions-byline">{question.author}</p> : null}</div></header>
      <div className="questions-answer questions-reading-width">
        {question.videos?.length ? <QuestionVideoPlayer key={question.number} title={question.title} videos={question.videos} /> : <p className="question-video-coming-soon">El video de esta pregunta estará disponible próximamente.</p>}
        <section id="question-narration" aria-label="Versión narrada">
          {narration.flatMap(section => section.paragraphs).map((paragraph, index) => <p key={index}><QuestionText>{paragraph}</QuestionText></p>)}
        </section>
        <nav className="questions-pagination" aria-label="Navegación entre preguntas">{previous ? <Link href={questionPath(previous.number)}><ArrowLeft size={18} /><span><small>Pregunta anterior</small>{previous.title}</span></Link> : <span />}{next ? <Link href={questionPath(next.number)}><span><small>Siguiente pregunta</small>{next.title}</span><ArrowRight size={18} /></Link> : null}</nav>
        <Link href="/51preguntas" className="design-button design-button-outline"><List size={18} />Ver todas las preguntas</Link>
      </div>
    </article>
  </PageWrapper>;
}
