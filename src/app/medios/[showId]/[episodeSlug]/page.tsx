import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { podcastSeries } from '@/data/media';
import { getPodcastEpisodeContent } from '@/data/podcastEpisodeContent';

const siteUrl = 'https://humanismoevolutivo.com';

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

  if (!parentSeries || !episode) {
    return null;
  }

  const suppliedContent = getPodcastEpisodeContent(episode.audioUrl);
  const title = suppliedContent?.title ?? episode.titleKey;
  const description = suppliedContent?.description ?? episode.descriptionKey;
  const embedUrl = suppliedContent?.embedUrl;
  const episodeNumber = parentSeries.episodes.findIndex((item) => item.slug === episodeSlug) + 1;

  return {
    parentSeries,
    episode,
    suppliedContent,
    title,
    description,
    embedUrl,
    episodeNumber,
  };
}

function truncateDescription(description: string) {
  return description.length > 160 ? `${description.slice(0, 157)}...` : description;
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
      title: 'Episodio no encontrado | Humanismo Evolutivo',
      robots: { index: false, follow: false },
    };
  }

  const { parentSeries, episode, title, description, episodeNumber } = episodePage;
  const seriesTitle = seriesTitles[parentSeries.id] ?? parentSeries.id;
  const url = `${siteUrl}/medios/${parentSeries.id}/${episode.slug}`;
  const metaDescription = truncateDescription(description);

  return {
    metadataBase: new URL(siteUrl),
    title: `${title} | ${seriesTitle}`,
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: `${title} | ${seriesTitle}`,
      description: metaDescription,
      siteName: 'Humanismo Evolutivo',
      images: [{ url: parentSeries.coverImage }],
      publishedTime: episode.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${seriesTitle}`,
      description: metaDescription,
      images: [parentSeries.coverImage],
    },
    other: {
      'podcast:episode': String(episodeNumber),
    },
  };
}

export const dynamicParams = false;

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<EpisodePageParams>;
}) {
  const resolvedParams = await params;
  const episodePage = findEpisode(resolvedParams);

  if (!episodePage) {
    redirect('/medios');
  }

  const { parentSeries, episode, title, description, embedUrl, episodeNumber } = episodePage;
  const currentIndex = parentSeries.episodes.findIndex((item) => item.slug === episode.slug);
  const prevEpisode = currentIndex > 0 ? parentSeries.episodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < parentSeries.episodes.length - 1 ? parentSeries.episodes[currentIndex + 1] : null;
  const seriesTitle = seriesTitles[parentSeries.id] ?? parentSeries.id;
  const pageUrl = `${siteUrl}/medios/${parentSeries.id}/${episode.slug}`;
  const descriptionParagraphs = description.split(/\n{2,}/).filter(Boolean);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: title,
    description,
    url: pageUrl,
    datePublished: episode.date,
    duration: `PT${episode.duration.replace(' min', 'M')}`,
    episodeNumber,
    image: parentSeries.coverImage,
    associatedMedia: embedUrl
      ? {
          '@type': 'AudioObject',
          embedUrl,
          contentUrl: episode.audioUrl,
        }
      : undefined,
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: seriesTitle,
      author: {
        '@type': 'Person',
        name: 'Marcos Constandse Madrazo',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Fundación Humanismo Evolutivo',
        url: siteUrl,
      },
    },
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative py-20 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url('${parentSeries.coverImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-navy/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            href={`/medios/show/${parentSeries.id}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al podcast
          </Link>

          <div className="max-w-4xl">
            <Badge variant="secondary" className="bg-gold/90 text-navy-dark font-medium mb-6">
              {seriesTitle}
            </Badge>

            <h1 className="font-heading text-4xl md:text-6xl font-light mb-6 leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(episode.date).toLocaleDateString('es-ES')}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                {episode.duration}
              </div>
            </div>

            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
              {descriptionParagraphs[0]}
            </p>

            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-navy-dark font-medium">
              <a href={episode.audioUrl} target="_blank" rel="noopener noreferrer">
                Escuchar en Spotify
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {embedUrl && (
              <div className="mb-12">
                <iframe
                  title={`${title} en Spotify`}
                  style={{ borderRadius: '12px' }}
                  src={embedUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}

            <article className="prose prose-lg max-w-none mb-12">
              <h2 className="font-heading text-2xl text-navy-dark mb-4">Sobre este episodio</h2>
              <div className="space-y-5 text-navy-light leading-relaxed">
                {descriptionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-cream">
              {prevEpisode ? (
                <Button asChild variant="outline" className="flex-1 justify-start">
                  <Link href={`/medios/${parentSeries.id}/${prevEpisode.slug}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Episodio anterior
                  </Link>
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {nextEpisode ? (
                <Button asChild variant="outline" className="flex-1 justify-end">
                  <Link href={`/medios/${parentSeries.id}/${nextEpisode.slug}`}>
                    Siguiente episodio
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
