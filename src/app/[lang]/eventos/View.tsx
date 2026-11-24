"use client";

import { motion } from 'framer-motion';
import { Calendar, MapPin, Video } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import { events } from '@/data/events';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';

const Eventos = () => {
  const { t, language } = useLanguage();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden" aria-label="Sección principal de eventos">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url('/lovable-uploads/bd0dec77-828d-40b0-8bcc-30690a3a1fb3.png')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[10%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[25%] left-[75%] w-24 h-24 bg-gold/8 rounded-full blur-2xl"></div>
          <Calendar className="absolute top-[20%] right-[20%] w-16 h-16 text-gold/20" />
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
                {t('eventos.hero.badge')}
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              {t('eventos.hero.title')}
              <span className="block text-gold font-medium">{t('eventos.hero.title.highlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              {t('eventos.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-32 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                className="group relative h-full"
              >
                <Link href={`/eventos/${event.id}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-cream-light rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"></div>
                  <div className="relative overflow-hidden rounded-3xl h-full">
                    <div className="flex flex-col h-full">
                      {/* Event Image */}
                      <div className="h-64 relative overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={`${t(event.titleKey)} - Evento con Marcos Constandse`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gold/90 text-navy-dark rounded-full text-sm font-medium backdrop-blur-sm">
                            {t(event.categoryKey)}
                          </span>
                        </div>

                        {/* Video Indicator */}
                        {event.videoUrl && (
                          <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Video className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4 text-navy/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>

                        <h3 className="font-heading text-2xl font-light text-navy-dark mb-3 leading-tight group-hover:text-gold transition-colors">
                          {t(event.titleKey)}
                        </h3>

                        <p className="text-navy-light leading-relaxed mb-6 flex-grow line-clamp-3">
                          {t(event.descriptionKey)}
                        </p>

                        <div className="pt-4">
                          <span className="inline-flex items-center text-gold font-medium group-hover:gap-3 gap-2 transition-all">
                            {t('eventos.view')}
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Eventos;
