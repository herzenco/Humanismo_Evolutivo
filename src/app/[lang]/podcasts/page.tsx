import { notFound } from 'next/navigation';
import MediaHero, { mediaDescription } from '@/components/design/MediaHero';
import PageWrapper from '@/components/layout/PageWrapper';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import { getPodcastSeries } from '@/lib/qa-resources';
import PodcastLibrary from './PodcastLibrary';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: 'Podcasts', description: mediaDescription('podcasts', lang), path: '/podcasts', language: lang, index: true });
}

export default async function PodcastsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <PageWrapper>
    <MediaHero kind="podcasts" language={lang} />
    <section className="design-media-list">
      <div className="design-content-width">
        <div className="design-section-heading"><h2>{lang === 'es' ? 'Una serie para cada búsqueda' : 'A series for every journey'}</h2></div>
        <PodcastLibrary podcastSeries={await getPodcastSeries(lang)} />
      </div>
    </section>
  </PageWrapper>;
}
