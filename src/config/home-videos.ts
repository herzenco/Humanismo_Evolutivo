// Shared by the welcome popup, Section 1 and Section 4.
export const homeVideos = {
  introduction: {
    id: 'parque-cancun-introduccion-20261021',
    src: '/api/qa-media/introduction',
    poster: '/api/qa-media/introduction-poster',
    durationSeconds: 186.1,
  },
  documentary: { youtubeId: 'FbRIey3dFwA' },
} as const;

// Exact allowlist: clients cannot choose arbitrary blob paths or URLs.
export const qaMediaAssets: Record<string, { pathname: string; contentType: string }> = {
  introduction: { pathname:'homepage/introduccion-parque-cancun-20261021.mp4',contentType:'video/mp4' },
  'introduction-poster': { pathname:'homepage/introduccion-parque-cancun-20261021.jpg',contentType:'image/jpeg' },
};
