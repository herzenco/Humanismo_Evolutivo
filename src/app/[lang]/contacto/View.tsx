"use client";

import ContactIntro from "@/components/design/ContactIntro";
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Script from 'next/script';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';

const Contacto = () => {
  const { t } = useLanguage();

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

  return (
    <PageWrapper>
      {/* Sophisticated Hero Section */}
      <ContactIntro />

      {/* Premium Contact Section */}
      <section id="contacto" className="py-32 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy rounded-3xl"></div>
                  <div className="relative p-10 text-white">
                    <h2 className="font-heading text-3xl font-light mb-8">
                      {t('contacto.info.title')} <span className="text-gold font-medium">{t('contacto.info.highlight')}</span>
                    </h2>

                    <div className="space-y-8">
                      {[
                        {
                          icon: Mail,
                          title: t('contacto.info.email'),
                          content: "humanismoevolutivo@gmail.com",
                          href: "mailto:humanismoevolutivo@gmail.com"
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start group">
                          <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mr-6 mt-1 group-hover:bg-gold/30 transition-colors">
                            <item.icon className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            {item.href ? (
                              <a href={item.href} className="text-white/80 hover:text-gold transition-colors text-lg">
                                {item.content}
                              </a>
                            ) : (
                              <p className="text-white/80 text-lg whitespace-pre-line">{item.content}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>


                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-cream-light rounded-3xl shadow-2xl"></div>
                  <div className="relative p-10">
                    <h2 className="font-heading text-3xl font-light text-navy-dark mb-8">
                      {t('contacto.form.title')} <span className="font-medium" style={{ color: '#806018' }}>{t('contacto.form.highlight')}</span>
                    </h2>

                    <div className="overflow-hidden rounded-xl">
                      <iframe
                        src="https://api.leadconnectorhq.com/widget/form/2NIYmdIxCPc9ncN9SI7Z"
                        style={{
                          width: '100%',
                          height: '550px',
                          border: 'none',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                        id="inline-2NIYmdIxCPc9ncN9SI7Z"
                        data-layout="{'id':'INLINE'}"
                        data-trigger-type="alwaysShow"
                        data-trigger-value=""
                        data-activation-type="alwaysActivated"
                        data-activation-value=""
                        data-deactivation-type="neverDeactivate"
                        data-deactivation-value=""
                        data-form-name="Contact Us - Yo Soy Nosotros"
                        data-height="550"
                        data-layout-iframe-id="inline-2NIYmdIxCPc9ncN9SI7Z"
                        data-form-id="2NIYmdIxCPc9ncN9SI7Z"
                        title="Formulario de contacto"
                        aria-label="Formulario de contacto"
                        scrolling="no"
                      ></iframe>
                      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </PageWrapper>
  );
};

export default Contacto;
