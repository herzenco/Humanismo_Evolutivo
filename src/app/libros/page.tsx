"use client";

import { motion } from 'framer-motion';
import { Download, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { books, localizeBook } from '@/data/books';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { bookDownloadSchema, sanitizeForAnalytics } from '@/lib/validation';
import { z } from 'zod';
import { useBookImages } from '@/hooks/useBookImages';

const Libros = () => {
  const { t, language } = useLanguage();
  const { data: bookImages } = useBookImages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const localizedBooks = books.map((book) => localizeBook(book, t));

  const handleDownload = (bookId: string) => {
    setSelectedBook(bookId);
    setIsDialogOpen(true);
    (window as any).dataLayer?.push({
      event: 'download_book_click',
      book_id: bookId,
      location: 'libros_page'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const book = books.find(b => b.id === selectedBook);
      if (!book) return;

      let pdfFileName = '';
      let bookName = '';

      if (book.id === 'yo-soy-nosotros') {
        pdfFileName = language === 'es' ? 'Yo_Soy_Nosotros_Resumen.pdf' : 'I_Am_US_Summary.pdf';
        bookName = language === 'es' ? 'Yo Soy Nosotros' : 'I Am US';
      } else if (book.id === 'dejalo-ser') {
        pdfFileName = language === 'es' ? 'DejaloSer_Resumen.pdf' : 'Let_It_Be_Summary.pdf';
        bookName = language === 'es' ? 'Déjalo Ser' : 'Let It Be';
      } else if (book.id === 'ecologia-y-espiritualidad') {
        pdfFileName = language === 'es' ? 'Ecologia_y_Espiritualidad.pdf' : 'Ecology_and_Spirituality.pdf';
        bookName = language === 'es' ? 'Ecología y Espiritualidad' : 'Ecology and Spirituality';
      } else if (book.id === 'el-arte-de-ser-empresario') {
        pdfFileName = language === 'es' ? 'El_arte_de_ser_empresario_Resumen.pdf' : 'The_art_of_being_an_entrepreneur_Summary.pdf';
        bookName = language === 'es' ? 'El Arte de Ser Empresario' : 'The Art of Being an Entrepreneur';
      }

      // Validate form data with Zod schema
      const validatedData = bookDownloadSchema.parse({
        name: formData.name.trim(),
        email: formData.email.trim(),
        book_downloaded: bookName.trim()
      }) as { name: string; email: string; book_downloaded: string };

      // Save validated data to database
      const { error } = await supabase
        .from('book_downloads')
        .insert(validatedData);

      if (error) throw error;

      // Track with GTM using sanitized data
      (window as any).dataLayer?.push({
        event: 'download_book_submit',
        book_id: selectedBook,
        book_title: sanitizeForAnalytics(bookName),
        location: 'libros_page'
      });

      setIsSubmitted(true);

      setTimeout(async () => {
        try {
          const res = await fetch(`/books/${pdfFileName}`);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = bookName + '.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          toast.error(t('download.error'));
        }
      }, 300);

      setTimeout(() => {
        setIsSubmitted(false);
        setIsDialogOpen(false);
        setFormData({ name: '', email: '' });
        setSelectedBook(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle Zod validation errors specifically
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast.error(firstError.message);
      } else {
        toast.error(t('download.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden" aria-label={language === 'es' ? 'Sección principal de libros' : 'Book library introduction'}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url('/lovable-uploads/bd0dec77-828d-40b0-8bcc-30690a3a1fb3.png')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[10%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[25%] left-[75%] w-24 h-24 bg-gold/8 rounded-full blur-2xl"></div>
          <BookOpen className="absolute top-[20%] right-[20%] w-16 h-16 text-gold/20" />
          <Star className="absolute bottom-[40%] left-[15%] w-12 h-12 text-primary/30" />
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
                {t('libros.hero.badge')}
              </span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
              {t('libros.hero.title')}
              <span className="block text-gold font-medium">{t('libros.hero.title.highlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              {t('libros.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Books Grid */}
      <section className="py-32 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
          >
            {localizedBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-cream-light rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"></div>
                <div className="relative overflow-hidden rounded-3xl h-full">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-2/5 h-80 lg:h-auto relative flex items-center justify-center p-6 bg-gray-50">
                       <img
                        src={bookImages?.[book.id] || book.image}
                        alt={`${language === 'es' ? 'Portada del libro' : 'Book cover'} ${book.title} — Marcos Constandse Madrazo`}
                        className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105 shadow-lg rounded-lg"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/10 rounded-tl-3xl lg:rounded-tl-3xl lg:rounded-bl-3xl lg:rounded-tr-none"></div>
                      <div className="absolute bottom-4 left-4 lg:hidden">
                        <h3 className="font-heading text-2xl font-semibold text-white mb-1">{book.title}</h3>
                        <p className="text-white/90 text-sm italic">{book.subtitle}</p>
                      </div>
                    </div>

                    <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col h-full">
                      <div className="flex-grow flex flex-col">
                        <div className="hidden lg:block mb-6">
                          <h3 className="font-heading text-3xl font-light text-navy-dark mb-2 leading-tight">{book.title}</h3>
                          <p className="text-gold italic text-lg font-medium">{book.subtitle}</p>
                        </div>

                        <p className="text-navy-light text-lg leading-relaxed mb-6 min-h-[120px]">{book.excerpt}</p>

                        <div className="mb-6 mt-auto">
                          <div className="flex flex-wrap gap-2 min-h-[80px] content-start">
                            {book.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-navy/10 text-navy text-sm rounded-full font-medium h-fit"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                          href={`/libros/${book.id}`}
                          className="px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy-dark transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          onClick={() => {
                            (window as any).dataLayer?.push({
                              event: 'book_explore_click',
                              book_id: book.id,
                              book_title: book.title,
                              location: 'libros_page'
                            });
                          }}
                        >
                          {t('libros.explore')}
                        </Link>
                        <button
                          className="px-6 py-3 border-2 border-gold text-gold rounded-xl hover:bg-gold hover:text-navy-dark transition-all duration-300 inline-flex items-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          onClick={() => handleDownload(book.id)}
                        >
                          <Download size={18} className="mr-2" />
                          {t('books.download')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-heading">
              {isSubmitted
                ? (language === 'es' ? '¡Gracias!' : 'Thank you!')
                : (selectedBook && localizedBooks.find(b => b.id === selectedBook)?.title
                    ? `${language === 'es' ? 'Descargar' : 'Download'} ${localizedBooks.find(b => b.id === selectedBook)?.title}`
                    : (language === 'es' ? 'Descargar Libro' : 'Download Book'))}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-center">
              {isSubmitted ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-lg">
                    {language === 'es'
                      ? 'Tu descarga comenzará en unos segundos.'
                      : 'Your download will start in a few seconds.'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'es'
                      ? 'Si la descarga no inicia automáticamente, verifica tu carpeta de descargas.'
                      : 'If the download doesn\'t start automatically, check your downloads folder.'}
                  </p>
                </div>
              ) : (
                <p className="mt-2">
                  {selectedBook && localizedBooks.find(b => b.id === selectedBook)?.title
                    ? (language === 'es'
                        ? `Completa el formulario para descargar ${localizedBooks.find(b => b.id === selectedBook)?.title}.`
                        : `Complete the form to download ${localizedBooks.find(b => b.id === selectedBook)?.title}.`)
                    : (language === 'es'
                        ? 'Completa el formulario para descargar.'
                        : 'Complete the form to download.')}
                </p>
              )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted && (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {language === 'es' ? 'Nombre completo' : 'Full name'}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {language === 'es' ? 'Correo electrónico' : 'Email'}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder={language === 'es' ? 'correo@ejemplo.com' : 'email@example.com'}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button type="submit" className="bg-gold hover:bg-gold-dark text-navy-dark" disabled={isSubmitting}>
                  {isSubmitting ? (language === 'es' ? 'Descargando...' : 'Downloading...') : (language === 'es' ? 'Descargar Libro' : 'Download Book')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default Libros;
