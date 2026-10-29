import { notFound } from 'next/navigation';
import View from './View';
import { events } from '@/data/events';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; eventId: string };
export const dynamicParams = false;
export function generateStaticParams() { return ['es', 'en'].flatMap(lang => events.map(item => ({ lang, eventId: item.id }))); }
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, eventId } = await params;
  const item = events.find(item => item.id === eventId);
  if (!item || !isLanguage(lang)) notFound();
  const dictionary = contentDictionary(lang, (await getPublicSiteData()).content); const title = dictionary[item.titleKey]; const description = dictionary[item.descriptionKey]; const image = item.imageUrl;
  return pageMetadata({ title, description: description.slice(0, 160), image, path: `/eventos/${eventId}`, language: lang });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!isLanguage(resolved.lang) || !events.some(item => item.id === resolved.eventId)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
