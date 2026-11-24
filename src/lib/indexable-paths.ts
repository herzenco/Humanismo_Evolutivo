import { books } from '@/data/books';
import { events } from '@/data/events';
import { schoolCourses, schoolCoursePath } from '@/data/school-calendar-2027';
import { podcastSeries } from '@/data/media';
export function indexablePaths() {
  return [
    '/', '/autor', '/libros', '/clases', '/jardines', '/videos', '/podcasts', '/boletin', '/eventos', '/contacto', '/vision', '/privacidad', '/terminos',
    ...schoolCourses.map(course => schoolCoursePath(course.id)),
    ...books.map(book => `/libros/${book.id}`),
    ...events.map(event => `/eventos/${event.id}`),
    ...podcastSeries.map(series => `/medios/show/${series.id}`),
    ...podcastSeries.flatMap(series => series.episodes.map(episode => `/medios/${series.id}/${episode.slug}`)),
    '/video/1',
  ];
}
