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
import { useBooks } from '@/hooks/useBooks';
import Link from '@/components/LocalizedLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { downloadBook } from '@/lib/download-book';
import { z } from 'zod';

const DownloadSection = () => {
  const books = useBooks();
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
    setIsSubmitted(false);
    setFormData({ name: '', email: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !selectedBook) return;
    setIsSubmitting(true);
    try {
      const download = await downloadBook({ bookId: selectedBook, language, ...formData });
      window.dataLayer?.push({ event: 'download_book_submit', book_id: selectedBook, book_title: download.title });
      setIsSubmitted(true);
    } catch (error) {
      toast({ title: language === 'es' ? 'No se pudo descargar' : 'Download failed', description: error instanceof z.ZodError ? error.issues[0].message : (language === 'es' ? 'Intenta nuevamente. Tu descarga no se ha completado.' : 'Please try again. Your download has not completed.'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBookData = selectedBook ? books.find(book => book.id === selectedBook) : null;

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
            {books.slice(0, 3).map((book) => (
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
            <DialogDescription asChild><div className="text-center">
              {language === 'en' && selectedBook === 'lo-mejor-esta-por-venir' && <span className="block mb-2">This book is currently available as a Spanish PDF.</span>}
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
            </div></DialogDescription>
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
