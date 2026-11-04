'use client';
import { useMemo, useState } from 'react';
import Link from '@/components/LocalizedLink';
import { Play, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { videoLibrary } from '@/data/video-library';
import VideoDialog from './VideoDialog';

export default function VideoLibrary() {
  const { t, language } = useLanguage();
  const es = language === 'es';
  const [query,setQuery] = useState('');
  const [category,setCategory] = useState('all');
  const [limit,setLimit] = useState(12);
  const all = useMemo(() => videoLibrary(t,language),[t,language]);
  const categories: Record<string,string> = {all:es ? 'Todos los videos' : 'All videos',introductions:es ? 'Introducciones' : 'Introductions',documentaries:es ? 'Documentales' : 'Documentaries',events:es ? 'Conferencias y eventos' : 'Talks and events',questions:es ? 'Las 51 preguntas' : 'The 51 questions'};
  const normalize = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered = all.filter(video => (category === 'all' || video.category === category) && normalize(`${video.title} ${video.description} ${video.variant || ''}`).includes(normalize(query.trim())));
  return <div className="video-library">
    <div className="video-library-tools">
      <label><Search size={18} aria-hidden="true"/><span className="sr-only">{es ? 'Buscar videos' : 'Search videos'}</span><input type="search" value={query} placeholder={es ? 'Buscar por título, tema o pregunta…' : 'Search by title, topic or question…'} onChange={event => {setQuery(event.target.value);setLimit(12);}}/></label>
      <label><span className="sr-only">{es ? 'Categoría de videos' : 'Video category'}</span><select value={category} onChange={event => {setCategory(event.target.value);setLimit(12);}}>{Object.entries(categories).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    </div>
    <p className="video-library-count" role="status">{filtered.length} {filtered.length === 1 ? 'video' : 'videos'} · {es ? 'Biblioteca de videos del sitio' : 'Website video library'}</p>
    <div className="design-media-grid">{filtered.slice(0,limit).map(video => <article className="design-media-card" key={video.id}>
      <div className="design-media-cover"><img width="280" height="210" src={video.poster} alt="" loading="lazy"/><span><Play size={16} aria-hidden="true"/>{video.duration || (es ? 'Video completo' : 'Full video')}</span></div>
      <div><span className="design-eyebrow">{categories[video.category]}{video.variant ? ` · ${video.variant}` : ''}</span><h3>{video.title}</h3><p>{video.description}</p>
        <VideoDialog {...(video.src ? {videoSrc:video.src,poster:video.poster} : {videoId:video.youtubeId!})} title={video.title} aria-label={`${es ? 'Ver video' : 'Watch video'}: ${video.title}${video.variant ? ` · ${video.variant}` : ''}`} className="design-button video-library-play"><Play size={18} aria-hidden="true"/>{es ? 'Ver video' : 'Watch video'}</VideoDialog>
        {video.reflectionHref ? <Link className="design-text-link" href={video.reflectionHref}>{es ? 'Leer la reflexión' : 'Read the reflection'}</Link> : null}
      </div>
    </article>)}</div>
    {!filtered.length ? <p>{es ? 'No se encontraron videos. Prueba con otra búsqueda.' : 'No videos found. Try another search.'}</p> : null}
    {filtered.length > limit ? <button className="design-button video-library-more" onClick={() => setLimit(value => value + 12)}>{es ? 'Mostrar más videos' : 'Show more videos'} ({Math.min(limit,filtered.length)}/{filtered.length})</button> : null}
  </div>;
}
