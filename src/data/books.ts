// Local cover assets from the supplied design.

const ecologiaEspiritualidadCover = "/design/daba8e942d8f02d4888334c0e1ea21e4.jpg";
const dejaloSerCover = "/design/ed689a07290096a7574e1b91b2c72a4e.jpg";
const loMejorEstaPorVenirCover = "/design/67949123c5d2ce183c6e143227e64975.jpg";
const elArteEmpresarioCover = "/design/93f963ec6c044b62ae621d38fefc05c7.jpg";

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

export const books: Book[] = [
  {
    id: 'yo-soy-nosotros',
    title: 'Yo soy nosotros',
    subtitle: 'Una visión transpersonal del mundo',
    image: '/design/456d7db8a3c876f22040458c07c9eb30.jpg',
    coverImage: '/design/456d7db8a3c876f22040458c07c9eb30.jpg',
    author: 'Marcos Constandse Madrazo',
    year: '2019',
    pages: '284',
    excerpt: 'En Yo soy nosotros, Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano. Esta obra ganó el premio Nacional de Ensayo Filosófico.',
    description: [
      'En Yo soy nosotros, Marcos Constandse nos invita a recorrer un mapa del conocimiento que conecta ciencia, filosofía, psicología, espiritualidad y ecología bajo una visión evolutiva e integradora del ser humano.',
      'Este libro propone una reflexión profunda sobre nuestro papel en el universo, el sentido de la vida y la necesidad urgente de trascender el individualismo para abrazar una consciencia colectiva.',
      'A través de un enfoque transpersonal, el autor plantea que el ser humano no es un ente aislado, sino una expresión del Todo que sólo puede realizarse plenamente en comunión con los demás y con la naturaleza.',
      'La obra desarrolla la filosofía del Humanismo Evolutivo: la evolución desde la consciencia individual hacia la consciencia colectiva como proceso transformador.',
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
    title: 'Déjalo ser',
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
