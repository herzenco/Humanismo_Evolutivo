import { PlayCircle } from 'lucide-react';
import VideoDialog from './VideoDialog';

import { homepageVideos } from '@/config/videos';

export function TutorialVideoButton() {
  if (homepageVideos.overview.youtubeId) {
    return <VideoDialog videoId={homepageVideos.overview.youtubeId} title="Descubre todo su contenido" className="home-tutorial-button"><PlayCircle size={20} />Descubre todo su contenido</VideoDialog>;
  }

  return <div className="home-tutorial">
    <button type="button" className="home-tutorial-button" disabled aria-describedby="tutorial-video-status"><PlayCircle size={20} />Descubre todo su contenido</button>
    <p id="tutorial-video-status" className="home-video-status">Resumen · 8 minutos · Próximamente</p>
  </div>;
}

export function PhilosophersVideo() {
  return (<VideoDialog aria-label="Reproducir el video: Introducción a la filosofía del Humanismo Evolutivo Transpersonal" videoId={homepageVideos.philosophers.youtubeId} title="Introducción al Humanismo Evolutivo" className="he-60b095486 home-philosophers-video home-philosophers-video-ready">
<img className="introduction-video-thumbnail" src={`https://i.ytimg.com/vi/${homepageVideos.philosophers.youtubeId}/maxresdefault.jpg`} alt="" width="1280" height="720" loading="lazy" />
<div className="he-204b18f8e he-row">
<span className="he-7cde224f7">
{"PRESENTACIÓN INTRODUCTORIA"}
</span>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4AF5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<rect x="3" y="6" width="13" height="12" rx="2">

</rect>
<path d="M16 10l5-3v10l-5-3z">

</path>
</svg>
</div>
<div className="he-0669f902d he-row he-sized">
<svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true">
<path d="M8 5v14l11-7z" fill="currentColor">

</path>
</svg>
</div>
<span className="he-305e26cca he-sized">
{"Introducción a la filosofía del Humanismo Evolutivo Transpersonal"}
</span>
</VideoDialog>);
}

export function DocumentaryVideo() {
  const video = homepageVideos.documentary;
  return <div className="home-documentary-video">
    {video.youtubeId ? <VideoDialog videoId={video.youtubeId} title="Documental completo · 47 minutos" className="home-tutorial-button"><PlayCircle size={24} />Ver documental completo · 47 minutos</VideoDialog> : <><button type="button" className="home-tutorial-button" disabled aria-describedby="documentary-status"><PlayCircle size={24} />Documental completo · 47 minutos</button><p id="documentary-status">Próximamente</p></>}
  </div>;
}
