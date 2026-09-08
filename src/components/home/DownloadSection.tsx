"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { books, localizeBook } from '@/data/books';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { bookDownloadSchema, sanitizeForAnalytics } from '@/lib/validation';
import { z } from 'zod';

const DownloadSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, t } = useLanguage();
  const localizedBooks = books.map((book) => localizeBook(book, t));

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleDownload = (bookId: string) => {
    const bookData = books.find(book => book.id === bookId);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'download_book_click',
      book_id: bookId,
      book_title: bookData?.title
    });
    setSelectedBook(bookId);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const bookData = books.find(book => book.id === selectedBook);
    
    // Determine the PDF file name and book name based on language and book ID
    let pdfFileName = '';
    let bookName = '';
    
    if (selectedBook === 'yo-soy-nosotros') {
      pdfFileName = language === 'es' 
        ? '/books/Yo_Soy_Nosotros_Resumen.pdf' 
        : '/books/I_Am_US_Summary.pdf';
      bookName = language === 'es' 
        ? 'Yo soy nosotros + Resumen' 
        : 'I Am US + Summary';
    } else if (selectedBook === 'ecologia-y-espiritualidad') {
      pdfFileName = language === 'es'
        ? '/books/Ecologia_y_Espiritualidad.pdf'
        : '/books/Ecology_and_Spirituality.pdf';
      bookName = language === 'es'
        ? 'Ecología y Espiritualidad'
        : 'Ecology and Spirituality';
    } else if (selectedBook === 'el-arte-de-ser-empresario') {
      pdfFileName = language === 'es'
        ? '/books/El_arte_de_ser_empresario_Resumen.pdf'
        : '/books/The_art_of_being_an_entrepreneur_Summary.pdf';
      bookName = language === 'es'
        ? 'El arte de ser empresario + Resumen'
        : 'The art of being an entrepreneur + Summary';
    } else if (selectedBook === 'dejalo-ser') {
      pdfFileName = language === 'es'
        ? '/books/DejaloSer_Resumen.pdf'
        : '/books/Let_It_Be_Summary.pdf';
      bookName = language === 'es'
        ? 'DejaloSer + Resumen'
        : 'Let It Be + Summary';
    }
    
    try {
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
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'download_book_submit',
        book_id: selectedBook,
        book_title: sanitizeForAnalytics(bookData?.title || ''),
        user_email: sanitizeForAnalytics(validatedData.email)
      });
      
      // Show success state
      setIsSubmitted(true);
      
      // Download the PDF after a short delay to ensure UI updates
      setTimeout(async () => {
        try {
          const res = await fetch(pdfFileName);
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
          toast({
            title: language === 'es' ? 'Error de descarga' : 'Download error',
            description: language === 'es' 
              ? 'No se pudo iniciar la descarga. Por favor intenta nuevamente.' 
              : 'Could not start download. Please try again.',
            variant: 'destructive'
          });
        }
      }, 300);
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setIsDialogOpen(false);
        setFormData({ name: '', email: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle Zod validation errors specifically
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: language === 'es' ? 'Error de validación' : 'Validation error',
          description: firstError.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' 
            ? 'Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.' 
            : 'There was a problem processing your request. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBookData = selectedBook
    ? localizedBooks.find((book) => book.id === selectedBook)
    : null;

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-primary/80 font-sans text-sm md:text-base uppercase tracking-wider">{t('download.section.subtitle')}</h2>
            <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t('download.section.title')} <span className="text-gold">{t('download.section.title.highlight')}</span>
            </h3>
            <p className="text-navy-light text-lg max-w-2xl mx-auto">
              {t('download.section.description')}
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {localizedBooks.slice(0, 3).map((book) => (
              <div 
                key={book.id} 
                className="bg-cream-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="font-heading text-xl font-semibold text-navy-dark mb-1">{book.title}</h4>
                <p className="text-primary/70 italic mb-3 text-sm">{book.subtitle}</p>
                <p className="text-navy-light text-sm mb-4 line-clamp-3">{book.excerpt}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-gold text-gold hover:bg-gold hover:text-navy-dark transition-colors"
                  onClick={() => handleDownload(book.id)}
                >
                  <span>{t('download.section.downloadBook')}</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Button asChild variant="default" className="bg-navy hover:bg-navy-dark">
              <Link href="/libros" className="inline-flex items-center">
                {t('download.section.viewLibrary')}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Download Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-heading">
              {isSubmitted ? t('download.dialog.thanks') : t('download.dialog.title')}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-center">
              {isSubmitted ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-600" size={24} />
                  </div>
                  <p className="text-lg">
                    {t('download.dialog.downloadStart')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('download.dialog.checkFolder')}
                  </p>
                </div>
              ) : (
                <p className="mt-2">
                  {t('download.dialog.complete')} {selectedBookData?.title}.
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
                    {t('download.form.fullName')}
                  </label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('download.form.namePlaceholder')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('download.form.email')}
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder={t('download.form.emailPlaceholder')}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  {t('download.form.cancel')}
                </Button>
                <Button type="submit" className="bg-gold hover:bg-gold-dark text-navy-dark" disabled={isSubmitting}>
                  {isSubmitting ? t('download.form.downloading') : t('download.form.downloadBook')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DownloadSection;
