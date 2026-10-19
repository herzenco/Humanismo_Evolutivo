import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import QuestionStructuredData from '@/components/questions/QuestionStructuredData';
import QuestionVideoPlayer from '@/components/questions/QuestionVideoPlayer';
import QuestionText from '@/components/questions/QuestionText';
import { publishedQuestions, questionBySlug, questionPath, questionsCanonicalOrigin } from '@/data/questions';

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
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: 'article', title: question.title, description: question.description, url: canonical, ...(question.publishedAt ? { publishedTime: question.publishedAt } : {}), ...(question.updatedAt ? { modifiedTime: question.updatedAt } : {}) },
  };
}

export default async function QuestionPage({ params }: Props) {
  const question = questionBySlug((await params).questionSlug);
  if (!question) notFound();
  const published = publishedQuestions();
  const position = published.findIndex(item => item.number === question.number);
  const previous = published[position - 1];
  const next = published[position + 1];
  const canonical = `${questionsCanonicalOrigin}${questionPath(question.number)}`;
  return <PageWrapper>
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'Article', headline: question.title, description: question.description, mainEntityOfPage: canonical, url: canonical, articleBody: question.sections.flatMap(section => [section.heading || '', ...section.paragraphs]).filter(Boolean).join('\n\n').replace(/\*\*/g, '').replace(/\*/g, ''), ...(question.author ? { author: { '@type': 'Person', name: question.author } } : {}), ...(question.publishedAt ? { datePublished: question.publishedAt } : {}), ...(question.updatedAt ? { dateModified: question.updatedAt } : {}) }} />
    <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: questionsCanonicalOrigin }, { '@type': 'ListItem', position: 2, name: 'Las 51 preguntas', item: `${questionsCanonicalOrigin}/51preguntas` }, { '@type': 'ListItem', position: 3, name: question.title, item: canonical }] }} />
    <article><header className="questions-hero"><div className="questions-reading-width"><Link href="/51preguntas" className="questions-back"><ArrowLeft size={16} />Las 51 preguntas</Link><span className="design-eyebrow">PREGUNTA {question.number} DE 51</span><h1>{question.title}</h1><p>{question.description}</p>{question.author ? <p className="questions-byline">{question.author}</p> : null}</div></header>
      <div className="questions-answer questions-reading-width">
        {question.videos?.length ? <QuestionVideoPlayer key={question.number} title={question.title} videos={question.videos} /> : <p className="question-video-coming-soon">El video de esta pregunta estará disponible próximamente.</p>}
        {question.sections.map((section, index) => <section id={`question-${section.kind || index}`} className={section.kind === 'dialogue' ? 'question-dialogue' : undefined} key={index}>{section.heading ? <h2>{section.heading}</h2> : null}{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><QuestionText>{paragraph}</QuestionText></p>)}{section.kind === 'dialogue' ? <aside className="question-characters-note">Platón, Sócrates y Aristóteles son recursos didácticos. Estos diálogos no reproducen literalmente sus palabras ni sus doctrinas históricas.</aside> : null}</section>)}
        {question.sourceTitle ? <p className="question-source">Fuente: {question.sourceTitle}.</p> : null}
        <nav className="questions-pagination" aria-label="Navegación entre preguntas">{previous ? <Link href={questionPath(previous.number)}><ArrowLeft size={18} /><span><small>Pregunta anterior</small>{previous.title}</span></Link> : <span />}{next ? <Link href={questionPath(next.number)}><span><small>Siguiente pregunta</small>{next.title}</span><ArrowRight size={18} /></Link> : null}</nav>
        <Link href="/51preguntas" className="design-button design-button-outline"><List size={18} />Ver todas las preguntas</Link>
      </div>
    </article>
  </PageWrapper>;
}
