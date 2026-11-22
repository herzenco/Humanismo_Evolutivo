type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  es: string;
  en: string;
};

const evolucion: GalleryPhoto[] = [
  { src: '/design/jardin-evolucion-panorama.webp', width: 2400, height: 488, es: 'Panorámica del muro de mosaicos', en: 'Panorama of the mosaic wall' },
  { src: '/design/jardines/parque-88.webp', width: 1800, height: 900, es: 'Sendero junto a los mosaicos', en: 'Path along the mosaics' },
  { src: '/design/jardines/evolucion-mosaico-01.webp', width: 1800, height: 1344, es: 'Realidad', en: 'Reality' },
  { src: '/design/jardines/evolucion-mosaico-02.webp', width: 1200, height: 1800, es: 'El origen del universo', en: 'The origin of the universe' },
  { src: '/design/jardines/evolucion-mosaico-03.webp', width: 1235, height: 1800, es: 'Creación del átomo', en: 'Creation of the atom' },
  { src: '/design/jardines/evolucion-mosaico-04.webp', width: 1284, height: 1800, es: 'La tabla periódica', en: 'The periodic table' },
  { src: '/design/jardines/evolucion-mosaico-05.webp', width: 1292, height: 1800, es: 'Formación de la Tierra', en: 'Formation of Earth' },
  { src: '/design/jardines/evolucion-mosaico-06.webp', width: 1292, height: 1800, es: 'Creación de la vida vegetal', en: 'Creation of plant life' },
  { src: '/design/jardines/evolucion-mosaico-07.webp', width: 1201, height: 1800, es: 'La escala del tiempo', en: 'The scale of time' },
  { src: '/design/jardines/evolucion-mosaico-08.webp', width: 1201, height: 1800, es: 'Creación de la vida animal', en: 'Creation of animal life' },
  { src: '/design/jardines/evolucion-mosaico-09.webp', width: 1800, height: 900, es: 'Evolución del ser humano', en: 'Human evolution' },
  { src: '/design/jardines/evolucion-mosaico-10.webp', width: 1200, height: 1800, es: 'Evolución de la conciencia', en: 'The evolution of consciousness' },
  { src: '/design/jardines/evolucion-mosaico-11.webp', width: 1800, height: 1800, es: 'Cronología de culturas y tecnologías', en: 'Timeline of cultures and technologies' },
  { src: '/design/jardines/evolucion-mosaico-12.webp', width: 1201, height: 1800, es: 'El intercambio de energía', en: 'The exchange of energy' },
  { src: '/design/jardines/evolucion-mosaico-13.webp', width: 1200, height: 1800, es: 'Energía atómica', en: 'Atomic energy' },
  { src: '/design/jardines/evolucion-mosaico-14.webp', width: 1201, height: 1800, es: 'El ser humano y el universo', en: 'Humankind and the universe' },
  { src: '/design/jardines/evolucion-mosaico-15.webp', width: 1208, height: 1800, es: 'Inteligencia y tecnología', en: 'Intelligence and technology' },
];

const meditacion: GalleryPhoto[] = [
  { src: '/design/jardines/parque-96.webp', width: 1800, height: 900, es: 'Recorrido entre los arcos', en: 'Path through the arches' },
  { src: '/design/jardines/parque-94.webp', width: 1800, height: 780, es: 'Mural «Yo soy nosotros»', en: '“Yo soy nosotros” mural' },
  { src: '/design/jardines/parque-99.webp', width: 1800, height: 900, es: 'Escultura espejada junto al globo', en: 'Mirrored sculpture beside the globe' },
  { src: '/design/jardines/parque-91.webp', width: 1438, height: 1800, es: 'Escultura del hinduismo', en: 'Hinduism sculpture' },
  { src: '/design/jardines/parque-92.webp', width: 1502, height: 1800, es: 'Figura de Buda bajo el arco', en: 'Buddha figure beneath the arch' },
  { src: '/design/jardines/parque-93.webp', width: 1440, height: 1800, es: 'Escultura de Confucio', en: 'Sculpture of Confucius' },
  { src: '/design/jardines/meditacion-04-cristianismo.webp', width: 1575, height: 1800, es: 'Escultura del cristianismo', en: 'Christianity sculpture' },
  { src: '/design/jardines/parque-95.webp', width: 1560, height: 1800, es: 'Media luna y estrella del islam', en: 'Islamic crescent and star' },
  { src: '/design/jardines/meditacion-06-estrella-de-david.webp', width: 1468, height: 1800, es: 'Estrella de David', en: 'Star of David' },
];

const filosofia: GalleryPhoto[] = [
  { src: '/design/clases-pabellon.webp', width: 1672, height: 941, es: 'Vista aérea del pabellón', en: 'Aerial view of the pavilion' },
  { src: '/design/jardines/pabellon-12.webp', width: 1672, height: 941, es: 'Vista cenital del conjunto', en: 'Overhead view of the site' },
  { src: '/design/jardines/pabellon-02.webp', width: 1672, height: 941, es: 'Exterior al atardecer', en: 'Exterior at sunset' },
  { src: '/design/jardines/pabellon-04.webp', width: 1672, height: 941, es: 'Terraza y fachadas', en: 'Terrace and façades' },
  { src: '/design/jardines/pabellon-06.webp', width: 1672, height: 941, es: 'Interior del aula', en: 'Classroom interior' },
  { src: '/design/jardines/pabellon-11.webp', width: 1672, height: 941, es: 'Fuente con esculturas', en: 'Fountain with sculptures' },
  { src: '/design/jardines/pabellon-07.webp', width: 1672, height: 941, es: 'Vista al jardín desde el pórtico', en: 'Garden view from the porch' },
  { src: '/design/jardines/pabellon-10.webp', width: 1672, height: 941, es: 'Corredor cubierto hacia el jardín', en: 'Covered walkway toward the garden' },
  { src: '/design/jardines/pabellon-03.webp', width: 1672, height: 941, es: 'Fachada lateral', en: 'Side façade' },
  { src: '/design/jardines/pabellon-05.webp', width: 1672, height: 941, es: 'Acceso junto al sendero', en: 'Entrance beside the path' },
  { src: '/design/jardines/pabellon-08.webp', width: 1672, height: 941, es: 'Fachada con columnas de madera', en: 'Façade with wooden columns' },
  { src: '/design/jardines/pabellon-09.webp', width: 1672, height: 941, es: 'Esquina de la terraza', en: 'Corner of the terrace' },
];

function localize(photos: GalleryPhoto[], lang: 'es' | 'en') {
  return photos.map(({ src, width, height, es, en }) => ({
    src,
    width,
    height,
    caption: lang === 'es' ? es : en,
  }));
}

export function getGalleryImages(lang: 'es' | 'en') {
  return {
    evolucion: localize(evolucion, lang),
    meditacion: localize(meditacion, lang),
    filosofia: localize(filosofia, lang),
  };
}
