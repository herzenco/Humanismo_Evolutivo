"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/layout/PageWrapper';
import { useLanguage } from '@/contexts/LanguageContext';

const Chatbot = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2 * i
      }
    })
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-navy-dark text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                {t('chatbot.hero.title')} <span className="text-gold">{t('chatbot.hero.highlight')}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                {t('chatbot.hero.subtitle')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 lg:py-28 bg-cream-light" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-12">
              <div className="w-32 h-32 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageCircle size={64} className="text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-navy">
                {t('chatbot.soon.title')}
              </h2>
              <p className="text-navy-light text-xl leading-relaxed mb-8">
                {t('chatbot.soon.description')}
              </p>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
                <h3 className="font-heading text-2xl font-semibold mb-4 text-navy">{t('chatbot.features.title')}</h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="text-gold mr-3 mt-1">✓</span>
                    <span className="text-navy-light">Diálogos profundos sobre conceptos filosóficos y espirituales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3 mt-1">✓</span>
                    <span className="text-navy-light">Exploración interactiva de los libros y ensayos del autor</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3 mt-1">✓</span>
                    <span className="text-navy-light">Conversaciones por texto y voz en tiempo real</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3 mt-1">✓</span>
                    <span className="text-navy-light">Respuestas personalizadas según tus inquietudes espirituales</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-2xl p-8 shadow-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">{t('chatbot.notify.title')}</h3>
              <p className="text-white/80 mb-6">{t('chatbot.notify.description')}</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-grow px-4 py-3 rounded-lg text-navy placeholder:text-navy/50 border-0 focus:ring-2 focus:ring-gold outline-none"
                />
                <Button className="bg-gold hover:bg-gold-light text-navy-dark font-semibold px-6 py-3 rounded-lg whitespace-nowrap">
                  {t('chatbot.notify.button')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-navy">
              Una Experiencia de Diálogo Profundo
            </h2>
            <p className="text-navy-light text-lg mb-12 leading-relaxed">
              Esta experiencia revolucionaria permitirá explorar las ideas del autor
              de manera interactiva y personalizada como nunca antes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="text-gold" size={32} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 text-navy">Diálogo Inteligente</h3>
                <p className="text-navy-light">Conversaciones naturales basadas en el pensamiento del autor</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">φ</span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 text-navy">Exploración Filosófica</h3>
                <p className="text-navy-light">Profundiza en conceptos de conciencia, espiritualidad y ética</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-navy/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-navy text-2xl">∞</span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 text-navy">Aprendizaje Continuo</h3>
                <p className="text-navy-light">Cada conversación se adapta a tu nivel de comprensión</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Chatbot;
