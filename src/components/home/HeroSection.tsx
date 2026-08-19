"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
const HeroSection = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const elements = parallaxRef.current.querySelectorAll('.parallax');
      elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const speedX = Number(htmlEl.getAttribute('data-speed-x')) || 0;
        const speedY = Number(htmlEl.getAttribute('data-speed-y')) || 0;
        const moveX = (x - 0.5) * speedX;
        const moveY = (y - 0.5) * speedY;
        htmlEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const trackHeroCTA = (ctaType: string, destination: string) => {
    window.dataLayer?.push({
      event: 'hero_cta_click',
      cta_type: ctaType,
      destination: destination
    });
  };
  return <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden" aria-labelledby="hero-title" ref={parallaxRef}>
      {/* Background image */}
      <div className="absolute inset-0 z-0" role="img" aria-label="Fondo artístico representando el universo y la conciencia humana">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/90db5ca6-bf10-4c20-8ad6-b97482d17cce.png')`
      }} />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating geometric shapes with subtle glow */}
        <div className="parallax absolute top-[15%] left-[10%] w-20 h-20 bg-gold/20 rounded-full blur-2xl animate-pulse" data-speed-x="25" data-speed-y="15"></div>
        <div className="parallax absolute top-[25%] right-[15%] w-16 h-16 border border-gold/40 rounded-lg rotate-45 backdrop-blur-sm" data-speed-x="-15" data-speed-y="20"></div>
        <div className="parallax absolute top-[65%] left-[75%] w-32 h-32 bg-white/10 rounded-full blur-3xl" data-speed-x="-25" data-speed-y="5"></div>
        <div className="parallax absolute top-[75%] left-[20%] w-12 h-12 border-2 border-gold/50 rounded-full" data-speed-x="15" data-speed-y="-20"></div>
        
        {/* Philosophical symbols */}
        <div className="parallax absolute top-[40%] right-[25%] text-gold/30 text-6xl font-serif" data-speed-x="10" data-speed-y="-10">φ</div>
        <div className="parallax absolute top-[80%] right-[80%] text-white/20 text-4xl" data-speed-x="-5" data-speed-y="15">∞</div>
        
        {/* Subtle light rays */}
        <div className="parallax absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" data-speed-x="5" data-speed-y="0"></div>
        <div className="parallax absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" data-speed-x="-8" data-speed-y="0"></div>
      </div>
      
      <div className="container mx-auto px-6 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <header className="overflow-hidden mb-4">
            <motion.h1 
              id="hero-title"
              initial={{
                y: 100,
                opacity: 0
              }} 
              animate={{
                y: 0,
                opacity: 1
              }} 
              transition={{
                duration: 0.8,
                delay: 0.2
              }} 
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight text-white drop-shadow-2xl" 
              style={{
                textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}
            >
              {t('hero.title')} <span className="text-gold drop-shadow-2xl">{t('hero.title.highlight')}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-3 text-xs md:text-sm font-medium uppercase tracking-[0.4em] text-white/85 drop-shadow-lg"
            >
              Transpersonal
            </motion.p>
          </header>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-heading text-white mb-6 drop-shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            {t('hero.secondarySubtitle')}
          </motion.h2>

          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="text-lg md:text-xl text-white mb-10 leading-relaxed drop-shadow-lg backdrop-blur-sm bg-black/20 rounded-2xl px-8 py-6 border border-white/10" style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
            {t('hero.subtitle')}
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.8
        }} className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link
              href="/libros"
              className="px-8 py-4 bg-gold text-navy-dark font-semibold rounded-xl hover:bg-gold/90 transition-all duration-300 shadow-2xl hover:shadow-gold/25 transform hover:scale-105 backdrop-blur-sm border border-gold/20"
              onClick={() => trackHeroCTA('explore_books', '/libros')}
            >
              {t('hero.explore')}
            </Link>
            <Link
              href="/autor"
              className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 shadow-2xl transform hover:scale-105"
              onClick={() => trackHeroCTA('about_author', '/autor')}
            >
              {t('hero.about')}
            </Link>
          </motion.div>

          
        </div>
      </div>
    </section>;
};
export default HeroSection;
