import { videos } from '@/data/media';
import { notFound } from 'next/navigation';
import View from './View';
import { isLanguage } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; videoId: string };
export const dynamicParams = false;
export function generateStaticParams() { return ['es', 'en'].flatMap(lang => videos.map(video => ({ lang, videoId: String(video.id) }))); }
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, videoId } = await params;
  const video = videos.find(video => String(video.id) === videoId);
  if (!video || !isLanguage(lang)) notFound();
  const dictionary = contentDictionary(lang, (await getPublicSiteData()).content);
  return pageMetadata({ title: dictionary[video.titleKey], description: dictionary[video.descriptionKey].slice(0, 160), path: `/video/${videoId}`, language: lang, image: video.imageUrl });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!videos.some(video => String(video.id) === resolved.videoId) || !isLanguage(resolved.lang)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
