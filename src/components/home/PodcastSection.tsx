"use client";


import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/contexts/LanguageContext';

const podcasts = [
  {
    id: 1,
    title: "El Universo",
    host: "Humanismo Evolutivo",
    duration: "45:32",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    url: "https://open.spotify.com/show/0sAbxFDgJTtuHZeSz0CSvy"
  },
  {
    id: 2,
    title: "El inicio de la búsqueda",
    host: "Humanismo Evolutivo",
    duration: "38:15",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    url: "https://open.spotify.com/show/0sAbxFDgJTtuHZeSz0CSvy"
  }
];

const PodcastSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.2 * i }
    })
  };

  return (
    <section className="py-20 lg:py-28 bg-cream-light" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <motion.div
              custom={1}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
            >
              <h2 className="text-primary/80 font-sans text-sm md:text-base uppercase tracking-wider">{t('podcast.section.subtitle')}</h2>
              <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                {t('podcast.section.title')} <span className="text-gold">{t('podcast.section.title.highlight')}</span>
              </h3>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
              className="mb-8"
            >
              <p className="text-navy-light text-lg mb-4">
                {t('podcast.section.description1')}
              </p>
              <p className="text-navy-light text-lg">
                {t('podcast.section.description2')}
              </p>
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textVariants}
            >
              <Link 
                href="/medios" 
                className="inline-flex items-center text-primary font-medium hover:text-gold transition-colors"
                onClick={() => {
                  (window as any).dataLayer?.push({
                    event: 'view_all_podcasts_click',
                    location: 'podcast_section'
                  });
                }}
              >
                {t('podcast.section.viewAll')}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-4"
          >
            {podcasts.map((podcast) => (
              <motion.div 
                key={podcast.id} 
                variants={itemVariants}
                className="flex items-center p-4 bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={podcast.image} 
                    alt={podcast.title} 
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => {
                      (window as any).dataLayer?.push({
                        event: 'podcast_play_click',
                        podcast_id: podcast.id,
                        podcast_title: podcast.title,
                        location: 'podcast_section'
                      });
                      window.open(podcast.url, '_blank');
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center">
                      <Play size={18} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="font-heading text-lg font-semibold text-navy-dark">{podcast.title}</h4>
                  <p className="text-primary/70 text-sm">{podcast.host}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-navy-light">{podcast.duration}</span>
                    <button 
                      onClick={() => {
                        (window as any).dataLayer?.push({
                          event: 'podcast_listen_click',
                          podcast_id: podcast.id,
                          podcast_title: podcast.title,
                          location: 'podcast_section'
                        });
                      window.open(podcast.url, '_blank');
                    }}
                    className="text-gold text-sm font-medium hover:underline"
                  >
                    {t('podcast.section.listen')}
                  </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
