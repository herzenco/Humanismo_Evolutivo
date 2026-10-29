import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, MessagesSquare } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import PageWrapper from '@/components/layout/PageWrapper';
import QuestionStructuredData from '@/components/questions/QuestionStructuredData';
import { publishedQuestions, questionPath } from '@/data/questions';
import { questionTitlesEn } from '@/data/questionTitlesEn';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, isLanguage, type Language } from '@/lib/site';

const descriptions: Record<Language, string> = {
  es: 'Las 51 preguntas del Humanismo Evolutivo: un espacio para explorar la conciencia, la vida y nuestra relación con el mundo, una pregunta a la vez.',
  en: 'The 51 questions of Evolutionary Humanism: a space to explore consciousness, life, and our relationship with the world, one question at a time.',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const hasContent = publishedQuestions().length > 0;
  return pageMetadata({
    title: lang === 'en' ? 'The 51 questions' : 'Las 51 preguntas',
    description: descriptions[lang],
    path: '/51preguntas',
    language: lang,
    index: hasContent,
  });
}

export default async function QuestionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const en = lang === 'en';
  const published = publishedQuestions();
  const titleFor = (number: number, title: string) => en ? questionTitlesEn[number] ?? title : title;
  return <PageWrapper>
    {published.length > 0 ? <QuestionStructuredData data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: en ? 'The 51 questions' : 'Las 51 preguntas', numberOfItems: published.length, itemListElement: published.map((question, index) => ({ '@type': 'ListItem', position: index + 1, name: titleFor(question.number, question.title), url: absoluteUrl(questionPath(question.number), lang) })) }} /> : null}
    <section className="questions-hero"><div className="design-content-width"><Link href="/#s5" className="questions-back">{en ? 'Home / The 51 questions' : 'Inicio / Las 51 preguntas'}</Link><span className="design-eyebrow">{en ? 'ASK · REFLECT · UNDERSTAND' : 'PREGUNTAR · REFLEXIONAR · COMPRENDER'}</span><h1>{en ? <>The <em>51 questions</em></> : <>Las <em>51 preguntas</em></>}</h1><p>{descriptions[lang]}</p><p>{en ? 'These questions are part of ' : 'Estas preguntas se integran en '}<Link href="/libros#introduccion-al-pensamiento-filosofico" className="underline">Introducción al Pensamiento Filosófico del Humanismo Evolutivo Transpersonal</Link>{en ? ', which is in editorial preparation.' : ', en preparación editorial.'}</p></div></section>
    <section className="questions-directory"><div className="design-content-width">
      <div className="design-section-heading"><span className="design-eyebrow">{en ? 'A PATH OF REFLECTION' : 'UN CAMINO DE REFLEXIÓN'}</span><h2>{en ? 'Each question opens a new perspective' : 'Cada pregunta abre una nueva perspectiva'}</h2><p>{en ? 'Choose a question to explore its reflection on a dedicated page.' : 'Elige una pregunta para explorar su reflexión en una página dedicada.'}</p></div>
      {published.length > 0 ? <ol className="questions-list" aria-label={en ? 'The 51 questions' : 'Las 51 preguntas'}>{published.map(question => <li key={question.number}><Link href={questionPath(question.number)}><span className="questions-number" aria-hidden="true">{String(question.number).padStart(2, '0')}</span><div><h3>{titleFor(question.number, question.title)}</h3><p>{question.description}</p></div><ArrowRight size={22} aria-hidden="true" /></Link></li>)}</ol> : <div className="questions-empty"><MessagesSquare size={44} strokeWidth={1.3} aria-hidden="true" /><h3>{en ? 'A space for the great questions' : 'Un espacio para las grandes preguntas'}</h3><p>{en ? 'We will soon share the 51 questions and their reflections. Each one will have its own space to read, understand, and go deeper.' : 'Próximamente compartiremos las 51 preguntas y sus reflexiones. Cada una tendrá su propio espacio para leer, comprender y profundizar.'}</p><Link href="/#s5" className="design-button design-button-outline">{en ? 'Back to home' : 'Volver al inicio'}<ArrowRight size={18} /></Link></div>}
    </div></section>
  </PageWrapper>;
}
