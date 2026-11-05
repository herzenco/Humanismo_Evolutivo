"use client";


import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/contexts/LanguageContext';

const ChatbotSection = () => {
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
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-navy-dark text-white" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-gold font-sans text-sm md:text-base uppercase tracking-wider">{t('chatbot.section.badge')}</h2>
            <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t('chatbot.section.title')}
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {t('chatbot.section.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div className="space-y-4">
                <motion.div 
                  custom={1}
                  variants={bubbleVariants} 
                  className="bg-white/10 p-4 rounded-tl-lg rounded-tr-lg rounded-br-lg max-w-xs ml-auto float-animation"
                >
                  <p className="text-white/90">{t('chatbot.section.question1')}</p>
                </motion.div>
                
                <motion.div 
                  custom={2}
                  variants={bubbleVariants}
                  className="bg-gold/20 p-4 rounded-tl-lg rounded-tr-lg rounded-bl-lg max-w-sm"
                >
                  <p className="text-white/90">
                    {t('chatbot.section.answer1')}
                  </p>
                </motion.div>
                
                <motion.div 
                  custom={3}
                  variants={bubbleVariants}
                  className="bg-white/10 p-4 rounded-tl-lg rounded-tr-lg rounded-br-lg max-w-xs ml-auto float-animation"
                >
                  <p className="text-white/90">{t('chatbot.section.question2')}</p>
                </motion.div>
                
                <motion.div 
                  custom={4}
                  variants={bubbleVariants}
                  className="bg-gold/20 p-4 rounded-tl-lg rounded-tr-lg rounded-bl-lg max-w-sm"
                >
                  <p className="text-white/90">
                    {t('chatbot.section.answer2')}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="mt-8 flex items-center bg-white/10 rounded-full p-2 pr-4 max-w-sm"
              >
                <input 
                  type="text" 
                  placeholder={t('chatbot.section.placeholder')}
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/50 flex-grow px-3"
                />
                <Button size="sm" className="bg-gold hover:bg-gold-light text-navy-dark rounded-full h-8 w-8 p-0 flex items-center justify-center">
                  <MessageCircle size={16} />
                </Button>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="text-center md:text-left">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mr-4">
                    <MessageCircle size={24} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold">{t('chatbot.section.card.title')}</h4>
                    <p className="text-white/70 text-sm">{t('chatbot.section.card.availability')}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-white/80">
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span>{t('chatbot.section.feature1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span>{t('chatbot.section.feature2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span>{t('chatbot.section.feature3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span>{t('chatbot.section.feature4')}</span>
                  </li>
                </ul>
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full bg-gold hover:bg-gold-light text-navy-dark"
                  onClick={() => {
                    (window as any).dataLayer?.push({
                      event: 'chatbot_cta_click',
                      cta_location: 'chatbot_section',
                      destination: '/chatbot'
                    });
                  }}
                >
                  <Link href="/chatbot">{t('chatbot.section.cta')}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotSection;
