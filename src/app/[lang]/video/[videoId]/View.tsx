"use client";

import { use } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Youtube } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VideoDetailPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);
  const { t } = useLanguage();

  const allVideos = [
    {
      id: 1,
      titleKey: "video.ep1.title",
      descriptionKey: "video.ep1.description",
      fullDescriptionKey: "video.ep1.fullDescription",
      duration: "42:53",
      date: "2025-01-01",
      categoryKey: "podcast.category.philosophy",
      videoUrl: "https://www.youtube.com/watch?v=HLHjY3NnX2k",
      embedUrl: "https://www.youtube.com/embed/HLHjY3NnX2k",
      imageUrl: "https://img.youtube.com/vi/HLHjY3NnX2k/hqdefault.jpg"
    }
  ];

  const video = allVideos.find(v => v.id === parseInt(videoId || ''));

  if (!video) {
    redirect('/medios?tab=videos');
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('${video.imageUrl}')`
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
              href="/medios?tab=videos"
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span>{t('podcast.view')}</span>
            </Link>

            <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/20 mb-6">
              {t(video.categoryKey)}
            </Badge>

            <h1 className="font-heading text-4xl md:text-6xl font-light mb-6 leading-tight">
              {t(video.titleKey)}
            </h1>

            <div className="flex items-center gap-6 text-white/80 mb-8">
              <span>{video.duration}</span>
              <span>•</span>
              <span>{new Date(video.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>

            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-navy-dark shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => {
                (window as any).dataLayer?.push({
                  event: 'video_play',
                  video_id: video.id,
                  video_title: t(video.titleKey),
                  location: 'video_detail_page'
                });
                window.open(video.videoUrl, '_blank');
              }}
            >
              <Youtube size={20} className="mr-2" />
              {t('podcast.watch')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Video Content */}
      <section className="py-20 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Video Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-navy-dark aspect-video">
                <iframe
                  src={video.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={t(video.titleKey)}
                />
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-cream"
            >
              <h2 className="font-heading text-3xl font-semibold mb-6 text-navy-dark">
                {t('podcast.summary')}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-navy-light leading-relaxed">
                  {t(video.fullDescriptionKey || video.descriptionKey)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
