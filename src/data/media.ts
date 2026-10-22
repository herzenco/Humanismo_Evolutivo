export interface PodcastEpisode {
  id: number;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  duration: string;
  date: string;
  categoryKey: string;
  audioUrl: string;
}

export interface PodcastSeries {
  id: string;
  titleKey: string;
  descriptionKey: string;
  coverImage: string;
  episodes: PodcastEpisode[];
}

export interface Podcast extends PodcastEpisode {
  imageUrl: string;
  seriesId: string;
}

export interface Video {
  id: number;
  titleKey: string;
  descriptionKey: string;
  duration: string;
  date: string;
  categoryKey: string;
  videoUrl: string;
  imageUrl: string;
}

export const podcastSeries: PodcastSeries[] = [
  {
    id: 'yo-soy-nosotros',
    titleKey: 'podcast.series.ysn.title',
    descriptionKey: 'podcast.series.ysn.description',
    coverImage: '/lovable-uploads/0d55a7a0-122e-48c1-831c-66a04590c495.webp',
    episodes: [
      {
        id: 1,
        slug: "introduccion-yo-soy-nosotros",
        titleKey: "podcast.ysn.ep1.title",
        descriptionKey: "podcast.ysn.ep1.description",
        duration: "38 min",
        date: "2024-01-08",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/1q8kYGO0nWRZYXYN0ripnw?si=MDvocllTTk-6AAsZaI_Eug"
      },
      {
        id: 50,
        slug: "el-universo",
        titleKey: "podcast.ysn.universe.title",
        descriptionKey: "podcast.ysn.universe.description",
        duration: "42 min",
        date: "2024-01-15",
        categoryKey: "podcast.category.science",
        audioUrl: "https://open.spotify.com/episode/6U3bkNubfNTnaRcw7qNRCH"
      },
      {
        id: 2,
        slug: "la-conciencia-como-fundamento",
        titleKey: "podcast.ysn.ep2.title",
        descriptionKey: "podcast.ysn.ep2.description",
        duration: "42 min",
        date: "2024-01-15",
        categoryKey: "podcast.category.science",
        audioUrl: "https://open.spotify.com/episode/6p9pooh9S2LgyKuAXKJwQQ?si=Vkg3MhiuRF-yp7JDLZIZQA"
      },
      {
        id: 3,
        slug: "ciencia-y-espiritualidad",
        titleKey: "podcast.ysn.ep3.title",
        descriptionKey: "podcast.ysn.ep3.description",
        duration: "45 min",
        date: "2024-01-22",
        categoryKey: "podcast.category.science",
        audioUrl: "https://open.spotify.com/episode/77qiNoipTZTiA4WjIGuIlm?si=F4NqFKRIQ26lZfSzlL9ksw"
      },
      {
        id: 4,
        slug: "el-ser-y-el-yo",
        titleKey: "podcast.ysn.ep4.title",
        descriptionKey: "podcast.ysn.ep4.description",
        duration: "40 min",
        date: "2024-01-29",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/7EUoCNco245mrxBOZ5P7sH?si=fIRfeYc5TNCiRSXJpZnhHQ"
      },
      {
        id: 5,
        slug: "interdependencia-universal",
        titleKey: "podcast.ysn.ep5.title",
        descriptionKey: "podcast.ysn.ep5.description",
        duration: "46 min",
        date: "2024-02-05",
        categoryKey: "podcast.category.ecology",
        audioUrl: "https://open.spotify.com/episode/1PgKSqy3duXn7W3Jk4uyw9?si=fCau2JnhSri6e5yWd3TBUw"
      },
      {
        id: 6,
        slug: "emociones-y-transformacion",
        titleKey: "podcast.ysn.ep6.title",
        descriptionKey: "podcast.ysn.ep6.description",
        duration: "50 min",
        date: "2024-02-12",
        categoryKey: "podcast.category.psychology",
        audioUrl: "https://open.spotify.com/episode/7fjrHWsyadxMLvBHQcBWQ9?si=0drvSF9WS3G5Xyd8pHuklg"
      },
      {
        id: 7,
        slug: "libertad-y-responsabilidad",
        titleKey: "podcast.ysn.ep7.title",
        descriptionKey: "podcast.ysn.ep7.description",
        duration: "48 min",
        date: "2024-02-19",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/2cocv980WUVs0N37Fr4IO4?si=6Pr1y8GRTdGCcu-t-r-JBg"
      },
      {
        id: 8,
        slug: "amor-y-servicio",
        titleKey: "podcast.ysn.ep8.title",
        descriptionKey: "podcast.ysn.ep8.description",
        duration: "52 min",
        date: "2024-02-26",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/7jw5RkSXE2t8KHIcPpPN6c?si=-KF9m3ehQUGZfTuyWexYCw"
      },
      {
        id: 9,
        slug: "la-evolucion-de-la-conciencia",
        titleKey: "podcast.ysn.ep9.title",
        descriptionKey: "podcast.ysn.ep9.description",
        duration: "46 min",
        date: "2024-03-04",
        categoryKey: "podcast.category.consciousness",
        audioUrl: "https://open.spotify.com/episode/5UqH5bAZ9Z6povbYwbCznn?si=b4cby20AT0y8L-YJfItwgw"
      },
      {
        id: 10,
        slug: "etica-transpersonal",
        titleKey: "podcast.ysn.ep10.title",
        descriptionKey: "podcast.ysn.ep10.description",
        duration: "43 min",
        date: "2024-03-11",
        categoryKey: "podcast.category.ethics",
        audioUrl: "https://open.spotify.com/episode/6qF2VI4FVWJ2uQAUkNBJit?si=dmFdzHUVTeqWNTFOsab3QA"
      },
      {
        id: 11,
        slug: "la-unidad-en-la-diversidad",
        titleKey: "podcast.ysn.ep11.title",
        descriptionKey: "podcast.ysn.ep11.description",
        duration: "48 min",
        date: "2024-03-18",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/0JjinUa89xy0vNvTWN9v1s?si=9Ceh1ZmoQOOUqBUrMml5DQ"
      },
      {
        id: 12,
        slug: "hacia-una-humanidad-consciente",
        titleKey: "podcast.ysn.ep12.title",
        descriptionKey: "podcast.ysn.ep12.description",
        duration: "50 min",
        date: "2024-03-25",
        categoryKey: "podcast.category.consciousness",
        audioUrl: "https://open.spotify.com/episode/0f8beduHoABSCMFf6N5ygL?si=Jx1vZ2MMRvagEUtQjtnc3Q"
      }
    ]
  },
  {
    id: 'lo-mejor-esta-por-venir',
    titleKey: 'podcast.series.ylmepv.title',
    descriptionKey: 'podcast.series.ylmepv.description',
    coverImage: 'https://qlqkdininewormskpnya.supabase.co/storage/v1/object/public/admin-uploads/lo-mejor-esta-por-venir-cover.jpg',
    episodes: [
      {
        id: 13,
        slug: "introduccion-lo-mejor-esta-por-venir",
        titleKey: "podcast.ylmepv.ep1.title",
        descriptionKey: "podcast.ylmepv.ep1.description",
        duration: "45 min",
        date: "2024-04-01",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/6QuY9iCgWjDzgzKmAz0oRk"
      },
      {
        id: 14,
        slug: "el-poder-de-la-vision",
        titleKey: "podcast.ylmepv.ep2.title",
        descriptionKey: "podcast.ylmepv.ep2.description",
        duration: "48 min",
        date: "2024-04-08",
        categoryKey: "podcast.category.science",
        audioUrl: "https://open.spotify.com/episode/1pY91xvft20xp8SenycUF9"
      },
      {
        id: 15,
        slug: "construyendo-el-futuro",
        titleKey: "podcast.ylmepv.ep3.title",
        descriptionKey: "podcast.ylmepv.ep3.description",
        duration: "46 min",
        date: "2024-04-15",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/2XDdE1asvIgAvBIctfrXWx"
      },
      {
        id: 16,
        slug: "la-esperanza-como-motor",
        titleKey: "podcast.ylmepv.ep4.title",
        descriptionKey: "podcast.ylmepv.ep4.description",
        duration: "50 min",
        date: "2024-04-22",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/33pfgKph0UQQ4PzQOptpWG"
      },
      {
        id: 17,
        slug: "resiliencia-y-adaptacion",
        titleKey: "podcast.ylmepv.ep5.title",
        descriptionKey: "podcast.ylmepv.ep5.description",
        duration: "47 min",
        date: "2024-04-29",
        categoryKey: "podcast.category.psychology",
        audioUrl: "https://open.spotify.com/episode/2Pet4LM9L7pBHNOY14iSky"
      },
      {
        id: 18,
        slug: "valores-para-el-manana",
        titleKey: "podcast.ylmepv.ep6.title",
        descriptionKey: "podcast.ylmepv.ep6.description",
        duration: "49 min",
        date: "2024-05-06",
        categoryKey: "podcast.category.ethics",
        audioUrl: "https://open.spotify.com/episode/2P4w0uobN6BY4YnH7l8Hjs"
      },
      {
        id: 19,
        slug: "la-consciencia-del-cambio",
        titleKey: "podcast.ylmepv.ep7.title",
        descriptionKey: "podcast.ylmepv.ep7.description",
        duration: "51 min",
        date: "2024-05-13",
        categoryKey: "podcast.category.consciousness",
        audioUrl: "https://open.spotify.com/episode/6moanslpOQnjIflPgBSvFV"
      },
      {
        id: 20,
        slug: "sabiduria-y-experiencia",
        titleKey: "podcast.ylmepv.ep8.title",
        descriptionKey: "podcast.ylmepv.ep8.description",
        duration: "48 min",
        date: "2024-05-20",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/2GjRtY4EToKVFvSVnvw1TM"
      },
      {
        id: 21,
        slug: "economia-consciente",
        titleKey: "podcast.ylmepv.ep9.title",
        descriptionKey: "podcast.ylmepv.ep9.description",
        duration: "52 min",
        date: "2024-05-27",
        categoryKey: "podcast.category.economics",
        audioUrl: "https://open.spotify.com/episode/6G8503FwAp1IMWgpksy3ph"
      },
      {
        id: 22,
        slug: "comunidad-y-colaboracion",
        titleKey: "podcast.ylmepv.ep10.title",
        descriptionKey: "podcast.ylmepv.ep10.description",
        duration: "50 min",
        date: "2024-06-03",
        categoryKey: "podcast.category.society",
        audioUrl: "https://open.spotify.com/episode/74OcVVwx12U1QOvnQOIoBp"
      },
      {
        id: 23,
        slug: "desarrollo-integral",
        titleKey: "podcast.ylmepv.ep11.title",
        descriptionKey: "podcast.ylmepv.ep11.description",
        duration: "49 min",
        date: "2024-06-10",
        categoryKey: "podcast.category.development",
        audioUrl: "https://open.spotify.com/episode/4LqP6qKta20Iu0DO6OlcY0"
      },
      {
        id: 24,
        slug: "despertar-colectivo",
        titleKey: "podcast.ylmepv.ep12.title",
        descriptionKey: "podcast.ylmepv.ep12.description",
        duration: "53 min",
        date: "2024-06-17",
        categoryKey: "podcast.category.consciousness",
        audioUrl: "https://open.spotify.com/episode/6RAOTvrlbf5SGyw5igJ5fe"
      },
      {
        id: 25,
        slug: "responsabilidad-global",
        titleKey: "podcast.ylmepv.ep13.title",
        descriptionKey: "podcast.ylmepv.ep13.description",
        duration: "47 min",
        date: "2024-06-24",
        categoryKey: "podcast.category.ethics",
        audioUrl: "https://open.spotify.com/episode/7ve8VbLOBFxGrGQ8v7simG"
      },
      {
        id: 26,
        slug: "fe-en-el-ser-humano",
        titleKey: "podcast.ylmepv.ep14.title",
        descriptionKey: "podcast.ylmepv.ep14.description",
        duration: "51 min",
        date: "2024-07-01",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/60RAX3yLSPePDTloXgpT3F"
      },
      {
        id: 27,
        slug: "el-legado-del-optimismo",
        titleKey: "podcast.ylmepv.ep15.title",
        descriptionKey: "podcast.ylmepv.ep15.description",
        duration: "54 min",
        date: "2024-07-08",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/02E9IMkLchhreDw2Y0WFQK"
      }
    ]
  },
  {
    id: 'el-arte-de-ser-empresario',
    titleKey: 'podcast.series.eadse.title',
    descriptionKey: 'podcast.series.eadse.description',
    coverImage: 'https://qlqkdininewormskpnya.supabase.co/storage/v1/object/public/admin-uploads/el-arte-de-ser-empresario-cover.png',
    episodes: [
      {
        id: 28,
        slug: "introduccion-el-arte-de-ser-empresario",
        titleKey: "podcast.eadse.ep1.title",
        descriptionKey: "podcast.eadse.ep1.description",
        duration: "45 min",
        date: "2024-08-01",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/7rpKFbtThQlBAXchUygqeH"
      },
      {
        id: 29,
        slug: "abundancia-bienestar-felicidad",
        titleKey: "podcast.eadse.ep2.title",
        descriptionKey: "podcast.eadse.ep2.description",
        duration: "48 min",
        date: "2024-08-08",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/2pW40tH5zQwkpdJav4EJ1W"
      },
      {
        id: 30,
        slug: "liderazgo-consciente",
        titleKey: "podcast.eadse.ep3.title",
        descriptionKey: "podcast.eadse.ep3.description",
        duration: "46 min",
        date: "2024-08-15",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/5Hb4oqpaxWTkS1RJ4WnDJP"
      },
      {
        id: 31,
        slug: "estrategia-y-proposito",
        titleKey: "podcast.eadse.ep4.title",
        descriptionKey: "podcast.eadse.ep4.description",
        duration: "50 min",
        date: "2024-08-22",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/5wkQXjP0f7b1K25sEOk40M"
      },
      {
        id: 32,
        slug: "que-es-ser-empresario",
        titleKey: "podcast.eadse.ep5.title",
        descriptionKey: "podcast.eadse.ep5.description",
        duration: "47 min",
        date: "2024-08-29",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/18EHnLM83HoZtqiRdL3xFt"
      },
      {
        id: 33,
        slug: "equipos-de-alto-rendimiento",
        titleKey: "podcast.eadse.ep6.title",
        descriptionKey: "podcast.eadse.ep6.description",
        duration: "49 min",
        date: "2024-09-05",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/0GuVaEGO7OfpjrwFFR8Mtx"
      },
      {
        id: 34,
        slug: "toma-de-decisiones",
        titleKey: "podcast.eadse.ep7.title",
        descriptionKey: "podcast.eadse.ep7.description",
        duration: "51 min",
        date: "2024-09-12",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/5hdm14OUCv7sE9tHRyaLVN"
      },
      {
        id: 35,
        slug: "gestion-del-cambio",
        titleKey: "podcast.eadse.ep8.title",
        descriptionKey: "podcast.eadse.ep8.description",
        duration: "48 min",
        date: "2024-09-19",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/3kA9zWu8g4LgTmin8BV5zM"
      },
      {
        id: 36,
        slug: "responsabilidad-social-empresarial",
        titleKey: "podcast.eadse.ep9.title",
        descriptionKey: "podcast.eadse.ep9.description",
        duration: "52 min",
        date: "2024-09-26",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/7j2CXJfkC3RLh7aloW33o2"
      },
      {
        id: 37,
        slug: "crecimiento-sostenible",
        titleKey: "podcast.eadse.ep10.title",
        descriptionKey: "podcast.eadse.ep10.description",
        duration: "50 min",
        date: "2024-10-03",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/4X7ujqbFwq3lLLHe6Weeoc"
      },
      {
        id: 38,
        slug: "cultura-organizacional",
        titleKey: "podcast.eadse.ep11.title",
        descriptionKey: "podcast.eadse.ep11.description",
        duration: "49 min",
        date: "2024-10-10",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/76edfanIRwxvm0PV9Hr6nI"
      },
      {
        id: 39,
        slug: "legado-empresarial",
        titleKey: "podcast.eadse.ep12.title",
        descriptionKey: "podcast.eadse.ep12.description",
        duration: "53 min",
        date: "2024-10-17",
        categoryKey: "podcast.category.business",
        audioUrl: "https://open.spotify.com/episode/14tXuAS8NDl1ON7RkUyRLA"
      }
    ]
  },
  {
    id: 'ecologia-y-espiritualidad',
    titleKey: 'podcast.series.eye.title',
    descriptionKey: 'podcast.series.eye.description',
    coverImage: 'https://qlqkdininewormskpnya.supabase.co/storage/v1/object/public/admin-uploads/ecologia-y-espiritualidad-cover.jpg',
    episodes: [
      {
        id: 40,
        slug: "introduccion-ecologia-y-espiritualidad",
        titleKey: "podcast.eye.ep1.title",
        descriptionKey: "podcast.eye.ep1.description",
        duration: "45 min",
        date: "2024-11-01",
        categoryKey: "podcast.category.ecology",
        audioUrl: "https://open.spotify.com/episode/2Ri6YHZupmPFnPH3Et8aVV"
      },
      {
        id: 41,
        slug: "fanatismo-y-mitos-ecologicos",
        titleKey: "podcast.eye.ep2.title",
        descriptionKey: "podcast.eye.ep2.description",
        duration: "48 min",
        date: "2024-11-08",
        categoryKey: "podcast.category.ecology",
        audioUrl: "https://open.spotify.com/episode/08M7Gcajn8wVm6hhJ4ppTD"
      },
      {
        id: 42,
        slug: "la-interdependencia",
        titleKey: "podcast.eye.ep3.title",
        descriptionKey: "podcast.eye.ep3.description",
        duration: "50 min",
        date: "2024-11-15",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/3Yahx2ONMaoepQPX9BF4bf"
      },
      {
        id: 43,
        slug: "democracia-libertad-y-ecologia",
        titleKey: "podcast.eye.ep4.title",
        descriptionKey: "podcast.eye.ep4.description",
        duration: "47 min",
        date: "2024-11-22",
        categoryKey: "podcast.category.philosophy",
        audioUrl: "https://open.spotify.com/episode/7I5ES1XJFsryzrRyPThKBi"
      },
      {
        id: 44,
        slug: "economia-energia-y-sustentabilidad",
        titleKey: "podcast.eye.ep5.title",
        descriptionKey: "podcast.eye.ep5.description",
        duration: "52 min",
        date: "2024-11-29",
        categoryKey: "podcast.category.economics",
        audioUrl: "https://open.spotify.com/episode/0u8ho1kHsIUyqynmsRQwpM"
      },
      {
        id: 45,
        slug: "ciencia-tecnologia-y-conciencia-del-limite",
        titleKey: "podcast.eye.ep6.title",
        descriptionKey: "podcast.eye.ep6.description",
        duration: "49 min",
        date: "2024-12-06",
        categoryKey: "podcast.category.science",
        audioUrl: "https://open.spotify.com/episode/22GXtjMhN51f26blfKE81F"
      },
      {
        id: 46,
        slug: "religion-valores-y-profundidad-espiritual",
        titleKey: "podcast.eye.ep7.title",
        descriptionKey: "podcast.eye.ep7.description",
        duration: "51 min",
        date: "2024-12-13",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/2B1OpxL61ycdNP48GO9os5"
      },
      {
        id: 47,
        slug: "el-imperativo-etico",
        titleKey: "podcast.eye.ep8.title",
        descriptionKey: "podcast.eye.ep8.description",
        duration: "48 min",
        date: "2024-12-20",
        categoryKey: "podcast.category.ethics",
        audioUrl: "https://open.spotify.com/episode/5bFQ6I3HpEuLzxqWItkNwE"
      },
      {
        id: 48,
        slug: "una-ecologia-espiritual",
        titleKey: "podcast.eye.ep9.title",
        descriptionKey: "podcast.eye.ep9.description",
        duration: "53 min",
        date: "2024-12-27",
        categoryKey: "podcast.category.spirituality",
        audioUrl: "https://open.spotify.com/episode/1HgXfPk1AMI81Z5B6Uv7Bn"
      },
      {
        id: 49,
        slug: "la-evolucion-depende-de-nosotros",
        titleKey: "podcast.eye.ep10.title",
        descriptionKey: "podcast.eye.ep10.description",
        duration: "50 min",
        date: "2025-01-03",
        categoryKey: "podcast.category.consciousness",
        audioUrl: "https://open.spotify.com/episode/6OfwvTw89vheCNaJM7MfuI"
      }
    ]
  }
];

// Legacy flat array for backward compatibility
export const podcasts: Podcast[] = podcastSeries.flatMap(series => 
  series.episodes.map(ep => ({
    ...ep,
    imageUrl: series.coverImage,
    seriesId: series.id
  }))
);

export const videos: Video[] = [
  {
    id: 1,
    titleKey: "video.smge.title",
    descriptionKey: "video.smge.description",
    duration: "1:15:30",
    date: "2024-10-28",
    categoryKey: "podcast.category.conference",
    videoUrl: "https://www.youtube.com/watch?v=LRr-CKjfmrE",
    imageUrl: "/lovable-uploads/bd0dec77-828d-40b0-8bcc-30690a3a1fb3.webp"
  }
];
