import { notFound } from 'next/navigation';
import MediaHero, { mediaDescription } from '@/components/design/MediaHero';
import VideoLibrary from '@/components/design/VideoLibrary';
import PageWrapper from '@/components/layout/PageWrapper';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: 'Videos', description: mediaDescription('videos', lang), path: '/videos', language: lang, index: true });
}

export default async function VideosPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <PageWrapper>
    <MediaHero kind="videos" language={lang} />
    <section className="design-media-list">
      <div className="design-content-width">
        <div className="design-section-heading"><h2>{lang === 'es' ? 'Ideas que nos conectan' : 'Ideas that connect us'}</h2></div>
        <VideoLibrary />
      </div>
    </section>
  </PageWrapper>;
}
