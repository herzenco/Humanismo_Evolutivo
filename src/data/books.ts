import officialContent from './officialBookContent.json';
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
  prologue: string[];
  summary: string[];
  pdfUrl: string;
}

const originalBooks = [
  {
    id: 'yo-soy-nosotros',
    title: 'Yo soy nosotros',
    author: 'Marcos Constandse Madrazo',
    year: '2019',
    pages: '284',
    keywords: ['Transpersonal', 'Filosofía', 'Consciencia', 'Espiritualidad', 'Ecología', 'Premio Nacional'],
    downloadAvailable: true
  },
  {
    id: 'ecologia-y-espiritualidad',
    title: 'Ecología y espiritualidad',
    author: 'Marcos Constandse Madrazo',
    year: '2020',
    pages: '312',
    keywords: ['Ecología', 'Espiritualidad', 'Ética ambiental', 'Consciencia', 'Sostenibilidad'],
    downloadAvailable: true
  },
  {
    id: 'dejalo-ser',
    title: 'Déjalo ser',
    author: 'Marcos Constandse Madrazo',
    year: '2021',
    pages: '298',
    keywords: ['Novela', 'Identidad', 'Memoria', 'Tecnología', 'Libertad'],
    downloadAvailable: true
  },
  {
    id: 'lo-mejor-esta-por-venir',
    title: 'Y lo mejor aún está por venir',
    author: 'Marcos Constandse Madrazo',
    year: '2023',
    pages: '218',
    keywords: ['Autoayuda', 'Filosofía', 'Evolución personal', 'Consciencia', 'Felicidad'],
    downloadAvailable: true
  },
  {
    id: 'el-arte-de-ser-empresario',
    title: 'El arte de ser empresario',
    author: 'Marcos Constandse Madrazo',
    year: '2022',
    pages: '246',
    keywords: ['Empresarial', 'Ética', 'Liderazgo', 'Evolución', 'Bien común'],
    downloadAvailable: true
  }
];

export const books: Book[] = originalBooks.map(book => ({ ...book, ...officialContent[book.id as keyof typeof officialContent] }));

// Pending manuscripts remain private until their editorial materials are approved.
export const upcomingBooks = [
  { id: 'biografia-mcm', title: 'Biografía MCM' },
  { id: 'los-jardines', title: 'Los jardines de Humanismo Evolutivo Transpersonal' },
  { id: 'introduccion-al-pensamiento-filosofico', title: 'Introducción al Pensamiento Filosófico del Humanismo Evolutivo Transpersonal', questions: true },
  { id: 'introduccion-a-la-filosofia-de-occidente', title: 'Introducción a la Filosofía de Occidente' },
  { id: 'iniciacion-a-la-antropologia', title: 'Iniciación a la Antropología' },
];
