import { Headphones, Video } from 'lucide-react';
import type { Language } from '@/lib/site';

const descriptions = {
  videos: {
    es: 'Explora introducciones, documentales y conferencias sobre el Humanismo Evolutivo.',
    en: 'Explore introductions, documentaries and talks on Evolutionary Humanism.',
  },
  podcasts: {
    es: 'Escucha conversaciones y reflexiones sobre conciencia, filosofía, ecología y espíritu.',
    en: 'Listen to conversations and reflections on consciousness, philosophy, ecology and spirituality.',
  },
};

export function mediaDescription(kind: keyof typeof descriptions, language: Language) {
  return descriptions[kind][language];
}

export default function MediaHero({ kind, language }: { kind: keyof typeof descriptions; language: Language }) {
  const podcasts = kind === 'podcasts';
  const Icon = podcasts ? Headphones : Video;
  return <section className="design-media-hero">
    <div className="design-content-width design-split">
      <div>
        <h1>{podcasts ? 'Podcasts' : 'Videos'}</h1>
        <p>{mediaDescription(kind, language)}</p>
      </div>
      <div className="design-media-art" aria-hidden="true">
        <div><Icon strokeWidth={1} />{podcasts && <span className="design-wave">▂ ▄ ▆ █ ▆ ▄ ▂</span>}</div>
        <span>HUMANISMO EVOLUTIVO</span>
      </div>
    </div>
  </section>;
}
