import type { Book } from '@/data/books';
import { translations } from '@/data/translations';
const prefixes: Record<string, string> = {
  'yo-soy-nosotros': 'yosoynosotros', 'ecologia-y-espiritualidad': 'ecologia', 'dejalo-ser': 'dejaloser',
  'lo-mejor-esta-por-venir': 'lomejor', 'el-arte-de-ser-empresario': 'elarte',
};
export function localizeBook(book: Book, t: (key: string) => string): Book {
  const prefix = `book.${prefixes[book.id]}`;
  const translated = (suffix: string, fallback: string) => {
    const key = `${prefix}.${suffix}`;
    const value = t(key);
    return value === key ? fallback : value;
  };
  return { ...book, title: translated('title', book.title), subtitle: translated('subtitle', book.subtitle),
    excerpt: translated('excerpt', book.excerpt), description: book.description.map((text, i) => translated(`desc${i + 1}`, text)),
    keywords: book.keywords.map(keyword => {
      const key = Object.entries(translations.es).find(([key, value]) => key.startsWith('keyword.') && value === keyword)?.[0];
      return key ? t(key) : keyword;
    }),
  };
}
