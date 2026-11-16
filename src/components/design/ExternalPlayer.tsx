'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  src: string;
  title: string;
  provider: 'YouTube' | 'Spotify';
};

export default function ExternalPlayer({ src, title, provider }: Props) {
  const { language } = useLanguage();
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const es = language === 'es';

  return (
    <div className={provider === 'Spotify' ? 'rounded-xl bg-navy-dark' : 'aspect-video rounded-xl bg-navy-dark'}>
      {activeSource === src ? (
        <iframe
          className={provider === 'Spotify' ? 'block h-[352px] w-full rounded-xl border-0' : 'block h-full w-full rounded-xl border-0'}
          ref={(frame) => { frame?.focus(); }}
          src={src}
          title={title}
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2 p-4 text-center text-white">
          <button type="button" className="min-h-11 rounded-full bg-white px-4 font-semibold text-[#173f2c]" onClick={() => setActiveSource(src)}>
            {es ? `Cargar reproductor de ${provider}` : `Load ${provider} player`}
          </button>
          <p className="text-sm">{es ? `${provider} puede usar cookies al cargar el reproductor.` : `${provider} may use cookies when the player loads.`}</p>
        </div>
      )}
    </div>
  );
}
