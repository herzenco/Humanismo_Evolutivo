import assert from 'node:assert/strict';
import { podcastSeries } from '../src/data/media.ts';
import { podcastEpisodeContentBySpotifyId, getSpotifyEpisodeId } from '../src/data/podcastEpisodeContent.ts';
const episodeIds = [];
for (const series of podcastSeries) {
  const slugs = new Set();
  for (const episode of series.episodes) {
    assert(!slugs.has(episode.slug), `Duplicate slug: ${series.id}/${episode.slug}`);
    slugs.add(episode.slug);
    const id = getSpotifyEpisodeId(episode.audioUrl);
    assert(id, `Invalid Spotify link: ${episode.audioUrl}`);
    const content = podcastEpisodeContentBySpotifyId[id];
    assert(content, `Missing episode content: ${id}`);
    assert.equal(content.seriesId, series.id, `Wrong series for ${id}`);
    assert.equal(getSpotifyEpisodeId(content.embedUrl), id, `Embed mismatch: ${id}`);
    assert(content.title.trim() && content.description.trim(), `Empty content: ${id}`);
    episodeIds.push(id);
  }
}
assert.equal(new Set(episodeIds).size, episodeIds.length, 'Duplicate episode IDs');
assert.deepEqual(new Set(episodeIds), new Set(Object.keys(podcastEpisodeContentBySpotifyId)), 'Orphaned episode content');
console.log(`Verified ${episodeIds.length} episode routes and Spotify embeds using repository data.`);
