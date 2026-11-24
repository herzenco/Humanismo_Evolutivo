import { notFound } from 'next/navigation';
import View from './View';
import { getPodcastSeries } from '@/lib/qa-resources';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; showId: string };
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, showId } = await params;
  if (!isLanguage(lang)) notFound();
  const item = (await getPodcastSeries(lang)).find(item => item.id === showId);
  if (!item) notFound();
  const dictionary = contentDictionary(lang, (await getPublicSiteData()).content); const title = `Podcast: ${(dictionary[item.titleKey] ?? item.titleKey)}`; const description = dictionary[item.descriptionKey] ?? item.descriptionKey; const image = item.coverImage;
  return pageMetadata({ title, description: description.slice(0, 160), image, path: `/medios/show/${showId}`, language: lang });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!isLanguage(resolved.lang)) notFound();
  const show = (await getPodcastSeries(resolved.lang)).find(item => item.id === resolved.showId);
  if (!show) notFound();
  return <View show={show} />;
}
