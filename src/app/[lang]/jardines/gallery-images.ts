const park = [
  [90, 2400, 488, 'Panorámica del muro de mosaicos', 'Panorama of the mosaic wall'],
  [88, 1800, 900, 'Sendero junto a los mosaicos', 'Path along the mosaics'],
  [89, 1800, 436, 'Los mosaicos desde el jardín', 'Mosaics viewed from the garden'],
  [80, 1201, 1800, 'La escala del tiempo', 'The scale of time'],
  [77, 1292, 1800, 'Formación de la Tierra', 'Formation of Earth'],
  [78, 1292, 1800, 'Vida vegetal y fotosíntesis', 'Plant life and photosynthesis'],
  [79, 1201, 1800, 'El origen de la vida animal', 'Origins of animal life'],
  [81, 1800, 900, 'Evolución del ser humano', 'Human evolution'],
  [82, 1200, 1800, 'La evolución de la conciencia', 'The evolution of consciousness'],
  [83, 1800, 1800, 'Cronología de culturas y tecnologías', 'Timeline of cultures and technologies'],
  [84, 1201, 1800, 'El intercambio de energía', 'The exchange of energy'],
  [85, 1200, 1800, 'Energía atómica', 'Atomic energy'],
  [86, 1201, 1800, 'El ser humano y el universo', 'Humankind and the universe'],
  [87, 1201, 1800, 'Inteligencia y tecnología', 'Intelligence and technology'],
  [96, 1800, 900, 'Recorrido entre los arcos', 'Path through the arches'],
  [94, 1800, 780, 'Mural «Yo soy nosotros»', '“Yo soy nosotros” mural'],
  [99, 1800, 900, 'Escultura espejada junto al globo', 'Mirrored sculpture beside the globe'],
  [91, 1438, 1800, 'Escultura del hinduismo', 'Hinduism sculpture'],
  [92, 1502, 1800, 'Figura de Buda bajo el arco', 'Buddha figure beneath the arch'],
  [93, 1440, 1800, 'Escultura de Confucio', 'Sculpture of Confucius'],
  [95, 1560, 1800, 'Media luna y estrella del islam', 'Islamic crescent and star'],
  [97, 1515, 1800, 'Estrella de David', 'Star of David'],
  [98, 1485, 1800, 'Otra vista de la figura de Buda', 'Another view of the Buddha figure'],
] as const;

const pavilion = [
  [1, 'Vista aérea del pabellón', 'Aerial view of the pavilion'],
  [12, 'Vista cenital del conjunto', 'Overhead view of the site'],
  [2, 'Exterior al atardecer', 'Exterior at sunset'],
  [4, 'Terraza y fachadas', 'Terrace and façades'],
  [6, 'Interior del aula', 'Classroom interior'],
  [11, 'Fuente con esculturas', 'Fountain with sculptures'],
  [7, 'Vista al jardín desde el pórtico', 'Garden view from the porch'],
  [10, 'Corredor cubierto hacia el jardín', 'Covered walkway toward the garden'],
  [3, 'Fachada lateral', 'Side façade'],
  [5, 'Acceso junto al sendero', 'Entrance beside the path'],
  [8, 'Fachada con columnas de madera', 'Façade with wooden columns'],
  [9, 'Esquina de la terraza', 'Corner of the terrace'],
] as const;

export function getGalleryImages(lang: 'es' | 'en') {
  const parkImages = park.map(([number, width, height, es, en]) => ({
    width,
    height,
    src: number === 90 ? '/design/jardin-evolucion-panorama.webp' : `/design/jardines/parque-${number}.webp`,
    caption: lang === 'es' ? es : en,
  }));

  return {
    evolucion: parkImages.slice(0, 14),
    meditacion: parkImages.slice(14),
    filosofia: pavilion.map(([number, es, en]) => ({
      width: 1672,
      height: 941,
      src: number === 1 ? '/design/clases-pabellon.webp' : `/design/jardines/pabellon-${String(number).padStart(2, '0')}.webp`,
      caption: lang === 'es' ? es : en,
    })),
  };
}
