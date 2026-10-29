import type { Language } from '@/lib/site';
type Download = { file: string; title: string; language: Language };
const catalog: Record<string, Record<Language, Download>> = {
  'yo-soy-nosotros': {
    es: { file: 'Yo_Soy_Nosotros_Resumen.pdf', title: 'Yo soy nosotros', language: 'es' },
    en: { file: 'I_Am_US_Summary.pdf', title: 'I Am Us', language: 'en' },
  },
  'ecologia-y-espiritualidad': {
    es: { file: 'Ecologia_y_Espiritualidad.pdf', title: 'Ecología y espiritualidad', language: 'es' },
    en: { file: 'Ecology_and_Spirituality.pdf', title: 'Ecology and Spirituality', language: 'en' },
  },
  'dejalo-ser': {
    es: { file: 'DejaloSer_Resumen.pdf', title: 'Déjalo ser', language: 'es' },
    en: { file: 'Let_It_Be_Summary.pdf', title: 'Let It Be', language: 'en' },
  },
  'el-arte-de-ser-empresario': {
    es: { file: 'El_arte_de_ser_empresario_Resumen.pdf', title: 'El arte de ser empresario', language: 'es' },
    en: { file: 'The_art_of_being_an_entrepreneur_Summary.pdf', title: 'The Art of Being an Entrepreneur', language: 'en' },
  },
  'lo-mejor-esta-por-venir': {
    es: { file: 'Lo_mejor_esta_por_venir.pdf', title: 'Y lo mejor aún está por venir', language: 'es' },
    en: { file: 'Lo_mejor_esta_por_venir.pdf', title: 'The Best Is Yet to Come (Spanish edition)', language: 'es' },
  },
};
export function getBookDownload(bookId: string, language: Language) {
  const download = catalog[bookId]?.[language];
  if (!download) throw new Error('Book download unavailable');
  return { ...download, url: `/books/${download.file}` };
}
