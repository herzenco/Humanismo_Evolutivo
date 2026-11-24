"use client";

import { use } from 'react';
import { redirect } from 'next/navigation';
import { useLocalizedRouter as useRouter } from '@/hooks/useLocalizedRouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Calendar, Clock, ExternalLink } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { podcastSeries } from '@/data/media';
import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { localizedEpisodeContent } from '@/data/podcastEpisodeContent';

export default function ShowDetailPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const { t, language } = useLanguage();
  const router = useRouter();

  // Fetch podcast series with cover images from database
  const { data: dbPodcastSeries } = useQuery({
    queryKey: ['podcast-series'],
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_series')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Find the show
  const show = podcastSeries.find(s => s.id === showId);
  const dbShow = dbPodcastSeries?.find(db => db.book_id === showId);

  if (!show) {
    redirect('/medios');
  }

  const coverImage = dbShow?.cover_image_url || show.coverImage;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
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
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url(${coverImage})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/medios"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Medios
            </Link>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-80 flex-shrink-0">
                <img
                  src={coverImage}
                  alt={t(show.titleKey)}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
              </div>

              <div className="flex-1">
                <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 leading-tight">
                  {t(show.titleKey)}
                </h1>
                <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-8">
                  {t(show.descriptionKey)}
                </p>

                {/* Extended Description */}
                <div className="prose prose-invert prose-lg max-w-none mb-8">
                  {show.id === 'yo-soy-nosotros' && (
                    <div className="space-y-4 text-white/90 leading-relaxed">
                      <p>
                        Yo Soy Nosotros parte de una visión integral del ser humano como parte inseparable del universo y de la trama de la vida. No somos individuos aislados, sino expresiones de una misma esencia que se manifiesta a través de la evolución, la conciencia y la interdependencia. La obra invita a reconocer que nuestra identidad no termina en el "yo" biográfico, sino que está profundamente vinculada al "nosotros": a la naturaleza, a la comunidad, a la historia y al espíritu que nos atraviesa.
                      </p>
                      <p>
                        Desde esta comprensión, se explora cómo construimos nuestra percepción del mundo: a través del lenguaje, la cultura, la memoria y los filtros que moldean nuestra conciencia. Constandse propone que muchas de nuestras tensiones —internas y externas— provienen de la separación ilusoria entre mente y cuerpo, individuo y comunidad, razón y emoción. Al observar y transformar estos dualismos, la conciencia se expande, permitiéndonos vivir con más claridad, presencia y responsabilidad.
                      </p>
                      <p>
                        La obra también analiza la dimensión social del ser humano: la empresa, la economía, el mercado, la legalidad, la cultura ciudadana y los modelos de desarrollo. Todo ello se comprende como expresiones colectivas de nuestro nivel de conciencia. Cuando actuamos desde el egoísmo y la desconexión, creamos sociedades fragmentadas; cuando actuamos desde la cooperación y la ética, generamos bienestar común. El libro propone una economía con alma, una sociedad con propósito y un desarrollo centrado en la dignidad y la vida.
                      </p>
                      <p>
                        Finalmente, Yo Soy Nosotros es una invitación al camino interior: descubrir la vocación, cultivar una espiritualidad encarnada, trascender el ego y convertir la vida personal en sabiduría compartida. La transformación profunda comienza en lo cotidiano, en los pequeños actos de coherencia, compasión y presencia. Al integrar nuestras dimensiones —cuerpo, alma y espíritu— y al comprender que cada gesto influye en el tejido colectivo, podemos habitar una vida más plena. El mensaje central es claro: al despertar como individuos, despertamos como humanidad. Y en ese despertar compartido, lo mejor aún está por venir.
                      </p>
                    </div>
                  )}

                  {show.id === 'lo-mejor-esta-por-venir' && (
                    <div className="space-y-4 text-white/90 leading-relaxed">
                      <p>
                        La serie completa traza un recorrido que inicia en la comprensión del origen del universo, la vida y la conciencia humana. Desde la física, la biología y la evolución, se construye una visión donde todo está interconectado y donde la experiencia humana forma parte de un proceso mayor de transformación. Este marco inicial no solo invita a entender de dónde venimos, sino a reconocer que nuestra percepción del mundo es limitada por nuestros filtros internos y nuestras historias personales.
                      </p>
                      <p>
                        A partir de esa base, los episodios profundizan en el desarrollo de la conciencia, el papel del pensamiento, la integración de opuestos y la necesidad de construir visiones del mundo más amplias y compasivas. Se exploran temas como el ego, la energía, el lenguaje, los valores y la psicología, mostrando cómo estas dimensiones moldean nuestra forma de vivir. El mensaje es claro: el crecimiento interior es indispensable para enfrentar la complejidad de la vida moderna y para relacionarnos de manera más consciente con nosotros mismos y con los demás.
                      </p>
                      <p>
                        La obra también se adentra en el terreno social, económico y político, cuestionando los modelos de desarrollo, la legalidad, la economía y la organización colectiva. Se plantea que ni la empresa, ni el mercado, ni la sociedad en general pueden funcionar plenamente sin una base ética y una conciencia despierta. Se exploran alternativas reales que integran sostenibilidad, justicia, bienestar y comunidad, recordándonos que el cambio profundo ocurre cuando transformamos nuestras acciones cotidianas y reconectamos con el bien común.
                      </p>
                      <p>
                        Finalmente, el viaje se vuelve profundamente personal: la vocación, la espiritualidad, la trascendencia y la sabiduría adquirida revelan que el sentido de la vida no se encuentra en el éxito externo, sino en la autenticidad, la coherencia y el servicio. Cada episodio invita a mirar adentro, a reconciliar nuestras sombras y a vivir con mayor presencia. El mensaje final de toda la serie es una afirmación luminosa: la evolución no es solo un proceso del universo, sino una tarea humana, y lo mejor —para cada individuo y para la humanidad entera— aún está por venir.
                      </p>
                    </div>
                  )}

                  {show.id === 'ecologia-y-espiritualidad' && (
                    <div className="space-y-4 text-white/90 leading-relaxed">
                      <p>
                        Ecología y Espiritualidad es un recorrido profundo por la raíz humana de la crisis ambiental. Basado en la obra de Marcos Constandse, este podcast expone con claridad que el deterioro ecológico no es únicamente un problema técnico ni científico, sino el reflejo visible de una crisis interior: una crisis de conciencia, de valores y de percepción. A lo largo de diez episodios, el proyecto revela por qué la sostenibilidad depende menos de políticas y tecnologías, y más del estado espiritual, ético y emocional desde el cual actuamos como individuos y como sociedades.
                      </p>
                      <p>
                        El podcast inicia con una premisa fundamental: el problema ecológico es un problema del espíritu. Ninguna solución externa puede sostenerse si la conciencia humana permanece fragmentada, temerosa o dominada por el ego. Esta visión guía cada episodio, mostrando cómo la vida interior —la claridad emocional, la madurez ética, la percepción del límite y la comprensión del otro— determina la forma en que habitamos el planeta.
                      </p>
                      <p>
                        A partir de ahí, cada episodio profundiza en un eje esencial. Se desmontan fanatismos ecológicos y mitologías que distorsionan la acción ambiental, mostrando por qué la culpa y el miedo no generan cambios duraderos. Se explora la interdependencia como experiencia espiritual: la percepción directa de que toda vida está unida y de que cada acción tiene consecuencias en el tejido común que sostiene a la humanidad.
                      </p>
                      <p>
                        El podcast analiza también la dimensión política y social del problema. Constandse afirma que la democracia, la libertad y los derechos humanos son condiciones necesarias para una cultura ecológica madura, porque sólo un ser humano libre puede asumir verdadera responsabilidad por la vida. Asimismo, se examina la relación entre economía, energía y sustentabilidad, revelando por qué las decisiones materiales son siempre decisiones éticas, y cómo toda economía es, en el fondo, administración de energía humana y natural.
                      </p>
                      <p>
                        Otro eje central es la relación entre ciencia, tecnología y conciencia del límite. Se muestra que la técnica por sí sola no puede salvar al mundo si amplifica una conciencia inmadura. La ciencia describe; la tecnología ejecuta; pero solo la conciencia orienta. Sin este equilibrio, incluso los avances más brillantes pueden profundizar el deterioro.
                      </p>
                      <p>
                        El podcast aborda también la dimensión espiritual desde una perspectiva no dogmática. Las religiones, los valores y la profundidad interior se analizan como fuentes de sentido que permiten actuar con coherencia y no desde la reacción. La espiritualidad madura no evade el mundo: lo ordena, lo clarifica y lo humaniza.
                      </p>
                      <p>
                        Hacia el final, dos episodios clave sintetizan la propuesta del proyecto. El primero desarrolla el imperativo ético y la responsabilidad compartida: la comprensión de que "todos formamos un todo" y de que nadie puede salvar el planeta solo. El otro expone la visión de una ecología espiritual, donde la tecnología, la ética, el conocimiento y la sensibilidad convergen en una misma dirección: el cuidado de la vida.
                      </p>
                      <p>
                        El podcast concluye afirmando que la evolución depende de todos nosotros. La crisis ecológica es un llamado urgente a madurar como especie, a integrar nuestra inteligencia técnica con una conciencia más amplia, y a transformar no solo lo que hacemos, sino aquello desde donde lo hacemos. Constandse nos recuerda que proteger la Tierra no es un acto heroico ni una moda cultural: es la consecuencia natural de una conciencia despierta.
                      </p>
                      <p>
                        Ecología y Espiritualidad ofrece, así, una visión profunda y accesible para quienes buscan comprender el origen humano de la crisis ambiental y desean participar —desde la claridad interior— en la construcción de un futuro más equilibrado, más justo y más verdaderamente humano.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Badge className="bg-gold/20 text-gold hover:bg-gold/30 border-0 text-base px-4 py-2">
                    {show.episodes.length} episodios
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-20 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="space-y-6">
              {show.episodes.map((episode) => {
                const suppliedContent = localizedEpisodeContent(episode, language, t);
                const episodeTitle = suppliedContent?.title ?? t(episode.titleKey);
                const episodeDescription = suppliedContent?.description ?? t(episode.descriptionKey);

                return (
                  <motion.div
                    key={episode.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 border border-cream">
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-sm text-navy-light mb-3">
                            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                              {t(episode.categoryKey)}
                            </Badge>
                          </div>

                          <h3 className="font-heading text-2xl font-semibold mb-3 text-navy-dark leading-tight group-hover:text-gold transition-colors">
                            {episodeTitle}
                          </h3>

                          <p className="text-navy-light leading-relaxed mb-6 line-clamp-3">
                            {episodeDescription}
                          </p>

                          <Button
                            className="bg-navy hover:bg-navy-dark text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            onClick={() => router.push(`/medios/${show.id}/${episode.slug}`)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            {t('podcast.moreInfo')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
