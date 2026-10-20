'use client';

import { useState } from 'react';
import { portalRoleSuffix } from '@/lib/portal-role';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, FileText, Headphones, Search, Video } from 'lucide-react';
import { books } from '@/data/books';
import { podcastSeries, videos } from '@/data/media';
import { getPodcastEpisodeContent } from '@/data/podcastEpisodeContent';
import { publishedQuestions } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ResourceArticle } from '@/data/resources';
import QuestionVideoPlayer from '@/components/questions/QuestionVideoPlayer';
import QuestionText from '@/components/questions/QuestionText';

const categories = [
  { id: 'books', title: 'Libros', description: 'Obras y lecturas de Marcos Constandse Madrazo.', icon: BookOpen },
  { id: 'media', title: 'Podcasts y videos', description: 'Conversaciones para escuchar, mirar y reflexionar.', icon: Headphones },
  { id: 'resources', title: 'Artículos y recursos', description: 'Lecturas publicadas y materiales para profundizar.', icon: FileText },
  { id: 'questions', title: 'Las 51 preguntas', description: 'Preguntas y reflexiones sobre la vida y la conciencia.', icon: Video },
] as const;
const bookFiles: Record<string, { path: string; label: string }> = {
  'yo-soy-nosotros': { path: '/books/Yo_Soy_Nosotros_Resumen.pdf', label: 'Leer resumen (PDF)' },
  'ecologia-y-espiritualidad': { path: '/books/Ecologia_y_Espiritualidad.pdf', label: 'Leer libro (PDF)' },
  'dejalo-ser': { path: '/books/DejaloSer_Resumen.pdf', label: 'Leer resumen (PDF)' },
  'lo-mejor-esta-por-venir': { path: '/books/Lo_mejor_esta_por_venir.pdf', label: 'Leer libro (PDF)' },
  'el-arte-de-ser-empresario': { path: '/books/El_arte_de_ser_empresario_Resumen.pdf', label: 'Leer resumen (PDF)' },
};
const libraryHref = (category?: string, kind?: string, item?: string, role?: string | null) => {
  const query = new URLSearchParams({ view: 'library' });
  if (category) query.set('category', category);
  if (kind) query.set('kind', kind);
  if (item) query.set('item', item);
  return `/portal?${query}${portalRoleSuffix(role ?? null)}`;
};
function youtubeEmbed(value: string) {
  try { const url = new URL(value); const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : ['www.youtube.com', 'youtube.com'].includes(url.hostname) ? url.searchParams.get('v') : null; return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null; } catch { return null; }
}

export default function PortalLibrary({ articles }: { articles: ResourceArticle[] }) {
  const params = useSearchParams();
  const libraryLink = (category?: string, kind?: string, item?: string) => libraryHref(category, kind, item, params.get('role'));
  const category = params.get('category');
  const kind = params.get('kind');
  const item = params.get('item');
  const [search, setSearch] = useState('');
  const { t } = useLanguage();
  const questions = publishedQuestions();
  const match = (text: string) => text.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es').trim());
  const currentCategory = categories.find(entry => entry.id === category);
  const back = <Link className="design-text-link" href={libraryLink(category || undefined)}><ArrowLeft size={17} />Volver a {currentCategory?.title.toLowerCase() || 'la biblioteca'}</Link>;
  const missing = <div className="portal-empty"><h2>Contenido no encontrado</h2><p>Selecciona un material disponible en la biblioteca.</p>{back}</div>;

  if (item) {
    if (category === 'books') {
      const book = books.find(book => book.id === item);
      if (!book) return missing;
      const file = bookFiles[book.id];
      return <section className="portal-reader">{back}<div className="portal-book-detail"><img src={book.coverImage} alt={`Portada de ${book.title}`} /><div><span className="design-eyebrow">LIBRO · {book.author}</span><h2>{book.title}</h2><p>{book.subtitle}</p>{book.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></div>{file ? <section className="portal-document"><h3>{file.label.replace(' (PDF)', '')}</h3><iframe src={file.path} title={`${file.label}: ${book.title}`} /><a href={file.path} download className="design-text-link">Descargar PDF<ArrowRight size={16} /></a></section> : null}</section>;
    }
    if (category === 'media' && kind === 'podcast') {
      const series = podcastSeries.find(series => series.id === item);
      if (!series) return missing;
      return <section className="portal-reader">{back}<h2>{t(series.titleKey)}</h2><p>{t(series.descriptionKey)}</p><div className="portal-episodes">{series.episodes.map(episode => {
        const content = getPodcastEpisodeContent(episode.audioUrl);
        const episodeTitle = content?.title || t(episode.titleKey);
        const episodeDescription = content?.description || t(episode.descriptionKey);
        const id = /open\.spotify\.com\/episode\/([A-Za-z0-9]+)/.exec(episode.audioUrl)?.[1];
        return <article key={episode.slug}><h3>{episodeTitle}</h3><p>{episodeDescription}</p>{id ? <iframe src={`https://open.spotify.com/embed/episode/${id}`} title={episodeTitle} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" height="152" /> : <p>El audio estará disponible próximamente.</p>}</article>;
      })}</div></section>;
    }
    if (category === 'media' && kind === 'video') {
      const video = videos.find(video => String(video.id) === item);
      if (!video) return missing;
      const embed = youtubeEmbed(video.videoUrl);
      return <section className="portal-reader">{back}<h2>{t(video.titleKey)}</h2><p>{t(video.descriptionKey)}</p>{embed ? <iframe className="portal-video-embed" src={embed} title={t(video.titleKey)} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen /> : <p>El video estará disponible próximamente.</p>}</section>;
    }
    if (category === 'resources') {
      const article = articles.find(article => article.slug === item);
      if (!article) return missing;
      return <article className="portal-reader">{back}<h2>{article.title}</h2><p>{article.author}</p>{article.heroImageUrl ? <img className="portal-article-hero" src={article.heroImageUrl} alt={article.heroImageAlt || ''} /> : null}<div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} /></article>;
    }
    if (category === 'questions') {
      const question = questions.find(question => String(question.number) === item);
      if (!question) return missing;
      return <article className="portal-reader">{back}<span className="design-eyebrow">PREGUNTA {question.number} DE 51</span><h2>{question.title}</h2>{question.videos?.length ? <QuestionVideoPlayer title={question.title} videos={question.videos} /> : null}<section id="question-narration" aria-label="Versión narrada">{question.sections.filter(section => section.kind === 'narration').flatMap(section => section.paragraphs).map((paragraph, index) => <p key={index}><QuestionText>{paragraph}</QuestionText></p>)}</section></article>;
    }
    return missing;
  }

  if (!currentCategory) return <div className="portal-library-grid">{categories.map(entry => <article key={entry.id}><entry.icon size={32} strokeWidth={1.4} /><h2>{entry.title}</h2><p>{entry.description}</p><Link href={libraryLink(entry.id)} className="design-text-link">Explorar<ArrowRight size={18} /></Link></article>)}</div>;

  const entries = category === 'books' ? books.map(book => ({ id: book.id, title: book.title, description: book.excerpt, image: book.coverImage, kind: 'book', label: 'Leer' }))
    : category === 'media' ? [...podcastSeries.map(series => ({ id: series.id, title: t(series.titleKey), description: t(series.descriptionKey), image: books.find(book => book.id === series.id)?.coverImage || series.coverImage, kind: 'podcast', label: `${series.episodes.length} episodios` })), ...videos.map(video => ({ id: String(video.id), title: t(video.titleKey), description: t(video.descriptionKey), image: video.imageUrl, kind: 'video', label: 'Ver video' }))]
    : category === 'resources' ? articles.map(article => ({ id: article.slug, title: article.title, description: article.excerpt, image: article.heroImageUrl, kind: 'article', label: 'Leer artículo' }))
    : questions.map(question => ({ id: String(question.number), title: question.title, description: question.description, image: null, kind: 'question', label: `Pregunta ${question.number}` }));
  const filtered = entries.filter(entry => match(`${entry.title} ${entry.description}`));
  return <section><Link href={libraryLink()} className="design-text-link"><ArrowLeft size={17} />Volver a la biblioteca</Link><div className="portal-section-heading"><h2>{currentCategory.title}</h2><span>{entries.length} materiales</span></div><label className="portal-search"><Search size={18} /><span className="sr-only">Buscar en {currentCategory.title}</span><input type="search" placeholder={`Buscar en ${currentCategory.title.toLowerCase()}`} value={search} onChange={event => setSearch(event.target.value)} /></label><div className="portal-content-grid">{filtered.map(entry => <article className="portal-content-card" key={`${entry.kind}-${entry.id}`}>{entry.image ? <img src={entry.image} alt="" loading="lazy" /> : null}<div><span className="design-eyebrow">{entry.kind === 'podcast' ? 'PODCAST' : entry.kind === 'video' ? 'VIDEO' : entry.label}</span><h3><Link href={libraryLink(category!, entry.kind, entry.id)}>{entry.title}</Link></h3><p>{entry.description}</p><Link className="design-text-link" href={libraryLink(category!, entry.kind, entry.id)}>Abrir<ArrowRight size={16} /></Link></div></article>)}</div>{!filtered.length ? <div className="portal-empty"><h3>{entries.length ? 'No hay resultados' : 'Próximamente'}</h3><p>{entries.length ? 'Prueba con otra palabra para encontrar un material.' : 'Los artículos y recursos aparecerán aquí cuando se publiquen.'}</p></div> : null}</section>;
}
