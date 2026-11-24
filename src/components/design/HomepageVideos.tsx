'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTx } from '@/components/design/useTx';
import { homeVideos, welcomeVideoYouTubeId } from '@/config/home-videos';
import { PlayCircle } from 'lucide-react';
import VideoDialog from './VideoDialog';

export function TutorialVideoButton() {
  const tx = useTx();
  if (homeVideos.tutorial.youtubeId) {
    return <VideoDialog videoId={homeVideos.tutorial.youtubeId} title={tx("Descubre todo su contenido")} className="home-tutorial-button"><PlayCircle size={20} aria-hidden="true" />{tx("Descubre todo su contenido")}</VideoDialog>;
  }

  return <a href="#contenidos" className="home-tutorial-button">{tx("Descubre todo su contenido")}</a>;
}

export function PhilosophersVideo({ children, className = 'design-button home-philosophers-action', 'aria-label': ariaLabel }: { children?: ReactNode; className?: string; 'aria-label'?: string }) {
  const tx = useTx();
  const { language } = useLanguage();
  return <VideoDialog aria-label={ariaLabel} videoId={welcomeVideoYouTubeId} title={tx("Introducción al Humanismo Evolutivo")} className={className}>
    {children ?? <><PlayCircle size={20} aria-hidden="true" /><span>{language === 'es' ? 'Ver el video de los tres filósofos' : 'Watch the three philosophers video'}</span></>}
  </VideoDialog>;
}
