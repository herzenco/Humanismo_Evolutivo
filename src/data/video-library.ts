import { homeVideos } from '../config/home-videos';
import { videos } from './media';
import { events } from './events';
import { publishedQuestions, questionPath } from './questions';
import { questionTitlesEn } from './questionTitlesEn';

type Category = 'introductions' | 'documentaries' | 'events' | 'questions';
export type LibraryVideo = {
  id: string; title: string; description: string; category: Category;
  poster: string; duration?: string; variant?: string; reflectionHref?: string;
} & ({ src: string; youtubeId?: never } | { youtubeId: string; src?: never });
export function youtubeId(url: string) {
  const parsed = new URL(url);
  return parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v') || parsed.pathname.split('/').pop()!;
}
export function videoDuration(seconds: number) {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
export function videoLibrary(t: (key: string) => string, language: 'es' | 'en'): LibraryVideo[] {
  const es = language === 'es';
  const entries: LibraryVideo[] = [
    { id:'introduction', title:es ? 'Introducción a Parque Cancún' : 'Introduction to Parque Cancún', description:es ? 'La bienvenida a Parque Cancún y al Humanismo Evolutivo.' : 'A welcome to Parque Cancún and Evolutionary Humanism.', category:'introductions', src:homeVideos.introduction.src, poster:homeVideos.documentary.poster, duration:videoDuration(homeVideos.introduction.durationSeconds) },
    { id:'philosophers', title:es ? 'Introducción al Humanismo Evolutivo Transpersonal' : 'Introduction to Transpersonal Evolutionary Humanism', description:es ? 'Sócrates, Platón y Aristóteles acompañan esta introducción a la filosofía.' : 'Socrates, Plato and Aristotle guide this introduction to the philosophy.', category:'introductions', src:homeVideos.philosophers.src, poster:'/design/e9d8b6dd9b5bae33ad53213e7108d372.jpg', duration:videoDuration(homeVideos.philosophers.durationSeconds) },
    { id:'documentary', title:es ? 'Documental completo · Parque Cancún' : 'Full documentary · Parque Cancún', description:es ? 'Recorre Parque Cancún y sus jardines de evolución, meditación y filosofía.' : 'Explore Parque Cancún and its gardens of evolution, meditation and philosophy.', category:'documentaries', youtubeId:homeVideos.documentary.youtubeId, poster:homeVideos.documentary.poster },
    ...videos.map(video => ({ id:`video-${video.id}`,title:t(video.titleKey),description:t(video.descriptionKey),category:'events' as const,youtubeId:youtubeId(video.videoUrl),poster:video.imageUrl,duration:video.duration })),
    ...events.filter(event => event.videoUrl).map(event => ({ id:`event-${event.id}`,title:t(event.titleKey),description:t(event.descriptionKey),category:'events' as const,youtubeId:youtubeId(event.videoUrl!),poster:event.imageUrl })),
    ...publishedQuestions().flatMap(question => (question.videos || []).map((video,index) => ({
      id:`question-${question.number}-${index}`,title:`${es ? 'Pregunta' : 'Question'} ${question.number}: ${es ? question.title : questionTitlesEn[question.number] || question.title}`,
      description:question.description,category:'questions' as const,src:video.src,poster:video.poster,duration:videoDuration(video.durationSeconds),
      variant:`${video.kind === 'dialogue' ? (es ? 'Diálogo' : 'Dialogue') : (es ? 'Narración' : 'Narration')} · ${video.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}`,
      reflectionHref:questionPath(question.number),
    }))),
  ];
  const seen = new Set<string>();
  return entries.filter(video => {
    const source = video.src || `youtube:${video.youtubeId}`;
    if (seen.has(source)) return false;
    seen.add(source); return true;
  });
}
