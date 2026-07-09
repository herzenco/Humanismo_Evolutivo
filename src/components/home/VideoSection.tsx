"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const VideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3
  });

  const featuredVideoUrl = 'https://www.youtube.com/embed/5rmKRNZbmoQ?rel=0';

  const videoConfig = {
    es: {
      url: featuredVideoUrl,
      title: 'Introducción a la filosofía del Humanismo Evolutivo'
    },
    en: {
      url: featuredVideoUrl,
      title: 'Introduction to Evolutionary Humanism philosophy'
    }
  };

  const currentVideo = videoConfig[language];

  const trackVideoPlay = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'video_play',
      video_title: currentVideo.title,
      video_url: currentVideo.url
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
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

  return (
    <section className="py-20 lg:py-28 bg-background" ref={ref} id="content">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              {t('video.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('video.subtitle')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black" onClick={trackVideoPlay}>
              <iframe
                width="100%"
                height="100%"
                src={currentVideo.url}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-gold/20 rounded-2xl -z-10 blur-xl opacity-50"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
