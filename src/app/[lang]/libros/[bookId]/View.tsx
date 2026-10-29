"use client";

import Link from '@/components/LocalizedLink';
import { use } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { books } from '@/data/books';
import PageWrapper from "@/components/layout/PageWrapper";
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
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { bookDownloadSchema, sanitizeForAnalytics } from '@/lib/validation';
import { z } from 'zod';
import { BookStructuredData } from '@/components/seo/StructuredData';

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const book = books.find(b => b.id === bookId);
  const bookCoverImage = book?.coverImage;

  if (!book) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Libro no encontrado</h1>
          <p className="mb-6">Lo sentimos, el libro que buscas no está disponible.</p>
          <Link
            href="/libros"
            className="inline-flex items-center text-gold hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver a la biblioteca
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const handleDownload = () => {
    (window as any).dataLayer?.push({
      event: 'book_detail_download_click',
      book_id: book?.id,
      book_title: book?.title,
      location: 'book_detail_page'
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pdfFileName = book.pdfUrl;
    const bookName = book.title;

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

      // Track analytics using sanitized data
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'book_download_form_submit',
        book_id: book?.id,
        book_title: sanitizeForAnalytics(book?.title || ''),
        user_name: sanitizeForAnalytics(validatedData.name),
        user_email: sanitizeForAnalytics(validatedData.email)
      });

      // Show success message first
      setIsSubmitted(true);

      // Trigger download after a short delay to ensure UI updates
      setTimeout(async () => {
        try {
          // Check if PDF is available for this book
          if (!pdfFileName) {
            toast({
              title: language === 'es' ? 'PDF no disponible' : 'PDF not available',
              description: language === 'es'
                ? 'El PDF de este libro aún no está disponible. Te notificaremos cuando esté listo.'
                : 'The PDF for this book is not yet available. We will notify you when it is ready.',
            });
            return;
          }

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
            variant: 'destructive',
          });
        }
      }, 300);

      // Reset and close after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setIsDialogOpen(false);
        setFormData({ name: '', email: '' });
      }, 3000);

    } catch (err) {
      console.error('Error submitting book download form:', err);

      // Handle Zod validation errors specifically
      if (err instanceof z.ZodError) {
        const firstError = err.issues[0];
        toast({
          title: language === 'es' ? 'Error de validación' : 'Validation error',
          description: firstError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es'
            ? 'Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.'
            : 'There was a problem processing your request. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <BookStructuredData
        title={book.title}
        subtitle={book.subtitle}
        author={book.author}
        description={book.description}
        keywords={book.keywords}
        coverImage={bookCoverImage || book.coverImage}
        url={`https://humanismoevolutivo.com/libros/${book.id}`}
      />
      {/* Book Header */}
      <section className="relative py-20 lg:py-28 bg-navy-dark text-white overflow-hidden" aria-label="Detalles del libro">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-primary/30 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/libros"
            className="inline-flex items-center text-white/70 hover:text-white mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver a la biblioteca
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
                  {book.title}
                </h1>
                <h2 className="text-xl md:text-2xl font-heading text-gold italic mb-6">
                  {book.subtitle}
                </h2>

                <div className="flex flex-wrap gap-2 mb-8">
                  {book.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/10 text-white/90 px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="mb-8">
                  <div>
                    <p className="text-white/70 text-sm">Autor</p>
                    <p className="font-medium">{book.author}</p>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  className="bg-gold hover:bg-gold-light text-navy-dark inline-flex items-center"
                  size="lg"
                >
                  <Download size={18} className="mr-2" />
                  Descargar Libro
                </Button>
              </motion.div>
            </div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="book-3d">
                  <img
                    src={`${bookCoverImage || book.coverImage}?t=${Date.now()}`}
                    alt={`Portada del libro ${book.title} - ${book.subtitle}`}
                    className="rounded-md shadow-2xl max-w-xs"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-3xl font-semibold text-navy-dark mb-6">
                Sobre el libro
              </h2>

              <div className="prose prose-lg max-w-none text-navy-light">
                {book.description.map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 p-8 bg-cream-light rounded-lg"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="sm:w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-navy-dark mb-3">
                    ¿Te gustaría leer este libro?
                  </h3>
                  <p className="text-navy-light mb-4">
                    Descarga gratuitamente "{book.title}" y comienza tu viaje hacia una
                    comprensión más profunda del ser humano y su lugar en el universo.
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="bg-navy hover:bg-navy-dark"
                  >
                    Descargar Ahora
                  </Button>
                </div>
              </div>
            </motion.div>

            {([{ title: 'Prólogo', paragraphs: book.prologue }, { title: 'Resumen', paragraphs: book.summary }]).map(section => (
              <section key={section.title} className="mt-16">
                <h2 className="font-heading text-3xl font-semibold text-navy-dark mb-8">{section.title}</h2>
                <div className="prose prose-lg max-w-none text-navy-light space-y-6">
                  {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Related Books */}
      <section className="py-16 bg-cream-light">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-semibold text-navy-dark mb-4">
              También te puede interesar
            </h2>
            <p className="text-navy-light max-w-2xl mx-auto">
              Explora otras obras de Marcos Constandse que complementan
              las ideas y reflexiones de este libro.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {books.filter(b => b.id !== book.id).slice(0, 3).map((relatedBook) => (
              <Link
                key={relatedBook.id}
                href={`/libros/${relatedBook.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={relatedBook.image}
                    alt={relatedBook.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-navy-dark mb-1">
                    {relatedBook.title}
                  </h3>
                  <p className="text-primary/70 italic mb-3 text-sm">
                    {relatedBook.subtitle}
                  </p>
                  <p className="text-navy-light text-sm line-clamp-2">
                    {relatedBook.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Download Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-heading">
              {isSubmitted ? '¡Gracias!' : `Descargar ${book.title}`}
            </DialogTitle>
            <DialogDescription className="text-center">
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
                  {language === 'es'
                    ? `Completa el formulario para descargar ${book.title}.`
                    : `Complete the form to download ${book.title}.`}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted && (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
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
}
