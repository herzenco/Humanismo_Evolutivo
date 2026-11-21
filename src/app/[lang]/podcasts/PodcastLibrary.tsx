'use client';

import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { ArrowRight, Headphones, Radio } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { podcastSeries } from '@/data/media';
import { books } from '@/data/books';
import { supabase } from '@/integrations/supabase/client';

export default function PodcastLibrary() {
  const { t, language } = useLanguage();
  const es = language === 'es';
  const { data: dbSeries } = useQuery({ queryKey: ['podcast-series'], queryFn: async () => {
    const { data, error } = await supabase.from('podcast_series').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }});
  return <div className="design-media-grid">{podcastSeries.map(series => {
          const storedCover = dbSeries?.find(row => row.book_id === series.id)?.cover_image_url;
          const bookCover = books.find(book => book.id === series.id)?.coverImage;
          const fallback = series.coverImage || bookCover || series.coverImage;
          const cover = storedCover && !storedCover.includes('null-podcast-cover') ? storedCover : fallback;
          return <article className="design-media-card" key={series.id}><Link href={`/medios/show/${series.id}`} className="design-media-cover"><Image width={280} height={280} sizes="(max-width: 640px) 120px, 140px" src={cover} alt={t(series.titleKey)} loading="lazy" /><span><Headphones size={16} aria-hidden="true" />{series.episodes.length} {es ? 'episodios' : 'episodes'}</span></Link><div><span className="design-eyebrow"><Radio size={15} />{es ? 'SERIE DE PODCAST' : 'PODCAST SERIES'}</span><h3><Link href={`/medios/show/${series.id}`}>{t(series.titleKey)}</Link></h3><p>{t(series.descriptionKey)}</p><Link href={`/medios/show/${series.id}`} className="design-text-link">{es ? 'Explorar episodios' : 'Explore episodes'}<ArrowRight size={18} /></Link></div></article>;
        })}</div>;
}
