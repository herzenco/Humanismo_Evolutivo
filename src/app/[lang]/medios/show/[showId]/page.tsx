import { notFound } from 'next/navigation';
import View from './View';
import { podcastSeries } from '@/data/media';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; showId: string };
export const dynamicParams = false;
export function generateStaticParams() { return podcastSeries.map(item => ({ showId: item.id })); }
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, showId } = await params;
  const item = podcastSeries.find(item => item.id === showId);
  if (!item || !isLanguage(lang)) notFound();
  const dictionary = contentDictionary(lang, (await getPublicSiteData()).content); const title = dictionary[item.titleKey]; const description = dictionary[item.descriptionKey]; const image = item.coverImage;
  return pageMetadata({ title, description: description.slice(0, 160), image, path: `/medios/show/${showId}`, language: lang });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!isLanguage(resolved.lang) || !podcastSeries.some(item => item.id === resolved.showId)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
