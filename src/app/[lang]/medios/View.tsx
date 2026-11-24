"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock, ExternalLink, Video, Bot, Youtube } from 'lucide-react';
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { podcastSeries, videos } from '@/data/media';
import { useLocalizedRouter as useRouter } from '@/hooks/useLocalizedRouter';
import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';

const Podcast = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'podcasts' | 'videos'>('podcasts');
  useEffect(() => {
    const updateTab = () => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      setActiveTab(tab === 'videos' || window.location.hash === '#videos' ? 'videos' : 'podcasts');
    };
    updateTab();
    window.addEventListener('popstate', updateTab);
    return () => window.removeEventListener('popstate', updateTab);
  }, []);
  const selectTab = (tab: 'podcasts' | 'videos') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    url.hash = '';
    window.history.replaceState({}, '', url.pathname + url.search);
  };

  // Fetch podcast series with cover images from database
  const { data: dbPodcastSeries } = useQuery({
    queryKey: ['podcast-series'],
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_series')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Merge database data with static data
  const mergedPodcastSeries = podcastSeries.map(series => {
    const dbSeries = dbPodcastSeries?.find(db => db.book_id === series.id);
    return {
      ...series,
      coverImage: dbSeries?.cover_image_url || series.coverImage,
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
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

  const currentContent: any[] = activeTab === 'podcasts' ? mergedPodcastSeries : videos;

  return (
    <PageWrapper>
      {/* Premium Hero Section */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[10%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[25%] left-[75%] w-24 h-24 bg-gold/8 rounded-full blur-2xl"></div>
          <Bot className="absolute top-[20%] right-[20%] w-16 h-16 text-gold/20" />
          <Video className="absolute bottom-[40%] left-[15%] w-12 h-12 text-primary/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase backdrop-blur-sm">
                {t('podcast.page.badge')}
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              {t('podcast.page.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              {t('podcast.page.intro')}
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 inline-flex">
                <button
                  onClick={() => {
                    (window as any).dataLayer?.push({
                      event: 'media_tab_click',
                      tab_name: 'podcasts'
                    });
                    selectTab('podcasts');
                  }}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'podcasts'
                      ? 'bg-gold text-navy-dark shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bot size={20} />
                  {t('podcast.page.tab.podcasts')}
                </button>
                <button
                  onClick={() => {
                    (window as any).dataLayer?.push({
                      event: 'media_tab_click',
                      tab_name: 'videos'
                    });
                    selectTab('videos');
                  }}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'videos'
                      ? 'bg-gold text-navy-dark shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Youtube size={20} />
                  {t('podcast.page.tab.videos')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Content Grid */}
      <section id="media-content" className="py-32 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          {activeTab === 'podcasts' ? (
            <>
              {/* Podcast Shows Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                {currentContent.map((series) => (
                  <motion.div
                    key={series.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/medios/show/${series.id}`)}
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gold/30">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={series.coverImage}
                          alt={t(series.titleKey)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-gold/90 backdrop-blur-sm text-navy-dark px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg">
                            {series.episodes.length} episodios
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-heading text-2xl font-semibold mb-3 text-navy group-hover:text-gold transition-colors duration-300">
                          {t(series.titleKey)}
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                          {t(series.descriptionKey)}
                        </p>

                        <Button
                          variant="outline"
                          className="w-full group/btn border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all duration-300 py-5 rounded-xl font-medium"
                        >
                          <span className="flex items-center justify-center gap-2">
                            Ver episodios
                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentContent.map((item) => (
                <motion.div
                  key={item.id}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gold/30"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={t(item.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-gold/90 backdrop-blur-sm text-navy-dark px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg">
                        {t('video.page.badge')}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-gold/95 backdrop-blur-sm p-6 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Youtube className="w-10 h-10 text-navy-dark" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold" />
                        <span>{new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gold" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    <Badge className="mb-4 bg-navy/10 text-navy hover:bg-navy/20 border-0">
                      {t(item.categoryKey)}
                    </Badge>

                    <h3 className="font-heading text-2xl font-semibold mb-3 text-navy group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {t(item.titleKey)}
                    </h3>

                    <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                      {t(item.descriptionKey)}
                    </p>

                    <Button
                      onClick={() => router.push(`/video/${item.id}`)}
                      variant="outline"
                      className="w-full group/btn border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all duration-300 py-6 rounded-xl font-medium"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t('video.page.watch')}
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Podcast;
