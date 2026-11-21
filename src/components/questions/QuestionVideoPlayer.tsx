'use client';

import { useState } from 'react';
import { FileText, Film } from 'lucide-react';
import type { QuestionVideo } from '@/data/questions';
import type { Language } from '@/lib/site';

type Props = { title: string; videos: QuestionVideo[]; language?: Language };

export default function QuestionVideoPlayer({ title, videos, language = 'es' }: Props) {
  const [selectedSource, setSelectedSource] = useState<string>();
  const en = language === 'en';
  const label = (option: QuestionVideo) => en
    ? option.kind === 'narration' ? 'Narration' : `Dialogue (${option.orientation})`
    : option.label;
  const video = videos.find(option => option.src === selectedSource)
    ?? videos.find(option => option.orientation === 'horizontal')
    ?? videos[0];
  if (!video) return null;

  return <section className="question-video" aria-label={`Video: ${title}`}>
    <div className="question-video-heading">
      <h2><Film size={22} aria-hidden="true" />{en ? 'Watch and reflect' : 'Mira y reflexiona'}</h2>
      <a href="#question-narration"><FileText size={16} aria-hidden="true" />{en ? 'Read the reflection' : 'Leer reflexión'}</a>
    </div>
    {videos.length > 1 && <div className="question-video-options" role="group" aria-label={en ? 'Video version' : 'Versión del video'}>
      {videos.map(option => <button key={option.src} type="button" aria-pressed={video.src === option.src} onClick={() => setSelectedSource(option.src)}>
        {label(option)}
      </button>)}
    </div>}
    <div className={`question-video-frame question-video-${video.orientation}`}>
      <video key={video.src} controls playsInline preload="none" poster={video.poster} aria-label={`${title} — ${label(video)}`}>
        <source src={video.src} type="video/mp4" />
        <a href={video.src}>{en ? 'Open the video' : 'Abrir el video'}</a>
      </video>
    </div>
  </section>;
}
