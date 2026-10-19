'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Headphones, Play, Radio, Video as VideoIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PageWrapper from '@/components/layout/PageWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { podcastSeries, videos } from '@/data/media';
import { books } from '@/data/books';
import { supabase } from '@/integrations/supabase/client';

type MediaTab = 'podcasts' | 'videos';
export default function MediaPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<MediaTab>('podcasts');
  const es = language === 'es';
  useEffect(() => {
    const update = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') === 'videos' || window.location.hash === '#videos' ? 'videos' : 'podcasts');
    };
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const { data: dbSeries } = useQuery({ queryKey: ['podcast-series'], queryFn: async () => {
    const { data, error } = await supabase.from('podcast_series').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }});
  const changeTab = (tab: MediaTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    url.hash = '';
    window.history.replaceState(null, '', url);
    window.dataLayer?.push({ event: 'media_tab_click', tab_name: tab });
  };
  return <PageWrapper>
    <section className="design-media-hero">
      <div className="design-content-width design-split">
        <div><span className="design-eyebrow">{es ? 'ESCUCHA, MIRA Y REFLEXIONA' : 'LISTEN, WATCH AND REFLECT'}</span><h1>{es ? 'Podcast y ' : 'Podcasts and '}<em>{es ? 'videos' : 'videos'}</em></h1><p>{es ? 'Conversaciones, reflexiones y nuevas perspectivas para acompañarte en el camino de la conciencia. Explora la obra de Marcos Constandse en audio y video.' : 'Conversations, reflections and new perspectives to accompany your journey of consciousness. Explore Marcos Constandse’s work in audio and video.'}</p><div className="design-tab-list" role="tablist" aria-label={es ? 'Tipo de contenido' : 'Content type'}><button id="podcasts-tab" role="tab" aria-selected={activeTab === 'podcasts'} aria-controls="media-panel" onClick={() => changeTab('podcasts')}><Headphones size={20} />Podcasts</button><button id="videos-tab" role="tab" aria-selected={activeTab === 'videos'} aria-controls="media-panel" onClick={() => changeTab('videos')}><VideoIcon size={20} />Videos</button></div></div>
        <div className="design-media-art" aria-hidden="true"><div><Headphones strokeWidth={1} /><span className="design-wave">▂ ▄ ▆ █ ▅ ▃ ▇ █ ▆ ▄ ▂</span></div><span>HUMANISMO EVOLUTIVO</span></div>
      </div>
    </section>
    <section id="media-panel" role="tabpanel" aria-labelledby={`${activeTab}-tab`} className="design-media-list" tabIndex={0}>
      <div className="design-content-width"><div className="design-section-heading"><span className="design-eyebrow">{activeTab === 'podcasts' ? 'PODCASTS' : 'VIDEOS'}</span><h2>{activeTab === 'podcasts' ? (es ? 'Una serie para cada búsqueda' : 'A series for every journey') : (es ? 'Ideas que nos conectan' : 'Ideas that connect us')}</h2></div>
        {activeTab === 'podcasts' ? <div className="design-media-grid">{podcastSeries.map(series => {
          const cover = dbSeries?.find(row => row.book_id === series.id)?.cover_image_url || books.find(book => book.id === series.id)?.coverImage || series.coverImage;
          return <article className="design-media-card" key={series.id}><Link href={`/medios/show/${series.id}`} className="design-media-cover" aria-label={t(series.titleKey)}><img src={cover} alt={t(series.titleKey)} loading="lazy" /><span><Headphones size={16} />{series.episodes.length} {es ? 'episodios' : 'episodes'}</span></Link><div><span className="design-eyebrow"><Radio size={15} />{es ? 'SERIE DE PODCAST' : 'PODCAST SERIES'}</span><h3><Link href={`/medios/show/${series.id}`}>{t(series.titleKey)}</Link></h3><p>{t(series.descriptionKey)}</p><Link href={`/medios/show/${series.id}`} className="design-text-link">{es ? 'Explorar episodios' : 'Explore episodes'}<ArrowRight size={18} /></Link></div></article>;
        })}</div> : <div className="design-media-grid">{videos.map(video => <article className="design-media-card" key={video.id}><Link href={`/video/${video.id}`} className="design-media-cover" aria-label={t(video.titleKey)}><img src={video.imageUrl} alt={t(video.titleKey)} loading="lazy" /><span><Play size={16} />{video.duration}</span></Link><div><span className="design-eyebrow">{t(video.categoryKey)}</span><h3><Link href={`/video/${video.id}`}>{t(video.titleKey)}</Link></h3><p>{t(video.descriptionKey)}</p><Link href={`/video/${video.id}`} className="design-text-link">{es ? 'Ver video' : 'Watch video'}<ArrowRight size={18} /></Link></div></article>)}</div>}
      </div>
    </section>
  </PageWrapper>;
}
