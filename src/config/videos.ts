// Ordered homepage video slots. Set verified YouTube IDs here when approved.
// TODO: Supply the eight-minute overview and verify the 47-minute documentary URL.
export const homepageVideos: {
  overview: { youtubeId: string | null };
  philosophers: { youtubeId: string };
  documentary: { youtubeId: string | null };
} = {
  overview: { youtubeId: null },
  philosophers: { youtubeId: '5rmKRNZbmoQ' },
  documentary: { youtubeId: null },
};
