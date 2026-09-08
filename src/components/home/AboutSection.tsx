"use client";


import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="content" className="py-20 lg:py-28 bg-cream-light" aria-labelledby="about-heading" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={variants}
          >
            <figure className="relative">
              <img 
                src="/lovable-uploads/2df62819-9976-4c1f-ae70-f597654760d3.png" 
                alt={language === 'es' ? 'Marcos Constandse Madrazo, filósofo transpersonal mexicano y autor de Humanismo Evolutivo Transpersonal' : 'Marcos Constandse Madrazo, Mexican transpersonal philosopher and author of Transpersonal Evolutionary Humanism'}
                className="w-full h-auto rounded-lg shadow-xl"
                loading="lazy"
                width="600"
                height="800"
              />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 border-4 border-gold rounded-lg -z-10" aria-hidden="true"></div>
              <div className="absolute -top-6 -left-6 w-1/2 h-24 bg-navy/10 rounded-lg -z-10" aria-hidden="true"></div>
            </figure>
          </motion.div>

          <article>
            <motion.header
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={variants}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="overflow-hidden"
            >
              <p className="text-primary/80 font-sans text-sm md:text-base uppercase tracking-wider">{t('about.subtitle')}</p>
              <h2 id="about-heading" className="mt-2 text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                {t('about.name')}
              </h2>
            </motion.header>

            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={variants}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-navy-light text-lg mb-4 leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-navy-light text-lg mb-4 leading-relaxed">
                {t('about.business')}
              </p>
              <p className="text-navy-light text-lg mb-4 leading-relaxed">
                {t('about.literature')}
              </p>
              <p className="text-navy-light text-lg mb-6 leading-relaxed">
                {t('about.works')}
              </p>
            </motion.div>

            <motion.footer
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={variants}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-navy hover:bg-navy-dark"
                onClick={() => {
                  (window as any).dataLayer?.push({
                    event: 'about_cta_click',
                    cta_location: 'about_section',
                    destination: '/autor'
                  });
                }}
              >
                <Link href="/autor">{t('about.learnMore')}</Link>
              </Button>
            </motion.footer>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
