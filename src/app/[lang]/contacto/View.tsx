"use client";

import ContactIntro from "@/components/design/ContactIntro";
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
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
                          content: "contacto@yosoynosotros.mx",
                          href: "mailto:contacto@yosoynosotros.mx"
                        },
                        {
                          icon: Phone,
                          title: t('contacto.info.phone'),
                          content: "+52 (123) 456-7890",
                          href: "tel:+521234567890"
                        },
                        {
                          icon: MapPin,
                          title: t('contacto.info.address'),
                          content: "Av. Universidad 1200,\nCol. Xoco, Benito Juárez\nCiudad de México, CP 03330"
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
                      {t('contacto.form.title')} <span className="text-gold font-medium">{t('contacto.form.highlight')}</span>
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
                        title="Contact Us - Yo Soy Nosotros"
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

      {/* Premium Map Section */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <span className="text-gold font-medium text-sm uppercase tracking-wider">{t('contacto.map.badge')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-heading font-light text-navy-dark leading-tight">
                {t('contacto.map.title')}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Placeholder for map */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-navy-dark mx-auto mb-4" />
                  <p className="text-2xl font-heading text-navy-dark">Mapa Interactivo</p>
                  <p className="text-navy-light">Integración con Google Maps próximamente</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Contacto;
