"use client";

import { motion } from 'framer-motion';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';
import { PersonStructuredData } from '@/components/seo/StructuredData';

const Autor = () => {
  const { t, language } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
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
      <PersonStructuredData
        name="Marcos Constandse Madrazo"
        jobTitle="Filósofo y Autor"
        description="Pensador transpersonal mexicano dedicado a la integración de ciencia, espiritualidad y conciencia humana"
        image="https://humanismoevolutivo.com/lovable-uploads/2df62819-9976-4c1f-ae70-f597654760d3.png"
        url="https://humanismoevolutivo.com/autor"
      />
      {/* Elegant Hero Section */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden" aria-label="Sección principal del autor">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url('/lovable-uploads/129f3007-ae15-429d-9345-8117265510b8.png')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[8%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] left-[70%] w-24 h-24 bg-gold/8 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium tracking-wider uppercase backdrop-blur-sm">
                {t('autor.hero.badge')}
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              {t('about.name')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto font-light">
              {t('autor.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sophisticated Biography Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="lg:col-span-7 order-2 lg:order-1">
              <div className="max-w-2xl">
                <div className="mb-8">
                  <span className="text-gold font-medium text-sm uppercase tracking-wider">{t('autor.section.search')}</span>
                  <h2 className="mt-4 text-5xl md:text-6xl font-heading font-light text-navy-dark leading-tight">
                    {t('about.name')}
                  </h2>
                </div>

                <div className="space-y-6 text-lg leading-relaxed text-navy-light">
                  <p>
                    {t('about.description1')}
                  </p>
                  <p>
                    {t('about.literature')}
                  </p>
                  <p>
                    {t('about.business')}
                  </p>
                  <p>
                    {t('about.works')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 to-primary/20 rounded-2xl blur-xl"></div>
                <img
                  src="/lovable-uploads/2df62819-9976-4c1f-ae70-f597654760d3.png"
                  alt="Marcos Constandse Madrazo - Filósofo y autor transpersonal mexicano"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute -bottom-8 -right-8 w-full h-1/2 bg-navy/5 rounded-2xl -z-10"></div>
                <div className="absolute -top-8 -left-8 w-1/2 h-1/2 bg-gold/10 rounded-2xl -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-gradient-to-br from-cream-light to-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <span className="text-gold font-medium text-sm uppercase tracking-wider">{t('autor.philosophy.badge')}</span>
              <h2 className="mt-4 text-5xl md:text-6xl font-heading font-light text-navy-dark leading-tight">
                {t('autor.philosophy.title')} <span className="text-gold font-medium">{t('autor.philosophy.highlight')}</span>
              </h2>
              <p className="mt-6 text-xl text-navy-light max-w-4xl mx-auto">
                {t('autor.philosophy.description')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gold/10">
                <h3 className="text-2xl font-heading font-semibold mb-4 text-navy-dark">{t('autor.philosophy.card1.title')}</h3>
                <p className="text-navy-light leading-relaxed">
                  {t('autor.philosophy.card1.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gold/10">
                <h3 className="text-2xl font-heading font-semibold mb-4 text-navy-dark">{t('autor.philosophy.card2.title')}</h3>
                <p className="text-navy-light leading-relaxed">
                  {t('autor.philosophy.card2.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gold/10">
                <h3 className="text-2xl font-heading font-semibold mb-4 text-navy-dark">{t('autor.philosophy.card3.title')}</h3>
                <p className="text-navy-light leading-relaxed">
                  {t('autor.philosophy.card3.description')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Timeline Section */}
      <section className="py-32 bg-gradient-to-br from-navy-dark to-navy text-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <span className="text-gold font-medium text-sm uppercase tracking-wider">{t('autor.timeline.badge')}</span>
              <h2 className="mt-4 text-5xl md:text-6xl font-heading font-light leading-tight">
                {t('autor.timeline.title')} <span className="text-gold font-medium">{t('autor.timeline.highlight')}</span>
              </h2>
              <p className="mt-6 text-xl text-white/80 max-w-3xl mx-auto">
                {t('autor.timeline.description')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="space-y-12">
                {[
                  {
                    titleKey: "autor.timeline.milestone1.title",
                    descriptionKey: "autor.timeline.milestone1.description"
                  },
                  {
                    titleKey: "autor.timeline.milestone2.title",
                    descriptionKey: "autor.timeline.milestone2.description"
                  },
                  {
                    titleKey: "autor.timeline.milestone3.title",
                    descriptionKey: "autor.timeline.milestone3.description"
                  },
                  {
                    titleKey: "autor.timeline.milestone4.title",
                    descriptionKey: "autor.timeline.milestone4.description"
                  }
                ].map((milestone, index) => (
                  <div key={index} className="flex gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 bg-gold rounded-full mt-2"></div>
                    </div>
                    <div className="pb-8 border-l border-white/20 pl-8 ml-2">
                      <h3 className="text-2xl font-heading font-semibold mb-4 text-gold">{t(milestone.titleKey)}</h3>
                      <p className="text-white/90 leading-relaxed text-lg">{t(milestone.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Quote Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-12">
              <svg className="w-8 h-8 text-gold" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light italic mb-12 leading-tight text-navy-dark">
              "{t('autor.quote.text')}"
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"></div>
            <p className="text-2xl font-heading text-gold">{t('autor.quote.legacy')}</p>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Autor;
