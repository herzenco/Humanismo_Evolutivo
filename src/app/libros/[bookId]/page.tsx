"use client";

import Link from 'next/link';
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
import { useBookImages } from '@/hooks/useBookImages';

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = use(params);
  const { data: bookImages } = useBookImages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const book = books.find(b => b.id === bookId);
  const bookCoverImage = bookImages?.[bookId!] || book?.coverImage;

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

    // Determine the PDF file name and book name based on language and book ID
    let pdfFileName = '';
    let bookName = '';

    if (book.id === 'yo-soy-nosotros') {
      pdfFileName = language === 'es'
        ? '/books/Yo_Soy_Nosotros_Resumen.pdf'
        : '/books/I_Am_US_Summary.pdf';
      bookName = language === 'es'
        ? 'Yo soy nosotros + Resumen'
        : 'I Am US + Summary';
    } else if (book.id === 'ecologia-y-espiritualidad') {
      pdfFileName = language === 'es'
        ? '/books/Ecologia_y_Espiritualidad.pdf'
        : '/books/Ecology_and_Spirituality.pdf';
      bookName = language === 'es'
        ? 'Ecología y Espiritualidad'
        : 'Ecology and Spirituality';
    } else if (book.id === 'el-arte-de-ser-empresario') {
      pdfFileName = language === 'es'
        ? '/books/El_arte_de_ser_empresario_Resumen.pdf'
        : '/books/The_art_of_being_an_entrepreneur_Summary.pdf';
      bookName = language === 'es'
        ? 'El arte de ser empresario + Resumen'
        : 'The art of being an entrepreneur + Summary';
    } else if (book.id === 'dejalo-ser') {
      pdfFileName = language === 'es'
        ? '/books/DejaloSer_Resumen.pdf'
        : '/books/Let_It_Be_Summary.pdf';
      bookName = language === 'es'
        ? 'DejaloSer + Resumen'
        : 'Let It Be + Summary';
    } else if (book.id === 'lo-mejor-esta-por-venir') {
      pdfFileName = '/books/Lo_mejor_esta_por_venir.pdf';
      bookName = language === 'es'
        ? 'Lo mejor está por venir'
        : 'The best is yet to come';
    } else {
      // Generic fallback for any other books
      bookName = book.title || 'Unknown Book';
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
                Sobre el Libro
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

            {/* Prologue Section - Only for specific books */}
            {(book.id === 'yo-soy-nosotros' || book.id === 'ecologia-y-espiritualidad' || book.id === 'dejalo-ser' || book.id === 'el-arte-de-ser-empresario' || book.id === 'lo-mejor-esta-por-venir') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-16"
              >
                <h2 className="font-heading text-3xl font-semibold text-navy-dark mb-8 text-center">
                  Prólogo
                </h2>

                <div className="prose prose-lg max-w-none text-navy-light space-y-6">
                  {book.id === 'yo-soy-nosotros' && (
                    <>
                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Yo Soy Nosotros</span> es una invitación a mirar el mundo con nuevos ojos: los de la conciencia que reconoce su unidad con el universo, con la vida y con los demás. En estas páginas, Marcos Constandse comparte el fruto de más de tres décadas de búsqueda espiritual, filosófica y científica, en un recorrido que abarca el origen del cosmos, la evolución de la vida, la ecología, la filosofía, la psicología, las tradiciones espirituales y, sobre todo, el amor como fuerza esencial de la existencia.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Su visión transpersonal propone que la finalidad última del cosmos es el ser humano, y que el verdadero sentido de nuestra existencia está en la evolución de la conciencia hacia niveles más elevados. No se trata de un conocimiento fragmentado, sino de una integración que une ciencia y espiritualidad, razón y contemplación, individuo y comunidad.
                      </p>

                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Yo Soy Nosotros</span> no ofrece respuestas dogmáticas, sino un mapa de reflexión para quienes buscan dirección en medio de la incertidumbre. Es un recordatorio de que no estamos solos ni en la crisis ni en la búsqueda, y de que nuestra tarea es reconocer al "otro" como un fin en sí mismo, no como un medio, en un camino compartido de evolución y plenitud.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Este libro —y el legado de Marcos Constandse— nos invita a construir juntos un horizonte más consciente, más humano y más espiritual. Porque la verdadera realización surge cuando comprendemos que el "yo" sólo cobra sentido en el "nosotros".
                      </p>
                    </>
                  )}

                  {book.id === 'ecologia-y-espiritualidad' && (
                    <>
                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Ecología y espiritualidad</span> es un llamado urgente a reconocer que el destino de la humanidad y el del planeta son inseparables. Marcos Constandse nos recuerda que la ecología no es sólo una ciencia, sino también un camino espiritual: comprender que todo forma parte de un mismo todo y que nuestras acciones repercuten en la vida de todos los seres.
                      </p>

                      <p className="text-lg leading-relaxed">
                        El autor plantea que la verdadera evolución humana no se mide únicamente en avances tecnológicos o económicos, sino en la capacidad de integrar la conciencia ecológica con la ética y la espiritualidad. La degradación ambiental y el cambio climático nos enfrentan a un reto sin precedentes, que no puede resolverse únicamente con soluciones técnicas: requiere una transformación profunda de valores y de visión del mundo.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Con claridad y fuerza, este libro denuncia los riesgos del egoísmo humano y la indiferencia, pero también ofrece esperanza al señalar que el desarrollo de una conciencia espiritual —el imperativo ético de reconocer que "el otro es como yo"— puede guiar nuestras decisiones hacia un futuro más justo y sostenible.
                      </p>

                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Ecología y espiritualidad</span> nos invita a actuar desde la responsabilidad compartida, a unir ciencia y espíritu, razón y amor, en la construcción de un planeta donde la vida no solo sobreviva, sino que florezca. Es un testimonio de que la preservación de la Tierra comienza en la conciencia de cada uno de nosotros.
                      </p>
                    </>
                  )}

                  {book.id === 'dejalo-ser' && (
                    <>
                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">¡Déjalo ser!</span> es una novela de reflexión que entrelaza ficción y realidad para invitarnos a mirar el futuro de la humanidad a través de la vida de sus protagonistas. En un mundo atravesado por la tecnología, la memoria digital y los dilemas éticos, Marcos Constandse plantea preguntas profundas sobre la identidad, la libertad y el sentido de la vida.
                      </p>

                      <p className="text-lg leading-relaxed">
                        La obra nos conduce a un viaje íntimo y a la vez colectivo: el de un joven que, al buscar sus raíces en archivos y registros digitales, se enfrenta con la historia de su familia, sus contradicciones y su legado. A través de esta trama, el autor explora los retos de la modernidad —la vigilancia tecnológica, la pérdida de intimidad, el choque entre tradición y cambio— y los ilumina con una visión espiritual y humanista.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Más que una narración futurista, <span className="font-semibold text-navy-dark">¡Déjalo ser!</span> es una meditación sobre lo que significa ser humano en medio de un mundo que cambia vertiginosamente. Nos recuerda que, aun en la era de la información y del control, la libertad más auténtica sigue siendo la de vivir en plenitud, con amor, con conciencia y con la capacidad de aceptar lo que es.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Es una invitación a reconciliarnos con nuestro pasado, a confiar en el presente y a soltar el futuro: dejar ser a la vida misma.
                      </p>
                    </>
                  )}

                  {book.id === 'el-arte-de-ser-empresario' && (
                    <>
                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">El arte de ser empresario</span> es mucho más que un manual sobre negocios: es una reflexión filosófica y ética sobre la función del empresario en la sociedad. Marcos Constandse plantea que emprender no se limita a generar riqueza, sino a crear bienestar, contribuir al bien común y evolucionar como seres humanos.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Desde su experiencia personal y con una visión integral, el autor expone cómo el trabajo, la creatividad y la responsabilidad social son fuerzas que dan sentido a la vida y que permiten construir empresas con propósito. A lo largo de sus páginas, reflexiona sobre la abundancia, el capital, el trabajador, el mercado y la calidad de vida, pero siempre desde una perspectiva humanista que busca armonizar economía, ecología y espiritualidad.
                      </p>

                      <p className="text-lg leading-relaxed">
                        El libro muestra que el verdadero empresario no es quien acumula, sino quien transforma: alguien que entiende que el trabajo es un medio de autorrealización y que la empresa puede ser un espacio de evolución personal y colectiva.
                      </p>

                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">El arte de ser empresario</span> es, en última instancia, una invitación a concebir la actividad empresarial como un camino de conciencia y de servicio, donde el éxito se mide no sólo en resultados económicos, sino en la capacidad de generar justicia, solidaridad y felicidad compartida.
                      </p>
                    </>
                  )}

                  {book.id === 'lo-mejor-esta-por-venir' && (
                    <>
                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Y lo mejor aún está por venir</span> es un ensayo filosófico de autoayuda en el que Marcos Constandse comparte su experiencia de vida y su visión del mundo, integrando ciencia, filosofía y espiritualidad. No es un tratado académico ni un compendio del conocimiento universal, sino una invitación a reflexionar sobre el sentido de la existencia y a construir un camino propio hacia la plenitud.
                      </p>

                      <p className="text-lg leading-relaxed">
                        El autor propone la evolución como guía para comprender nuestra realidad: el universo, la materia, la vida y la conciencia son parte de un mismo proceso en constante transformación. En este recorrido, nos invita a cuestionar nuestras creencias, a observar las ideologías y los sistemas que nos rodean, y a encontrar nuestra propia ruta hacia la felicidad.
                      </p>

                      <p className="text-lg leading-relaxed">
                        Con un estilo cercano y honesto, Marcos entrelaza conceptos de física cuántica, ecología, psicología, economía y espiritualidad, mostrando que el conocimiento, cuando se vive con conciencia, puede convertirse en una brújula para orientar nuestras decisiones.
                      </p>

                      <p className="text-lg leading-relaxed">
                        <span className="font-semibold text-navy-dark">Y lo mejor aún está por venir</span> es, en esencia, una celebración de la vida y una afirmación de esperanza: la certeza de que cada experiencia, incluso las crisis, nos acercan a una conciencia más amplia y profunda. Es una invitación a mirar hacia adelante con confianza, sabiendo que lo más valioso de nuestro camino está aún por descubrirse.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Resumen Section - Only for specific books */}
            {(book.id === 'yo-soy-nosotros' || book.id === 'ecologia-y-espiritualidad' || book.id === 'dejalo-ser' || book.id === 'el-arte-de-ser-empresario' || book.id === 'lo-mejor-esta-por-venir') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16"
              >
                <h2 className="font-heading text-3xl font-semibold text-navy-dark mb-8 text-center">
                  Resumen
                </h2>

                <div className="prose prose-lg max-w-none text-navy-light space-y-6">
                  {book.id === 'yo-soy-nosotros' && (
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        El libro Yo Soy Nosotros, escrito por Marcos Constandse, constituye una obra de profunda reflexión filosófica y espiritual que busca integrar los saberes científicos, humanísticos y trascendentales en una visión unitaria de la existencia. Desde sus primeras páginas, el autor deja claro que su propósito no es elaborar un tratado académico ni un compendio exhaustivo, sino compartir el fruto de más de treinta y cinco años de búsqueda interior, intelectual y espiritual.
                      </p>

                      <p className="text-base leading-relaxed">
                        El eje central de la obra es la convicción de que la finalidad del cosmos es la existencia del ser humano y que el sentido último de esa existencia radica en la evolución de la consciencia hacia estadios superiores. Así, el universo, la Tierra, la vida y la historia no se comprenden de manera aislada, sino como parte de un proceso integral en el que la materia se espiritualiza y la consciencia se expande. En esta visión, el ser humano no es un accidente del universo, sino su manifestación más plena.
                      </p>

                      <p className="text-base leading-relaxed">
                        El recorrido del libro inicia con la descripción del origen del universo y de la Tierra, enmarcados en los descubrimientos de la física cuántica y la cosmología moderna. Constandse resalta cómo la materia y la energía están íntimamente ligadas, y cómo en esa dinámica de transformación se encuentra la base de la vida. Posteriormente, aborda la evolución de los seres vivos, destacando la dimensión espiritual de este proceso, siguiendo intuiciones de pensadores como Teilhard de Chardin, para quien la evolución es, en esencia, la espiritualización de la materia.
                      </p>

                      <p className="text-base leading-relaxed">
                        Más adelante, el autor reflexiona sobre el tiempo y el espacio, mostrando que estas categorías no son absolutas, sino relativas a la consciencia humana. Esta comprensión abre la puerta a nuevas formas de concebir la realidad y de ubicar al ser humano dentro de ella. Asimismo, dedica un espacio a la ecología, señalando la estrecha relación entre energía, economía y medio ambiente, y recordándonos que degradar nuestro entorno es degradarnos a nosotros mismos.
                      </p>

                      <p className="text-base leading-relaxed">
                        En el terreno del pensamiento y la mente, Constandse recorre la filosofía y la psicología, desde los griegos hasta Freud, Jung, Maslow y Wilber. A través de esta síntesis, muestra cómo el ser humano ha ido construyendo una visión cada vez más amplia de sí mismo y de su lugar en el cosmos. De igual modo, examina las tradiciones espirituales de Oriente y Occidente, reconociendo en todas ellas múltiples caminos hacia una misma realidad: la unidad espiritual.
                      </p>

                      <p className="text-base leading-relaxed">
                        Uno de los aportes más significativos del libro es la exposición del desarrollo transpersonal. Constandse lo entiende no como una religión ni como un dogma, sino como un proceso de ampliación de la consciencia. Su núcleo ético se expresa en la frase: "el otro es como yo", que implica reconocer la dignidad infinita del prójimo y asumir que la verdadera evolución consiste en integrar al otro en nuestra propia consciencia.
                      </p>

                      <p className="text-base leading-relaxed">
                        En este marco, el autor también reflexiona sobre los valores, la ética y la construcción del ser humano integral. Considera que la evolución de la consciencia moral es tan importante como los avances científicos o tecnológicos, y que el gran reto del hombre contemporáneo es integrar su desarrollo material con una profunda espiritualidad que respete al prójimo y a la naturaleza.
                      </p>

                      <p className="text-base leading-relaxed">
                        La conclusión de la obra es clara y contundente: evolucionar es ser. El camino del ser humano consiste en recordar su origen unitario, trascender el ego y reencontrarse con la totalidad del cosmos. La espiritualización de la vida no es un añadido, sino el destino mismo de nuestra existencia. Así, Yo Soy Nosotros no sólo es un libro de reflexión, sino también una invitación vital a vivir con mayor plenitud, consciencia y amor.
                      </p>

                      <p className="text-base leading-relaxed">
                        En suma, la obra de Marcos Constandse nos propone un mapa espiritual y filosófico en el que ciencia, filosofía, psicología y espiritualidad se entrelazan en un mismo horizonte: el de reconocernos como parte inseparable del universo y asumir que nuestra verdadera tarea es contribuir al desarrollo de la consciencia universal.
                      </p>
                    </div>
                  )}

                  {book.id === 'ecologia-y-espiritualidad' && (
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        El libro Ecología y Espiritualidad, de Marcos Constandse, constituye un intento lúcido y comprometido por abordar uno de los grandes dilemas del siglo XXI: la relación del ser humano con la naturaleza y la necesidad urgente de integrar la conciencia ecológica con una visión espiritual. Lejos de quedarse en un enfoque técnico o científico de la ecología, Constandse propone un horizonte más amplio en el que se cruzan filosofía, ética, política y espiritualidad.
                      </p>

                      <p className="text-base leading-relaxed">
                        Desde las primeras páginas, el autor reconoce que la ecología es una ciencia joven, multidisciplinaria y, al mismo tiempo, profundamente polémica. La biosfera, como casa común de la humanidad, enfrenta amenazas que van desde el calentamiento global hasta la contaminación de mares, suelos y atmósfera. Frente a estos retos, Constandse plantea que la verdadera solución no puede provenir únicamente de avances científicos o tecnológicos, sino de un cambio en la consciencia humana.
                      </p>

                      <p className="text-base leading-relaxed">
                        Uno de los aportes centrales del libro es la distinción entre una "ecología mitológica" y una "ecología racional". La primera, movida por el miedo y la simplicidad interpretativa, cae en fanatismos que proponen soluciones irreales o incluso dañinas. La segunda, en cambio, se sustenta en el método científico, en la reflexión crítica y en la búsqueda de un desarrollo sustentable que equilibre las necesidades presentes con las de las generaciones futuras. Para el autor, sólo esta ecología racional puede conducirnos a una acción efectiva y duradera.
                      </p>

                      <p className="text-base leading-relaxed">
                        Constandse vincula esta mirada con el concepto de imperativo ético: "el otro es como yo". Esto significa que la naturaleza no debe ser cuidada por sí misma de manera abstracta, sino en tanto que está íntimamente ligada a la vida humana y a nuestra supervivencia. Degradar el entorno es degradarnos a nosotros mismos. Así, la espiritualidad se entiende como la conciencia de la interdependencia de todo lo existente y como la capacidad de actuar en consecuencia.
                      </p>

                      <p className="text-base leading-relaxed">
                        El autor no evade los aspectos políticos y económicos del problema. Señala que el consumo energético está en el corazón de la crisis ecológica, y que el egoísmo humano y los intereses económicos suelen imponerse sobre la preservación del ambiente. Sin embargo, también advierte que la solución no pasa por un regreso romántico a formas primitivas de vida, sino por encontrar un modelo de desarrollo sustentable que integre tecnología, justicia social y respeto a la naturaleza.
                      </p>

                      <p className="text-base leading-relaxed">
                        A lo largo de la obra, Constandse insiste en que la humanidad se encuentra en un punto decisivo: nunca antes como ahora habíamos tenido tanta información y herramientas para comprender la realidad, pero al mismo tiempo, nunca habíamos enfrentado un riesgo tan grande de autodestrucción. La ecología, por tanto, no es sólo una ciencia, sino un llamado ético y espiritual a despertar y actuar.
                      </p>

                      <p className="text-base leading-relaxed">
                        En conclusión, Ecología y Espiritualidad nos invita a asumir con responsabilidad nuestra condición de guardianes de la Tierra. No basta con conocer los problemas; es necesario transformarnos interiormente para responder a ellos. La unión entre ecología y espiritualidad que propone Constandse no es una opción secundaria, sino la condición esencial para garantizar el futuro de la humanidad y de la vida en el planeta. Este libro es, en última instancia, una exhortación a vivir con mayor consciencia, respeto y amor hacia el mundo que habitamos.
                      </p>
                    </div>
                  )}

                  {book.id === 'dejalo-ser' && (
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        La novela ¡Déjalo ser!, de Marcos Constandse, constituye un ejercicio literario que combina ficción y reflexión filosófica. A diferencia de sus ensayos más explícitamente conceptuales, en esta obra el autor se vale de la narrativa para explorar grandes temas de la condición humana, en particular la identidad, la memoria, la tecnología y la libertad.
                      </p>

                      <p className="text-base leading-relaxed">
                        El relato se centra en Rubén Hernández Chi, un joven de 26 años que, en un futuro cercano, accede a una vasta base de datos en la que se encuentran almacenados recuerdos e información esencial de su vida y de su familia. A través de este recurso tecnológico, Rubén emprende un viaje introspectivo hacia sus raíces, en el que descubre no solo la historia de sus padres y abuelos, sino también la tensión entre tradición y modernidad, entre tecnología y humanidad.
                      </p>

                      <p className="text-base leading-relaxed">
                        La obra plantea un dilema que atraviesa a la sociedad contemporánea: ¿hasta qué punto la tecnología, que promete preservar nuestra memoria y ampliar nuestras capacidades, puede convertirse también en una forma de esclavitud? Constandse, al situar la narración en un contexto dominado por sistemas de información y bancos de datos, anticipa debates actuales sobre privacidad, vigilancia y control social. Sin embargo, la novela no se limita a la crítica; más bien invita a reflexionar sobre el modo en que podemos integrar los avances tecnológicos sin perder de vista la esencia de lo humano.
                      </p>

                      <p className="text-base leading-relaxed">
                        Uno de los momentos más significativos del libro es el diálogo entre los padres de Rubén, en el que se enfrentan dos posturas opuestas. Por un lado, la fe optimista en el progreso, que confía en que la tecnología puede ser una herramienta para construir un mundo mejor. Por otro, la mirada crítica y temerosa, que advierte sobre los peligros de la manipulación, el control y la pérdida de libertad. Este contraste refleja una tensión universal que se repite en la historia de la humanidad cada vez que surge una innovación disruptiva.
                      </p>

                      <p className="text-base leading-relaxed">
                        La frase que da título a la obra, "¡Déjalo ser!", expresa una actitud de apertura y confianza frente al devenir. Es un llamado a aceptar el cambio, a reconocer que la vida misma es un proceso en constante transformación y que resistirse a ello genera sufrimiento. En este sentido, la novela trasciende lo tecnológico para convertirse en una metáfora de la existencia humana: aprender a soltar, a confiar y a vivir con autenticidad.
                      </p>

                      <p className="text-base leading-relaxed">
                        Constandse combina en esta obra elementos de ciencia ficción con reflexiones espirituales y éticas, creando un texto híbrido que desafía géneros y categorías. La narración no es lineal ni se limita al entretenimiento; busca, sobre todo, provocar en el lector preguntas sobre su propio lugar en el mundo y sobre la manera en que construye su identidad en diálogo con la memoria y la historia colectiva.
                      </p>

                      <p className="text-base leading-relaxed">
                        En conclusión, ¡Déjalo ser! es una invitación a contemplar el futuro con consciencia y a no perder de vista el valor de la libertad y de la autenticidad personal frente a un mundo cada vez más condicionado por la tecnología. La obra nos recuerda que, más allá de los avances científicos y técnicos, la esencia de lo humano sigue siendo la capacidad de amar, de elegir y de dejar ser.
                      </p>
                    </div>
                  )}

                  {book.id === 'lo-mejor-esta-por-venir' && (
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        El libro Y lo mejor aún está por venir de Marcos Constandse se presenta como un ensayo filosófico de autoayuda que busca orientar al lector hacia una vida con mayor conciencia, plenitud y sentido. A través de su experiencia personal y de un sólido recorrido por distintos saberes científicos, filosóficos y espirituales, el autor plantea que la clave para enfrentar la incertidumbre y la confusión del mundo contemporáneo se encuentra en comprender el proceso de la evolución y aplicarlo como guía en nuestra existencia.
                      </p>

                      <p className="text-base leading-relaxed">
                        Desde el inicio, Constandse advierte que no se trata de un compendio de historia universal ni de un manual de fórmulas, sino de una reflexión personal que utiliza herramientas del método científico, de la observación y de la filosofía para extraer enseñanzas prácticas. El concepto central es que la evolución no es un hecho aislado del pasado, sino un proceso constante que se manifiesta en todos los aspectos de la vida. Vivir con conciencia de ese proceso significa aprender a reconocer las tendencias, comparar resultados y orientar nuestras acciones hacia la construcción de un futuro mejor.
                      </p>

                      <p className="text-base leading-relaxed">
                        La obra está dividida en dos grandes propuestas. En la primera, el autor aborda temas fundamentales como el origen del universo, la materia, la vida en la Tierra, la evolución, la energía y el conocimiento. Reflexiona también sobre el ser humano en su integridad: cuerpo, alma y espíritu, y analiza cómo el ego, el trabajo, la comunicación, los valores y la relación con el dinero moldean nuestra experiencia vital. En esta parte, Constandse ofrece un marco de comprensión de la realidad que combina física cuántica, biología, filosofía y espiritualidad, siempre con la intención de mostrar la unidad que subyace a todo.
                      </p>

                      <p className="text-base leading-relaxed">
                        En la segunda propuesta, el autor se centra en la aplicación práctica de estas ideas. Expone su visión sobre el empresario, la empresa, el capital y el trabajador, en un diálogo entre economía, ética y espiritualidad. Defiende la necesidad de orientar la actividad económica hacia el bien común, superando los extremos del materialismo y del fanatismo ideológico. Para Constandse, el verdadero motor del progreso no es la lucha de clases ni el afán desmedido de lucro, sino la conciencia de interdependencia y el impulso evolutivo que nos llama a buscar justicia, verdad y belleza.
                      </p>

                      <p className="text-base leading-relaxed">
                        El libro también dedica espacio a los grandes retos contemporáneos: la globalización, la democracia, el medio ambiente, la cultura del consumo y los desequilibrios sociales. Frente a ellos, el autor propone una revolución de la conciencia, en la que cada individuo asuma su responsabilidad de transformar el mundo empezando por sí mismo. Este proceso exige reconocer la dignidad del otro como fin y no como medio, lo que Constandse denomina el imperativo ético.
                      </p>

                      <p className="text-base leading-relaxed">
                        Un aspecto particularmente valioso del texto es la dimensión autobiográfica que aparece en las páginas finales. Constandse comparte episodios de su infancia y juventud, marcados por sentimientos de inferioridad que logró superar gracias al trabajo apasionado y a la búsqueda de sentido. Estos recuerdos no son un simple añadido personal, sino una prueba de que el camino hacia la plenitud está abierto a todos, incluso a quienes parten de la inseguridad y la duda.
                      </p>

                      <p className="text-base leading-relaxed">
                        En conclusión, Y lo mejor aún está por venir es una obra que combina reflexión filosófica, propuestas éticas y experiencias personales en un mismo horizonte: el de una vida guiada por la conciencia evolutiva y el compromiso con el bien común. El mensaje central es optimista y esperanzador: a pesar de las crisis y los desafíos, el futuro puede ser mejor si aprendemos a vivir en congruencia con la evolución de la vida, de la conciencia y del espíritu humano.
                      </p>
                    </div>
                  )}

                  {book.id === 'el-arte-de-ser-empresario' && (
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        El libro El arte de ser empresario, en su tercera edición, representa una síntesis de la visión filosófica, ética y práctica que Marcos Constandse desarrolla en torno al quehacer empresarial. Más allá de un manual técnico de administración o de economía, esta obra busca ofrecer un marco integral donde la actividad empresarial se conciba como una vocación orientada al bien común y a la evolución de la conciencia.
                      </p>

                      <p className="text-base leading-relaxed">
                        Desde el prólogo, Constandse plantea que el trabajo no es un castigo ni una forma de explotación, sino un medio de autorrealización que da sentido a la vida. Esta afirmación constituye el punto de partida para redefinir el papel del empresario, la empresa, el capital y el trabajador en un contexto social y humano más amplio. Su propuesta es superar la visión reduccionista que asocia al empresario únicamente con el lucro, para entenderlo como un agente de transformación social y espiritual.
                      </p>

                      <p className="text-base leading-relaxed">
                        El autor se apoya en una concepción evolutiva de la existencia, vinculando la física cuántica, la filosofía y la espiritualidad con la práctica económica. En este marco, el empresario se convierte en un actor clave que debe asumir una responsabilidad ética: reconocer que "el otro es como yo" y, por lo tanto, orientar sus decisiones hacia el respeto a la dignidad humana y al desarrollo integral de la sociedad.
                      </p>

                      <p className="text-base leading-relaxed">
                        En el análisis de Constandse, conceptos como abundancia, bienestar, seguridad y felicidad se entienden no como bienes materiales aislados, sino como estados de congruencia entre intención y acción. El empresario, al actuar con buena intención y generar resultados positivos, puede contribuir a una sociedad más justa y equilibrada. Esta visión se contrapone tanto al materialismo extremo como a las posturas ideológicas que condenan de manera absoluta la actividad empresarial.
                      </p>

                      <p className="text-base leading-relaxed">
                        Uno de los apartados más relevantes del libro es la comparación entre el materialismo dialéctico y la física cuántica. Constandse critica la visión rígida de la lucha de clases y resalta, en cambio, la interdependencia como principio fundamental de la realidad. Esta idea se traduce en el ámbito económico en la necesidad de colaboración entre capital y trabajo, empresa y trabajador, empresario y comunidad.
                      </p>

                      <p className="text-base leading-relaxed">
                        El autor también reflexiona sobre el papel de la empresa como organismo vivo que posee un ADN propio, una misión, una visión y un espíritu. Para él, el verdadero éxito empresarial no reside únicamente en el crecimiento económico, sino en la capacidad de generar un impacto positivo en la vida de las personas y en el entorno. En este sentido, el empresario debe actuar como un líder consciente que busca el equilibrio entre productividad, sostenibilidad y justicia social.
                      </p>

                      <p className="text-base leading-relaxed">
                        Finalmente, el libro integra una dimensión autobiográfica, donde Constandse comparte experiencias personales de superación de complejos de inferioridad y de construcción de un autoconcepto positivo a través del trabajo. Estos recuerdos refuerzan su idea de que la actividad empresarial puede ser, en efecto, un camino de autorrealización y de servicio.
                      </p>

                      <p className="text-base leading-relaxed">
                        En conclusión, El arte de ser empresario es una invitación a repensar el rol del empresario desde una perspectiva ética y espiritual. Para Constandse, ser empresario no es únicamente dirigir una empresa, sino ejercer un arte: el arte de crear, de transformar y de contribuir al bien común. La obra propone, así, una visión renovada de la economía y del trabajo como expresiones de la evolución humana y de la espiritualización de la materia.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
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
