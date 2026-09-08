// Portadas cargadas desde Lovable Cloud Storage
const STORAGE_URL = 'https://qlqkdininewormskpnya.supabase.co/storage/v1/object/public/admin-uploads';

const ecologiaEspiritualidadCover = `${STORAGE_URL}/ecologia-y-espiritualidad-cover.jpg`;
const dejaloSerCover = `${STORAGE_URL}/dejalo-ser-cover.jpeg`;
const loMejorEstaPorVenirCover = `${STORAGE_URL}/lo-mejor-esta-por-venir-cover.jpg`;
const elArteEmpresarioCover = `${STORAGE_URL}/el-arte-de-ser-empresario-cover.png`;

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  coverImage: string;
  author: string;
  year: string;
  pages: string;
  excerpt: string;
  description: string[];
  keywords: string[];
  downloadAvailable: boolean;
}

type Translator = (key: string) => string;

const bookTranslationKeys: Record<string, string> = {
  'yo-soy-nosotros': 'book.yosoynosotros',
  'ecologia-y-espiritualidad': 'book.ecologia',
  'dejalo-ser': 'book.dejaloser',
  'lo-mejor-esta-por-venir': 'book.lomejor',
  'el-arte-de-ser-empresario': 'book.elarte',
};

const bookKeywordKeys: Record<string, string[]> = {
  'yo-soy-nosotros': ['keyword.transpersonal', 'keyword.philosophy', 'keyword.consciousness', 'keyword.spirituality', 'keyword.ecology', 'keyword.national.prize'],
  'ecologia-y-espiritualidad': ['keyword.ecology', 'keyword.spirituality', 'keyword.environmental.ethics', 'keyword.consciousness', 'keyword.sustainability'],
  'dejalo-ser': ['keyword.novel', 'keyword.identity', 'keyword.memory', 'keyword.technology', 'keyword.freedom'],
  'lo-mejor-esta-por-venir': ['keyword.self.help', 'keyword.philosophy', 'keyword.personal.evolution', 'keyword.consciousness', 'keyword.happiness'],
  'el-arte-de-ser-empresario': ['keyword.business', 'keyword.ethics', 'keyword.leadership', 'keyword.evolution', 'keyword.common.good'],
};

export const localizeBook = (book: Book, t: Translator): Book => {
  const prefix = bookTranslationKeys[book.id];
  if (!prefix) return book;

  return {
    ...book,
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    excerpt: t(`${prefix}.excerpt`),
    description: book.description.map((_, index) => t(`${prefix}.desc${index + 1}`)),
    keywords: (bookKeywordKeys[book.id] || []).map(t),
  };
};

export const books: Book[] = [
  {
    id: 'yo-soy-nosotros',
    title: 'Yo soy nosotros',
    subtitle: 'Una visión transpersonal del mundo',
    image: '/lovable-uploads/0d55a7a0-122e-48c1-831c-66a04590c495.png',
    coverImage: '/lovable-uploads/0d55a7a0-122e-48c1-831c-66a04590c495.png',
    author: 'Marcos Constandse Madrazo',
    year: '2019',
    pages: '284',
    excerpt: 'En Yo soy nosotros, Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano. Esta obra ganó el premio Nacional de Ensayo Filosófico.',
    description: [
      'En Yo soy nosotros, Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano.',
      'Este libro propone una reflexión profunda sobre nuestro papel en el universo, el sentido de la vida y la necesidad urgente de trascender el individualismo para abrazar una consciencia colectiva.',
      'A través de un enfoque transpersonal, el autor plantea que el ser humano no es un ente aislado, sino una expresión del Todo que sólo puede realizarse plenamente en comunión con los demás y con la naturaleza.',
      'La obra desarrolla la filosofía del Humanismo Evolutivo Transpersonal: la evolución desde la consciencia individual hacia la consciencia colectiva como proceso transformador.',
      'Esta obra es tanto una guía espiritual como una propuesta ética para vivir con plenitud en un mundo interconectado.'
    ],
    keywords: ['Transpersonal', 'Filosofía', 'Consciencia', 'Espiritualidad', 'Ecología', 'Premio Nacional'],
    downloadAvailable: true
  },
  {
    id: 'ecologia-y-espiritualidad',
    title: 'Ecología y espiritualidad',
    subtitle: 'Una mirada integral al cuidado del planeta y del alma',
    image: ecologiaEspiritualidadCover,
    coverImage: ecologiaEspiritualidadCover,
    author: 'Marcos Constandse Madrazo',
    year: '2020',
    pages: '312',
    excerpt: 'En Ecología y espiritualidad, Marcos Constandse entrelaza ciencia, consciencia y ética para ofrecer una visión profundamente integradora entre el mundo natural y el del ser humano.',
    description: [
      'En Ecología y espiritualidad, Marcos Constandse entrelaza ciencia, consciencia y ética para ofrecer una visión profundamente integradora entre el mundo natural y el del ser humano.',
      'A través de un análisis lúcido de los desafíos ambientales contemporáneos, el autor nos invita a trascender el egoísmo técnico y reconocer que la crisis ecológica es también una crisis espiritual.',
      'Con un llamado ético al respeto del otro —y de uno mismo— esta obra propone que solo una transformación interior, basada en la unidad y compasión, puede conducirnos a una acción colectiva que salve nuestro entorno.',
      'Este libro es una guía para quienes entienden que cuidar la Tierra comienza con una revolución en la consciencia.'
    ],
    keywords: ['Ecología', 'Espiritualidad', 'Ética ambiental', 'Consciencia', 'Sostenibilidad'],
    downloadAvailable: true
  },
  {
    id: 'dejalo-ser',
    title: '¡Dejalo Ser!',
    subtitle: 'Una novela sobre identidad, memoria y libertad',
    image: dejaloSerCover,
    coverImage: dejaloSerCover,
    author: 'Marcos Constandse Madrazo',
    year: '2021',
    pages: '298',
    excerpt: 'Déjalo ser es una novela que entrelaza memoria, identidad y tecnología en un relato íntimo y visionario. Marcos Constandse nos conduce a un futuro posible, donde la acumulación de datos personales confronta a sus protagonistas con sus raíces más profundas y sus decisiones más humanas.',
    description: [
      'Déjalo ser es una novela que entrelaza memoria, identidad y tecnología en un relato íntimo y visionario. Marcos Constandse nos conduce a un futuro posible, donde la acumulación de datos personales confronta a sus protagonistas con sus raíces más profundas y sus decisiones más humanas.',
      'A través de una narrativa envolvente, la novela explora temas universales como el libre albedrío, la autenticidad y la búsqueda de sentido en un mundo hiperconectado.',
      'Esta obra invita a reflexionar sobre el equilibrio entre control y libertad, entre conocimiento y sabiduría, entre ser quien creemos que somos y quien realmente podemos llegar a ser.',
      'Una historia que desafía nuestras percepciones sobre la identidad y nos recuerda la importancia de mantener nuestra humanidad en un mundo tecnológico.'
    ],
    keywords: ['Novela', 'Identidad', 'Memoria', 'Tecnología', 'Libertad'],
    downloadAvailable: true
  },
  {
    id: 'lo-mejor-esta-por-venir',
    title: 'Y lo mejor aún está por venir',
    subtitle: 'Un ensayo filosófico de autoayuda',
    image: loMejorEstaPorVenirCover,
    coverImage: loMejorEstaPorVenirCover,
    author: 'Marcos Constandse Madrazo',
    year: '2023',
    pages: '218',
    excerpt: 'En esta obra íntima y lúcida, Marcos Constandse entrelaza filosofía, experiencia personal y reflexión social para ofrecernos una guía hacia una vida con mayor consciencia, bienestar y sentido.',
    description: [
      'En esta obra íntima y lúcida, Marcos Constandse entrelaza filosofía, experiencia personal y reflexión social para ofrecernos una guía hacia una vida con mayor consciencia, bienestar y sentido.',
      'Y lo mejor aún está por venir parte de una premisa poderosa: la evolución no es un destino, sino un proceso continuo que cada ser humano puede elegir recorrer.',
      'A través de comparaciones entre ideología, sistemas económicos y espiritualidad, nos invita a tomar postura, a reconocer nuestro poder de decisión y a construir una ruta propia hacia la felicidad.',
      'Este libro es una llamada a vivir con autenticidad, a encontrar claridad en medio de la complejidad moderna y a confiar en que lo más valioso aún está por delante de nosotros.'
    ],
    keywords: ['Autoayuda', 'Filosofía', 'Evolución personal', 'Consciencia', 'Felicidad'],
    downloadAvailable: true
  },
  {
    id: 'el-arte-de-ser-empresario',
    title: 'El arte de ser empresario',
    subtitle: 'Una mirada ética y evolutiva al quehacer empresarial',
    image: elArteEmpresarioCover,
    coverImage: elArteEmpresarioCover,
    author: 'Marcos Constandse Madrazo',
    year: '2022',
    pages: '246',
    excerpt: 'En esta obra, Marcos Constandse redefine la figura del empresario desde una perspectiva ética, filosófica y evolutiva. Más que un manual, El arte de ser empresario es una invitación a vivir el emprendimiento como un noble servicio del bien común.',
    description: [
      'En esta obra, Marcos Constandse redefine la figura del empresario desde una perspectiva ética, filosófica y evolutiva. Más que un manual, El arte de ser empresario es una invitación a vivir el emprendimiento como un noble servicio del bien común.',
      'Con reflexiones personales y análisis sobre el contexto, la consciencia y valores, el autor comparte su manera de ser, de hacer y de generar empresas con sentido, coherencia y compromiso en un mundo que exige profundidad y visión integradora.',
      'Este libro desafía la visión convencional del empresario y propone un modelo de liderazgo basado en la ética, la sostenibilidad y el servicio a la comunidad.',
      'A través de ejemplos prácticos y reflexiones filosóficas, Constandse establece un puente entre el mundo de los negocios y la búsqueda de sentido humano.'
    ],
    keywords: ['Empresarial', 'Ética', 'Liderazgo', 'Evolución', 'Bien común'],
    downloadAvailable: true
  }
];
