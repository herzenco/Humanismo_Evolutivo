import { qaGateEnabled } from '@/lib/qa-gate';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessagesSquare } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import QuestionStructuredData from '@/components/questions/QuestionStructuredData';
import { publishedQuestions, questionPath, questionsCanonicalOrigin } from '@/data/questions';

const description = 'Las 51 preguntas del Humanismo Evolutivo: un espacio para explorar la conciencia, la vida y nuestra relación con el mundo, una pregunta a la vez.';

export function generateMetadata(): Metadata {
  const hasContent = publishedQuestions().length > 0;
  return {
    title: 'Las 51 preguntas',
    description,
    alternates: { canonical: `${questionsCanonicalOrigin}/51preguntas` },
    robots: { index: hasContent && !qaGateEnabled(), follow: !qaGateEnabled() },
    openGraph: { type: 'website', title: 'Las 51 preguntas | Humanismo Evolutivo', description, url: `${questionsCanonicalOrigin}/51preguntas` },
  };
}

export default function QuestionsPage() {
  const published = publishedQuestions();
  return <PageWrapper>
    {published.length > 0 ? <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Las 51 preguntas', numberOfItems: published.length, itemListElement: published.map((question, index) => ({ '@type': 'ListItem', position: index + 1, name: question.title, url: `${questionsCanonicalOrigin}${questionPath(question.number)}` })) }} /> : null}
    <section className="questions-hero"><div className="design-content-width"><Link href="/#s5" className="questions-back">Inicio / Las 51 preguntas</Link><span className="design-eyebrow">PREGUNTAR · REFLEXIONAR · COMPRENDER</span><h1>Las <em>51 preguntas</em></h1><p>{description}</p></div></section>
    <section className="questions-directory"><div className="design-content-width">
      <div className="design-section-heading"><span className="design-eyebrow">UN CAMINO DE REFLEXIÓN</span><h2>Cada pregunta abre una nueva perspectiva</h2><p>Elige una pregunta para explorar su reflexión en una página dedicada.</p></div>
      {published.length > 0 ? <ol className="questions-list" aria-label="Las 51 preguntas">{published.map(question => <li key={question.number}><Link href={questionPath(question.number)}><span className="questions-number" aria-hidden="true">{String(question.number).padStart(2, '0')}</span><div><h3>{question.title}</h3><p>{question.description}</p></div><ArrowRight size={22} aria-hidden="true" /></Link></li>)}</ol> : <div className="questions-empty"><MessagesSquare size={44} strokeWidth={1.3} aria-hidden="true" /><h3>Un espacio para las grandes preguntas</h3><p>Próximamente compartiremos las 51 preguntas y sus reflexiones. Cada una tendrá su propio espacio para leer, comprender y profundizar.</p><Link href="/#s5" className="design-button design-button-outline">Volver al inicio<ArrowRight size={18} /></Link></div>}
    </div></section>
  </PageWrapper>;
}
