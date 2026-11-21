import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { publicCopy } from '@/components/design/publicCopy';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';
import GardenGallery from './GardenGallery';
import { getGalleryImages } from './gallery-images';
import styles from './gardens.module.css';

const gardens = [
  { id: 'evolucion' as const, title: 'El Jardín de la Evolución', image: '/design/ed9c86fd90f33e7d1ba2e1287ad8bcb6.jpg', alt: 'Mosaicos del Jardín de la Evolución', width: 390, height: 194 },
  { id: 'meditacion' as const, title: 'El Jardín de la Meditación', image: '/design/e4ac4e8708df48eeccff81d2686c6998.jpg', alt: 'Esculturas del Jardín de la Meditación', width: 370, height: 160 },
  { id: 'filosofia' as const, title: 'El Jardín de la Filosofía', image: '/design/26992f25dd3efc30930eb809112915c2.jpg', alt: 'Edificio del Jardín de la Filosofía', width: 390, height: 156 },
];

const copy = {
  es: {
    title: 'Los jardines de Parque Cancún',
    description: 'Conoce los jardines de la Evolución, la Meditación y la Filosofía de Parque Cancún y su relación con el Humanismo Evolutivo Transpersonal.',
    gardenIndex: 'Explora los jardines',
    photographs: 'Galería fotográfica',
    renderings: 'Pabellón · Renders arquitectónicos',
    parkTitle: '¿Qué es Parque Cancún?',
    parkOverview: 'Parque Cancún es un espacio público de acceso gratuito dentro del Área de Protección de Flora y Fauna Manglares de Nichupté. Sus senderos, jardines temáticos y espacios deportivos acercan a la comunidad a la naturaleza, la cultura y la educación ambiental.',
    parkHistory: 'El terreno se usó primero para extraer materiales de construcción y después como basurero municipal. En 2014, el Patronato Parque Cancún y la CONANP acordaron recuperar el sitio y dedicar la mayor parte del terreno a la conservación. El parque abrió oficialmente en abril de 2023.',
    parkHistoryLink: 'Historia de Parque Cancún',
    parkVisitLink: 'Información para tu visita',
  },
  en: {
    title: 'The gardens of Parque Cancún',
    description: 'Discover the Evolution, Meditation and Philosophy gardens of Parque Cancún and their connection to Transpersonal Evolutionary Humanism.',
    gardenIndex: 'Explore the gardens',
    photographs: 'Photo gallery',
    renderings: 'Pavilion · Architectural renderings',
    parkTitle: 'What is Parque Cancún?',
    parkOverview: 'Parque Cancún is a public park with free admission inside the Manglares de Nichupté Flora and Fauna Protection Area. Its trails, themed gardens, and sports facilities give the community space to enjoy nature, culture, and environmental education.',
    parkHistory: 'The land was first used to extract construction material and later served as the municipal dump. In 2014, the Parque Cancún board and Mexico’s National Commission of Protected Natural Areas agreed to restore the site and set aside most of the land for conservation. The park officially opened in April 2023.',
    parkHistoryLink: 'History of Parque Cancún',
    parkVisitLink: 'Visitor information',
  },
};

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ ...copy[lang], path: '/jardines', language: lang, image: gardens[0].image });
}

export default async function GardensPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const text = copy[lang];
  const galleryImages = getGalleryImages(lang);
  const tx = (value: string) => lang === 'en' ? publicCopy[value] ?? value : value;
  const descriptions = {
    evolucion: <ul><li>
      {tx("Los ")}
      <strong>
      {tx("quince mosaicos")}
      </strong>
      {tx(" del jardín de la evolución simbolizan los procesos más importantes, científicamente comprobados, del proceso evolutivo del universo, referido a los tiempos en que se llevaron a cabo.")}
      </li>
      <li>
      {tx("El Homo sapiens surgió hace unos 300,000 años. Compartimos un origen evolutivo y una dignidad común; las oportunidades de desarrollar nuestras capacidades dependen también de nuestras condiciones de vida.")}
      </li>
      <li>
      {tx("Tenemos el ")}
      <strong>
      {tx("mismo origen")}
      </strong>
      {tx(": en las partículas emitidas por el Big Bang.")}
      </li>
      <li>
      {tx("Tenemos la ")}
      <strong>
      {tx("misma ancestra")}
      </strong>
      {tx(", que fue la primera mujer Homo Sapiens Sapiens.")}
      </li>
      <li>
      {tx("Son las diferentes condiciones socioeconómicas y ambientales lo que marca nuestras diversas “visiones del mundo” y capacidades. Por lo tanto, el esfuerzo humano se debe canalizar hacia la mejora de las condiciones de inicio y desarrollo de nuestra conciencia y nuestras capacidades, para lograr una mayor igualdad y aplicarlas en nuestro ")}
      <strong>
      {tx("trabajo")}
      </strong>
      {tx(" y participación social.")}
      </li>
      <li>
      {tx("Es el ")}
      <strong>
      {tx("trabajo")}
      </strong>
      {tx(" (como en la evolución del universo trabajan las partículas del Big Bang para crear nuestra realidad actual), hecho con la ")}
      <strong>
      {tx("información correcta")}
      </strong>
      {tx(", lo que conecta al ser humano con las fuerzas evolutivas del universo, y si es útil y provechoso para los demás, conecta también con todas las religiones vigentes en el universo humano.")}
      </li></ul>,
    meditacion: <ul><li>
      {tx("Explica los ritos, visión y principios de 6 de las ")}
      <strong>
      {tx("religiones más importantes")}
      </strong>
      {tx(" en el mundo.")}
      </li>
      <li>
      {tx("Demuestra que TODAS las religiones tienen un objetivo común: el reconocer al otro como igual a mí, y de ahí surge el ")}
      <strong>
      {tx("IMPERATIVO ÉTICO")}
      </strong>
      {tx(" que dice que “todos tenemos dignidad absoluta y debemos respetarnos y amarnos”.")}
      </li>
      <li>
      {tx("A partir de ahí es que se llega a la misma conclusión evolutiva: por amor o solidaridad hacia “los otros” (“amaos los unos a los otros”), debemos hacer valer los derechos humanos, como el derecho a la vida, la salud, la vivienda, la educación, la alimentación, el trabajo, la recreación, etc.")}
      </li></ul>,
    filosofia: <p>{tx("Este jardín acompaña a quienes deciden ")}
      <strong>
      {tx("profundizar")}
      </strong>
      {tx(" en el ")}
      <strong>
      {tx("conocimiento")}
      </strong>
      {tx(", tanto de la ciencia (antropología) y la filosofía, para cimentar más profundamente su conciencia y con el conocimiento básico abordar la teoría de ")}
      <strong>
      {tx("“Humanismo Evolutivo”")}
      </strong>
      {tx(". Este camino busca ampliar la conciencia y acercarnos a la felicidad, la paz interior y la autorrealización.")}</p>
  };

  return <PageWrapper>
    <section className={`design-media-hero ${styles.hero}`}>
      <div className="design-content-width">
        <h1>{text.title}</h1>
        <p>{text.description}</p>
      </div>
    </section>

    <section className={`design-content-width ${styles.parkSection}`} aria-labelledby="parque-cancun">
      <div className="design-section-heading"><h2 id="parque-cancun">{text.parkTitle}</h2></div>
      <div className={styles.parkStory}>
        <p>{text.parkOverview}</p>
        <p>{text.parkHistory}</p>
      </div>
      <div className={styles.parkLinks}>
        <a className="design-text-link" href="https://www.parquecancun.org/nosotros/">{text.parkHistoryLink}<ArrowUpRight size={17} aria-hidden="true" /></a>
        <a className="design-text-link" href="https://www.parquecancun.org/preguntas-fecuentes/">{text.parkVisitLink}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </section>

    <section className={`design-content-width ${styles.gallerySection}`} aria-labelledby="galeria">
      <div className="design-section-heading"><h2 id="galeria">{text.gardenIndex}</h2></div>
      <ul className={styles.gallery}>
        {gardens.map(garden => <li key={garden.id}>
          <a href={`#${garden.id}`} className={styles.galleryLink}>
            <figure>
              <Image src={garden.image} alt={tx(garden.alt)} width={garden.width} height={garden.height} sizes="(max-width: 700px) 100vw, 33vw" />
              <figcaption>{tx(garden.title)}<ArrowRight size={18} aria-hidden="true" /></figcaption>
            </figure>
          </a>
        </li>)}
      </ul>
    </section>

    <div className={`design-content-width ${styles.reading}`}>
      {gardens.map(garden => <section id={garden.id} key={garden.id} aria-labelledby={`jardin-${garden.id}`}>
        <h2 id={`jardin-${garden.id}`}>{tx(garden.title)}</h2>
        {descriptions[garden.id]}
        <GardenGallery
          images={galleryImages[garden.id]}
          title={garden.id === 'filosofia' ? text.renderings : text.photographs}
          lang={lang}
        />
      </section>)}
    </div>
  </PageWrapper>;
}
