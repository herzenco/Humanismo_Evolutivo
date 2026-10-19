import { PlayCircle, Video } from 'lucide-react';
import VideoDialog from './VideoDialog';

// Add the supplied video IDs here when the tutorial and philosophers videos are ready.
const homepageVideos: { tutorial: string | null; philosophers: string | null } = {
  tutorial: null,
  philosophers: null,
};

export function TutorialVideoButton() {
  if (homepageVideos.tutorial) {
    return <VideoDialog videoId={homepageVideos.tutorial} title="Descubre todo su contenido" className="home-tutorial-button"><PlayCircle size={20} />Descubre todo su contenido</VideoDialog>;
  }

  return <div className="home-tutorial">
    <button type="button" className="home-tutorial-button" disabled aria-describedby="tutorial-video-status"><PlayCircle size={20} />Descubre todo su contenido</button>
    <p id="tutorial-video-status" className="home-video-status">Video tutorial · Próximamente</p>
  </div>;
}

export function PhilosophersVideo() {
  const title = 'Conoce a los tres filósofos';
  if (homepageVideos.philosophers) {
    return <VideoDialog videoId={homepageVideos.philosophers} title={title} className="home-philosophers-video"><PlayCircle size={52} strokeWidth={1.4} /><span>Conoce a los tres filósofos</span><span>Reproducir video</span></VideoDialog>;
  }

  return <div className="home-philosophers-video home-video-pending" role="region" aria-label="Próximo video de los tres filósofos">
    <Video size={44} strokeWidth={1.3} aria-hidden="true" />
    <span>Conoce a los tres filósofos</span>
    <p>Video · Próximamente</p>
  </div>;
}
