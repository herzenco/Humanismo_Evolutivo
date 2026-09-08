"use client";

import { use } from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { podcastSeries } from '@/data/media';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getPodcastEpisodeContent } from '@/data/podcastEpisodeContent';
import { showLongform } from '@/data/showLongform';

export default function ShowDetailPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const { t, language } = useLanguage();
  const router = useRouter();

  // Fetch podcast series with cover images from database
  const { data: dbPodcastSeries } = useQuery({
    queryKey: ['podcast-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_series')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Find the show
  const show = podcastSeries.find(s => s.id === showId);
  const dbShow = dbPodcastSeries?.find(db => db.book_id === showId);

  if (!show) {
    redirect('/medios');
  }

  const coverImage = dbShow?.cover_image_url || show.coverImage;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url(${coverImage})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/medios"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'es' ? 'Volver a Medios' : 'Back to Media'}
            </Link>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-80 flex-shrink-0">
                <img
                  src={coverImage}
                  alt={t(show.titleKey)}
                  className="w-full aspect-square object-contain bg-cream-light p-3 rounded-2xl"
                />
              </div>

              <div className="flex-1">
                <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 leading-tight">
                  {t(show.titleKey)}
                </h1>
                <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-8">
                  {t(show.descriptionKey)}
                </p>

                {/* Extended Description */}
                {showLongform[language][show.id]?.length > 0 && (
                  <div className="prose prose-invert prose-lg max-w-none mb-8">
                    <div className="space-y-4 text-white/90 leading-relaxed">
                      {showLongform[language][show.id].map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Badge className="bg-gold/20 text-gold hover:bg-gold/30 border-0 text-base px-4 py-2">
                    {show.episodes.length} {language === 'es' ? 'episodios' : 'episodes'}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-20 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="space-y-6">
              {show.episodes.map((episode) => {
                const suppliedContent = language === 'es' ? getPodcastEpisodeContent(episode.audioUrl) : undefined;
                const episodeTitle = suppliedContent?.title ?? t(episode.titleKey);
                const episodeDescription = suppliedContent?.description ?? t(episode.descriptionKey);

                return (
                  <motion.div
                    key={episode.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 border border-cream">
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-sm text-navy-light mb-3">
                            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                              {t(episode.categoryKey)}
                            </Badge>
                          </div>

                          <h3 className="font-heading text-2xl font-semibold mb-3 text-navy-dark leading-tight group-hover:text-gold transition-colors">
                            {episodeTitle}
                          </h3>

                          <p className="text-navy-light leading-relaxed mb-6 line-clamp-3">
                            {episodeDescription}
                          </p>

                          <Button
                            className="bg-navy hover:bg-navy-dark text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            onClick={() => router.push(`/medios/${show.id}/${episode.slug}`)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            {t('podcast.moreInfo')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
