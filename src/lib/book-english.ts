import type { Book } from '@/data/books';
import { localizeBook } from '@/lib/localized-books';
import type { Language } from '@/lib/site';

const titleRewrites: [string, string][] = [
  ['And The Best Is Yet To Come!', '¡Y lo mejor aún está por venir!'],
  ['The Best Is Yet To Come', '¡Y lo mejor aún está por venir!'],
  ['The Art of Being an Entrepreneur', 'El arte de ser empresario'],
  ['Ecology and Spirituality', 'Ecología y espiritualidad'],
  ['Yo Soy Nosotros', 'Yo soy nosotros'],
  ['Let It Be', '¡Déjalo ser!'],
];

const extraKeywords: Record<string, string> = { Conciencia: 'Consciousness' };

export function restoreSpanishBookTitles(text: string) {
  return titleRewrites.reduce((value, [from, to]) => value.replaceAll(from, to), text);
}

/** Spanish book titles stay unchanged. English uses the existing subtitle, excerpt, and description copy. */
export function bookForLanguage(book: Book, language: Language, t: (key: string) => string): Book {
  if (language !== 'en') return book;
  const localized = localizeBook(book, t);
  return {
    ...localized,
    title: book.title,
    excerpt: restoreSpanishBookTitles(localized.excerpt),
    description: localized.description.map(restoreSpanishBookTitles),
    keywords: localized.keywords.map(keyword => extraKeywords[keyword] ?? keyword),
  };
}

export const upcomingEnglishSubtitles: Record<string, string> = {
  'biografia-mcm': 'Biography of Marcos Constandse Madrazo',
  'los-jardines': 'The gardens of Transpersonal Evolutionary Humanism',
  'introduccion-al-pensamiento-filosofico': 'Introduction to the philosophical thought of Transpersonal Evolutionary Humanism',
  'introduccion-a-la-filosofia-de-occidente': 'Introduction to Western philosophy',
  'iniciacion-a-la-antropologia': 'Introduction to anthropology',
};
