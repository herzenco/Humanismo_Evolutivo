'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTx } from '@/components/design/useTx';
import { homeVideos } from '@/config/home-videos';
import { PlayCircle } from 'lucide-react';
import VideoDialog from './VideoDialog';

// The tutorial is pending; the introduction video belongs in the philosophers section.
const homepageVideos: { tutorial: string | null } = {
  tutorial: null,
};

export function TutorialVideoButton() {
  const tx = useTx();
  if (homepageVideos.tutorial) {
    return <VideoDialog videoId={homepageVideos.tutorial} title={tx("Descubre todo su contenido")} className="home-tutorial-button"><PlayCircle size={20} />{tx("Descubre todo su contenido")}</VideoDialog>;
  }

  return <div className="home-tutorial">
    <button type="button" className="home-tutorial-button" disabled aria-describedby="tutorial-video-status"><PlayCircle size={20} />{tx("Descubre todo su contenido")}</button>
    <p id="tutorial-video-status" className="home-video-status">{tx("Video tutorial · Próximamente")}</p>
  </div>;
}

export function PhilosophersVideo({ children, className = 'design-button home-philosophers-action', 'aria-label': ariaLabel }: { children?: ReactNode; className?: string; 'aria-label'?: string }) {
  const tx = useTx();
  const { language } = useLanguage();
  return <VideoDialog {...(ariaLabel ? { 'aria-label': ariaLabel } : {})} videoSrc={homeVideos.philosophers.src} poster={homeVideos.philosophers.poster} title={tx("Introducción al Humanismo Evolutivo")} className={className}>
    {children ?? <><PlayCircle size={20} aria-hidden="true" /><span>{language === 'es' ? 'Ver el video de los tres filósofos' : 'Watch the three philosophers video'}</span></>}
  </VideoDialog>;
}
