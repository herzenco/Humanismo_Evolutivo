import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { podcastSeries } from '@/data/media';
import { getPodcastEpisodeContent } from '@/data/podcastEpisodeContent';
import PodcastEpisodeClient from '@/components/media/PodcastEpisodeClient';

const siteUrl = 'https://www.humanismoevolutivo.com';

const seriesTitles: Record<string, string> = {
  'yo-soy-nosotros': 'Yo Soy Nosotros',
  'lo-mejor-esta-por-venir': 'Y lo mejor está por venir',
  'el-arte-de-ser-empresario': 'El arte de ser empresario',
  'ecologia-y-espiritualidad': 'Ecología y espiritualidad',
};

type EpisodePageParams = {
  showId: string;
  episodeSlug: string;
};

function findEpisode({ showId, episodeSlug }: EpisodePageParams) {
  const parentSeries = podcastSeries.find((series) => series.id === showId);
  const episode = parentSeries?.episodes.find((item) => item.slug === episodeSlug);

  if (!parentSeries || !episode) return null;

  const suppliedContent = getPodcastEpisodeContent(episode.audioUrl);
  const title = suppliedContent?.title ?? episode.titleKey;
  const description = suppliedContent?.description ?? episode.descriptionKey;
  const episodeNumber = parentSeries.episodes.findIndex((item) => item.slug === episodeSlug) + 1;

  return { parentSeries, episode, title, description, episodeNumber };
}

function truncateDescription(description: string) {
  return description.length > 160 ? description.slice(0, 157) + '...' : description;
}

export function generateStaticParams() {
  return podcastSeries.flatMap((series) =>
    series.episodes.map((episode) => ({
      showId: series.id,
      episodeSlug: episode.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EpisodePageParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const episodePage = findEpisode(resolvedParams);

  if (!episodePage) {
    return {
      title: 'Episodio no encontrado | Humanismo Evolutivo Transpersonal',
      robots: { index: false, follow: false },
    };
  }

  const { parentSeries, episode, title, description, episodeNumber } = episodePage;
  const seriesTitle = seriesTitles[parentSeries.id] ?? parentSeries.id;
  const url = siteUrl + '/medios/' + parentSeries.id + '/' + episode.slug;
  const metaDescription = truncateDescription(description);
  const fullTitle = title + ' | ' + seriesTitle;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: 'article',
      url,
      title: fullTitle,
      description: metaDescription,
      siteName: 'Humanismo Evolutivo Transpersonal',
      images: [{ url: parentSeries.coverImage }],
      publishedTime: episode.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [parentSeries.coverImage],
    },
    other: { 'podcast:episode': String(episodeNumber) },
  };
}

export const dynamicParams = false;

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<EpisodePageParams>;
}) {
  const resolvedParams = await params;
  if (!findEpisode(resolvedParams)) redirect('/medios');

  return (
    <PodcastEpisodeClient
      showId={resolvedParams.showId}
      episodeSlug={resolvedParams.episodeSlug}
    />
  );
}
