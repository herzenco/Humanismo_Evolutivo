import { notFound } from 'next/navigation';
import View from './View';
import { localizeBook } from '@/lib/localized-books';
import { books } from '@/data/books';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; bookId: string };
export const dynamicParams = false;
export function generateStaticParams() { return books.map(item => ({ bookId: item.id })); }
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, bookId } = await params;
  const item = books.find(item => item.id === bookId);
  if (!item || !isLanguage(lang)) notFound();
  const data = await getPublicSiteData();
  const dictionary = contentDictionary(lang, data.content);
  const localized = localizeBook(item, key => dictionary[key] ?? key);
  const title = localized.title; const description = localized.excerpt;
  const image = data.images.find(image => image.category === 'book-cover' && image.key === item.id)?.url || item.coverImage;
  return pageMetadata({ title, description: description.slice(0, 160), image, path: `/libros/${bookId}`, language: lang });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!isLanguage(resolved.lang) || !books.some(item => item.id === resolved.bookId)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
