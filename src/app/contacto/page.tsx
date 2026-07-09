"use client";

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
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[10%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <MessageSquare className="absolute top-[25%] right-[15%] w-20 h-20 text-gold/20" />
          <Mail className="absolute bottom-[30%] left-[20%] w-16 h-16 text-primary/30" />
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
                {t('contacto.hero.badge')}
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              {t('contacto.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto font-light">
              {t('contacto.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Contact Section */}
      <section className="py-32 bg-gradient-to-br from-white via-cream-light/30 to-white">
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

                    <div className="mt-16">
                      <h3 className="font-heading text-2xl font-light mb-8">
                        {t('contacto.social.title')} <span className="text-gold">{t('contacto.social.highlight')}</span>
                      </h3>

                      <div className="flex space-x-4">
                        {[
                          { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                          { name: 'Twitter', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                          { name: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z' },
                          { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z m-13.29 8.58V9.75l5.94 3.12-5.94 3.13z' }
                        ].map((social, index) => (
                          <a
                            key={index}
                            href="#"
                            className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:text-navy-dark transition-all duration-300 transform hover:scale-110"
                            onClick={(e) => {
                              e.preventDefault();
                              (window as any).dataLayer?.push({
                                event: 'social_media_click',
                                social_network: social.name.toLowerCase(),
                                location: 'contact_page'
                              });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={social.icon}></path>
                            </svg>
                          </a>
                        ))}
                      </div>
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
