'use client';
import { useMemo, useState } from 'react';
import { Play, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { videoLibrary, type LibraryVideo } from '@/data/video-library';
import { videoPayload, type resourceRow } from '@/lib/qa-resource-contract';
import type { z } from 'zod';
import VideoDialog from './VideoDialog';

export default function VideoLibrary({ changes = [] }: { changes?: z.infer<typeof resourceRow>[] }) {
  const { t, language } = useLanguage();
  const es = language === 'es';
  const [query,setQuery] = useState('');
  const [category,setCategory] = useState('all');
  const [limit,setLimit] = useState(12);
  const all = useMemo(() => {
    const entries = new Map(videoLibrary(t, language).map(video => [video.id, video]));
    for (const change of changes) {
      if (change.payload === null) {
        entries.delete(change.slug);
        continue;
      }
      const { data } = videoPayload.safeParse(change.payload);
      if (!data) continue;
      const video: LibraryVideo = {
        id: change.slug,
        title: es ? data.title : data.titleEn || data.title,
        description: es ? data.description : data.descriptionEn || data.description,
        category: data.category,
        poster: data.poster,
        duration: data.duration,
        ...(data.source.startsWith('youtube:')
          ? { youtubeId: data.source.slice(8) }
          : { src: data.source }),
      };
      entries.set(video.id, video);
    }
    return [...entries.values()];
  }, [t, language, es, changes]);
  const categories: Record<string,string> = {all:es ? 'Todos los videos' : 'All videos',introductions:es ? 'Introducciones' : 'Introductions',documentaries:es ? 'Documentales' : 'Documentaries',events:es ? 'Conferencias y eventos' : 'Talks and events'};
  const normalize = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered = all.filter(video => (category === 'all' || video.category === category) && normalize(`${video.title} ${video.description}`).includes(normalize(query.trim())));
  return <div className="video-library">
    <div className="video-library-tools">
      <label><Search size={18} aria-hidden="true"/><span className="sr-only">{es ? 'Buscar videos' : 'Search videos'}</span><input type="search" value={query} placeholder={es ? 'Buscar por título o tema…' : 'Search by title or topic…'} onChange={event => {setQuery(event.target.value);setLimit(12);}}/></label>
      <label><span className="sr-only">{es ? 'Categoría de videos' : 'Video category'}</span><select value={category} onChange={event => {setCategory(event.target.value);setLimit(12);}}>{Object.entries(categories).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    </div>
    <p className="video-library-count" role="status">{filtered.length} {filtered.length === 1 ? 'video' : 'videos'} · {es ? 'Biblioteca de videos del sitio' : 'Website video library'}</p>
    <div className="video-gallery">{filtered.slice(0,limit).map(video => <article className="video-gallery-card" key={video.id}>
      <div className="video-gallery-thumbnail"><img width="640" height="360" src={video.poster} alt="" loading="lazy"/><span><Play size={16} aria-hidden="true"/>{video.duration || (es ? 'Video completo' : 'Full video')}</span></div>
      <div className="video-gallery-copy"><span className="design-eyebrow">{categories[video.category]}</span><h3>{video.title}</h3><p>{video.description}</p>
        <VideoDialog {...(video.src ? {videoSrc:video.src,poster:video.poster} : {videoId:video.youtubeId!})} title={video.title} aria-label={`${es ? 'Ver video' : 'Watch video'}: ${video.title}`} className="design-button video-library-play"><Play size={18} aria-hidden="true"/>{es ? 'Ver video' : 'Watch video'}</VideoDialog>
      </div>
    </article>)}</div>
    {!filtered.length ? <p>{es ? 'No se encontraron videos. Prueba con otra búsqueda.' : 'No videos found. Try another search.'}</p> : null}
    {filtered.length > limit ? <button className="design-button video-library-more" onClick={() => setLimit(value => value + 12)}>{es ? 'Mostrar más videos' : 'Show more videos'} ({Math.min(limit,filtered.length)}/{filtered.length})</button> : null}
  </div>;
}
