// Separate media for the welcome popup, philosophers section, and documentary.
export const homeVideos = {
  introduction: {
    id: 'parque-cancun-introduccion-20261021',
    src: '/api/qa-media/introduction',
    poster: '/api/qa-media/introduction-poster',
    durationSeconds: 186.1,
  },
  philosophers: {
    id: 'humanismo-evolutivo-transpersonal-20261102',
    src: '/api/qa-media/philosophers',
    poster: '/api/qa-media/philosophers-poster',
    durationSeconds: 413.75,
  },
  documentary: { youtubeId: 'FbRIey3dFwA', poster: '/design/documentary-parque-cancun.jpg' },
} as const;

// Exact allowlist: clients cannot choose arbitrary blob paths or URLs.
export const qaMediaAssets: Record<string, { pathname: string; contentType: string }> = {
  philosophers: { pathname:'homepage/humanismo-evolutivo-transpersonal-20261102.mp4',contentType:'video/mp4' },
  'philosophers-poster': { pathname:'homepage/humanismo-evolutivo-transpersonal-20261102.jpg',contentType:'image/jpeg' },
  introduction: { pathname:'homepage/introduccion-parque-cancun-20261021.mp4',contentType:'video/mp4' },
  'introduction-poster': { pathname:'homepage/introduccion-parque-cancun-20261021.jpg',contentType:'image/jpeg' },
};
