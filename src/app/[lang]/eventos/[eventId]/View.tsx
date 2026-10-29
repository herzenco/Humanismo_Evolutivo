"use client";

import { use } from 'react';
import Link from '@/components/LocalizedLink';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Play } from 'lucide-react';
import { events } from '@/data/events';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { t, language } = useLanguage();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-heading mb-4">{t('eventos.notFound')}</h1>
          <Link href="/eventos" className="text-gold hover:underline">
            {t('eventos.backToEvents')}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';

    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }

    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url('${event.imageUrl}')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-navy-dark/70"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('eventos.backToEvents')}
            </Link>

            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase backdrop-blur-sm">
                {t(event.categoryKey)}
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight max-w-4xl">
              {t(event.titleKey)}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="text-lg">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-lg">{event.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">

            {/* Video Section */}
            {event.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-16"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-navy-dark group">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={getYouTubeEmbedUrl(event.videoUrl)}
                    title={t(event.titleKey)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/20 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>
            )}

            {/* Description Sections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Main Description */}
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-cream">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gold rounded-full"></div>
                  <h2 className="font-heading text-3xl font-light text-navy-dark">
                    {t('eventos.about')}
                  </h2>
                </div>
                <p className="text-navy-light text-lg leading-relaxed">
                  {t(event.descriptionKey)}
                </p>
              </div>

              {/* Organized Sections */}
              {event.sections && event.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-cream hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-gold to-gold/50 rounded-full"></div>
                    <h3 className="font-heading text-2xl md:text-3xl font-light text-navy-dark">
                      {t(section.titleKey)}
                    </h3>
                  </div>
                  <div className="text-navy-light text-lg leading-relaxed whitespace-pre-line">
                    {t(section.contentKey)}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gallery Section */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-16"
              >
                <h2 className="font-heading text-3xl md:text-4xl font-light text-navy-dark mb-8 text-center">
                  {language === 'es' ? 'Galería del Evento' : 'Event Gallery'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.gallery.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <img
                        src={image}
                        alt={`${t(event.titleKey)} - ${language === 'es' ? 'Imagen' : 'Image'} ${index + 1}`}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Events */}
            {events.filter(e => e.id !== event.id).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-20 pt-12 border-t border-navy/10"
              >
                <h3 className="font-heading text-3xl font-light text-navy-dark mb-8 text-center">
                  {t('eventos.moreEvents')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events
                    .filter(e => e.id !== event.id)
                    .slice(0, 2)
                    .map((relatedEvent, index) => (
                      <Link
                        key={relatedEvent.id}
                        href={`/eventos/${relatedEvent.id}`}
                        className="group block"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-cream"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={relatedEvent.imageUrl}
                                alt={t(relatedEvent.titleKey)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-grow">
                              <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-2">
                                {t(relatedEvent.categoryKey)}
                              </span>
                              <h4 className="font-heading text-lg text-navy-dark mb-2 group-hover:text-gold transition-colors line-clamp-2">
                                {t(relatedEvent.titleKey)}
                              </h4>
                              <p className="text-sm text-navy/70 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(relatedEvent.date)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
