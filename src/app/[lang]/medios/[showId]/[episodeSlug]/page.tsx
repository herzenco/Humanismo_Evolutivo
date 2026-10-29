import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage, absoluteUrl, SITE_URL, type Language } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { contentDictionary } from '@/lib/content';
import { getPublicSiteData } from '@/lib/public-content';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import PageWrapper from '@/components/layout/PageWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { podcastSeries } from '@/data/media';
import { localizedEpisodeContent } from '@/data/podcastEpisodeContent';

const siteUrl = SITE_URL;

const seriesTitles: Record<string, string> = {
  'yo-soy-nosotros': 'Yo Soy Nosotros',
  'lo-mejor-esta-por-venir': 'Y lo mejor está por venir',
  'el-arte-de-ser-empresario': 'El arte de ser empresario',
  'ecologia-y-espiritualidad': 'Ecología y espiritualidad',
};

type EpisodePageParams = {
  lang: string;
  showId: string;
  episodeSlug: string;
};

function findEpisode({ showId, episodeSlug, lang }: EpisodePageParams, dictionary: Record<string, string>) {
  const parentSeries = podcastSeries.find((series) => series.id === showId);
  const episode = parentSeries?.episodes.find((item) => item.slug === episodeSlug);

  if (!parentSeries || !episode) {
    return null;
  }

  const suppliedContent = localizedEpisodeContent(episode, lang === 'en' ? 'en' : 'es', key => dictionary[key] ?? key);
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
  const dictionary = contentDictionary(resolvedParams.lang === 'en' ? 'en' : 'es', (await getPublicSiteData()).content);
  const episodePage = findEpisode(resolvedParams, dictionary);

  if (!episodePage || !isLanguage(resolvedParams.lang)) notFound();
  const { parentSeries, episode, title, description, episodeNumber } = episodePage;
  const seriesTitle = dictionary[parentSeries.titleKey] ?? parentSeries.id;
  const metadata = pageMetadata({ title: `${title} | ${seriesTitle}`, description: truncateDescription(description),
    path: `/medios/${parentSeries.id}/${episode.slug}`, language: resolvedParams.lang, image: parentSeries.coverImage });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article', publishedTime: episode.date },
    other: { 'podcast:episode': String(episodeNumber) } };

}

export const dynamicParams = false;

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<EpisodePageParams>;
}) {
  const resolvedParams = await params;
  const dictionary = contentDictionary(resolvedParams.lang === 'en' ? 'en' : 'es', (await getPublicSiteData()).content);
  const episodePage = findEpisode(resolvedParams, dictionary);

  if (!episodePage || !isLanguage(resolvedParams.lang)) notFound();
  const language = resolvedParams.lang;

  const { parentSeries, episode, title, description, embedUrl, episodeNumber } = episodePage;
  const currentIndex = parentSeries.episodes.findIndex((item) => item.slug === episode.slug);
  const prevEpisode = currentIndex > 0 ? parentSeries.episodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < parentSeries.episodes.length - 1 ? parentSeries.episodes[currentIndex + 1] : null;
  const seriesTitle = dictionary[parentSeries.titleKey] ?? parentSeries.id;
  const pageUrl = absoluteUrl(`/medios/${parentSeries.id}/${episode.slug}`, language);
  const descriptionParagraphs = description.split(/\n{2,}/).filter(Boolean);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: title,
    description,
    url: pageUrl,
    datePublished: episode.date,
    duration: `PT${episode.duration.replace(' min', 'M')}`,
    inLanguage: language,
    episodeNumber,
    image: new URL(parentSeries.coverImage, SITE_URL).href,
    associatedMedia: embedUrl
      ? {
          '@type': 'AudioObject',
          inLanguage: 'es',
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
      <JsonLd data={structuredData} />

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
            {language === 'es' ? 'Volver al podcast' : 'Back to the podcast'}
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
                {new Date(episode.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { timeZone: 'UTC' })}
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
                {language === 'es' ? 'Escuchar en Spotify' : 'Listen on Spotify'}
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
              <h2 className="font-heading text-2xl text-navy-dark mb-4">{language === 'es' ? 'Sobre este episodio' : 'About this episode'}</h2>
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
                    {language === 'es' ? 'Episodio anterior' : 'Previous episode'}
                  </Link>
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {nextEpisode ? (
                <Button asChild variant="outline" className="flex-1 justify-end">
                  <Link href={`/medios/${parentSeries.id}/${nextEpisode.slug}`}>
                    {language === 'es' ? 'Siguiente episodio' : 'Next episode'}
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
