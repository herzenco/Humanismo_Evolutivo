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
  const title = videoId === '1'
    ? lang === 'es' ? 'Video: ingreso de Marcos Constandse a la SMGE' : 'Video: Marcos Constandse joins the SMGE'
    : dictionary[video.titleKey];
  const description = videoId === '1'
    ? lang === 'es'
      ? 'Mira la grabación de la ceremonia de ingreso de Marcos Constandse Madrazo a la Sociedad Mexicana de Geografía y Estadística.'
      : 'Watch the recording of Marcos Constandse Madrazo’s induction into the Mexican Society of Geography and Statistics.'
    : dictionary[video.descriptionKey].slice(0, 160);
  return pageMetadata({ title, description, path: `/video/${videoId}`, language: lang, image: video.imageUrl });
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (!videos.some(video => String(video.id) === resolved.videoId) || !isLanguage(resolved.lang)) notFound();
  return <View params={Promise.resolve(resolved)} />;
}
