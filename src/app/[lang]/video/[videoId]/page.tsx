import { notFound } from 'next/navigation';
import View from './View';
import { isLanguage } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
type Params = { lang: string; videoId: string };
export const dynamicParams = false;
export function generateStaticParams() { return [{ videoId: '1' }]; }
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, videoId } = await params;
  if (videoId !== '1' || !isLanguage(lang)) notFound();
  const dictionary = contentDictionary(lang, (await getPublicSiteData()).content);
  return pageMetadata({ title: dictionary['video.ep1.title'], description: dictionary['video.ep1.description'].slice(0, 160), path: '/video/1', language: lang, image: 'https://img.youtube.com/vi/HLHjY3NnX2k/hqdefault.jpg' });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (resolved.videoId !== '1' || !isLanguage(resolved.lang)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
