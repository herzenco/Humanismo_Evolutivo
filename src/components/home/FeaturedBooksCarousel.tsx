"use client";


import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { books } from '@/data/books';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturedBooksCarousel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2
  });

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
    <section className="py-20 lg:py-28 bg-gradient-to-br from-navy to-navy-dark text-white overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-gold font-sans text-sm md:text-base uppercase tracking-wider mb-4">{t('featured.label')}</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 leading-tight">
              {t('books.title')}
            </h3>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t('books.subtitle')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6"
        >
          {books.map((book) => (
            <div key={book.id} className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform group-hover:scale-105 transition-all duration-500"></div>
              <div className="relative p-4 lg:p-6 h-full flex flex-col">
                <div className="mb-4 flex justify-center">
                  <img 
                    src={book.image}
                    alt={book.title}
                    className="h-32 lg:h-40 w-auto object-contain rounded-xl shadow-lg transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-heading text-lg lg:text-xl font-semibold mb-2 text-white leading-tight line-clamp-2">{book.title}</h4>
                  <p className="text-gold italic mb-3 text-sm lg:text-base line-clamp-1">{book.subtitle}</p>
                  <p className="text-white/80 leading-relaxed mb-4 flex-grow text-xs lg:text-sm line-clamp-3">{book.excerpt}</p>
                </div>
                
                <Link
                  href={`/libros/${book.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gold text-navy-dark rounded-xl hover:bg-gold-light transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                  onClick={() => {
                    (window as any).dataLayer?.push({
                      event: 'book_card_click',
                      book_id: book.id,
                      book_title: book.title,
                      location: 'featured_books_carousel'
                    });
                  }}
                >
                  {t('books.read')}
                  <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy-dark transition-all duration-300"
            onClick={() => {
              (window as any).dataLayer?.push({
                event: 'view_all_books_click',
                location: 'featured_books_section'
              });
            }}
          >
            <Link href="/libros" className="inline-flex items-center">
              Ver Todos los Libros
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBooksCarousel;
