import { books } from '@/data/books';
import { events } from '@/data/events';
import { podcastSeries } from '@/data/media';
export function indexablePaths() {
  return [
    '/', '/autor', '/libros', '/medios', '/eventos', '/contacto', '/vision', '/chatbot', '/privacidad', '/terminos',
    ...books.map(book => `/libros/${book.id}`),
    ...events.map(event => `/eventos/${event.id}`),
    ...podcastSeries.map(series => `/medios/show/${series.id}`),
    ...podcastSeries.flatMap(series => series.episodes.map(episode => `/medios/${series.id}/${episode.slug}`)),
    '/video/1',
  ];
}
