"use client";

import BooksIntro from "@/components/design/BooksIntro";
import { Download, BookOpen } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import { books } from '@/data/books';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { bookDownloadSchema, sanitizeForAnalytics } from '@/lib/validation';
import { z } from 'zod';
import UpcomingBooks from '@/components/design/UpcomingBooks';
import { bookForLanguage } from '@/lib/book-english';

const Libros = () => {
  const { t, language } = useLanguage();
  const displayBooks = books.map(book => bookForLanguage(book, language, t));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const requestedBook = new URLSearchParams(window.location.search).get('descargar');
    if (requestedBook && books.some(book => book.id === requestedBook)) {
      setSelectedBook(requestedBook);
      setIsDialogOpen(true);
    }
  }, []);

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

      const pdfFileName = book.pdfUrl;
      const bookName = book.title;

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


  return (
    <PageWrapper>
      {/* Sophisticated Hero Section */}
      <BooksIntro />

      {/* Premium Books Grid */}
      <section id="obras" className="design-book-list">
        <div className="design-content-width">
          <div className="design-section-heading"><span className="design-eyebrow">{language === 'es' ? 'LAS OBRAS' : 'THE BOOKS'}</span><h2>{language === 'es' ? 'Un camino a través de la lectura' : 'A journey through reading'}</h2></div>
          {displayBooks.map((book, index) => <article className="design-book-row" key={book.id}>
            <Link href={`/libros/${book.id}`} className="design-book-cover" aria-label={book.title}><img src={book.coverImage} alt={book.title} loading="lazy" /></Link>
            <div className="design-book-body"><span className="design-eyebrow">{String(index + 1).padStart(2, '0')} · {book.keywords[0]}</span><h2><Link href={`/libros/${book.id}`}>{book.title}</Link></h2><p className="design-book-subtitle">{book.subtitle}</p><p>{book.excerpt}</p><div className="design-tags">{book.keywords.slice(0, 3).map(keyword => <span key={keyword}>{keyword}</span>)}</div><div className="design-actions"><Link href={`/libros/${book.id}`} className="design-button">{language === 'es' ? 'Explorar el libro' : 'Explore the book'} <BookOpen size={18} /></Link>{book.downloadAvailable ? <button type="button" className="design-button design-button-outline" onClick={() => handleDownload(book.id)}><Download size={18} />{language === 'es' ? 'Descargar libro (PDF)' : 'Download book (PDF)'}</button> : null}</div></div>
          </article>)}
        </div>
      </section>

      <UpcomingBooks />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="download-description">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-heading">
              {isSubmitted
                ? (language === 'es' ? '¡Gracias!' : 'Thank you!')
                : (selectedBook && books.find(b => b.id === selectedBook)?.title
                    ? `${language === 'es' ? 'Descargar' : 'Download'} ${books.find(b => b.id === selectedBook)?.title}`
                    : (language === 'es' ? 'Descargar Libro' : 'Download Book'))}
            </DialogTitle>
            <div className="text-center" id="download-description">
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
                  {selectedBook && books.find(b => b.id === selectedBook)?.title
                    ? (language === 'es'
                        ? `Completa el formulario para descargar ${books.find(b => b.id === selectedBook)?.title}.`
                        : `Complete the form to download ${books.find(b => b.id === selectedBook)?.title}.`)
                    : (language === 'es'
                        ? 'Completa el formulario para descargar.'
                        : 'Complete the form to download.')}
                </p>
              )}
            </div>
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
