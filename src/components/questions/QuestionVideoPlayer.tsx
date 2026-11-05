import { FileText, Film } from 'lucide-react';
import type { QuestionVideo } from '@/data/questions';

type Props = { title: string; videos: QuestionVideo[] };
export default function QuestionVideoPlayer({ title, videos }: Props) {
  const video = videos.find(option => option.orientation === 'horizontal') || videos[0];
  if (!video) return null;
  return <section className="question-video" aria-label={`Video: ${title}`}>
    <div className="question-video-heading"><h2><Film size={22} aria-hidden="true" />Mira y reflexiona</h2><a href="#question-narration"><FileText size={16} aria-hidden="true" />Leer reflexión</a></div>
    <div className={`question-video-frame question-video-${video.orientation}`}>
      <video key={video.src} controls playsInline preload="none" poster={video.poster} aria-label={`${title} - ${video.label}`}>
        <source src={video.src} type="video/mp4" />
        Tu navegador no admite este video. <a href={video.src}>Abrir el video</a>.
      </video>
    </div>
  </section>;
}
