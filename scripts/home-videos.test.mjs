import test from 'node:test';
import assert from 'node:assert/strict';
import { homeVideos, qaMediaAssets, welcomeVideoYouTubeId, youtubeEmbedUrl } from '../src/config/home-videos.ts';

test('the video library can use protected introduction media and the documentary retains its video',()=>{
 assert.equal(homeVideos.introduction.src,'/api/qa-media/introduction');
 assert.equal(homeVideos.introduction.poster,'/api/qa-media/introduction-poster');
 assert.equal(homeVideos.documentary.youtubeId,'FbRIey3dFwA');
 assert.ok(homeVideos.introduction.durationSeconds>180&&homeVideos.introduction.durationSeconds<190);
 assert.deepEqual(Object.keys(qaMediaAssets).sort(),['introduction','introduction-poster','philosophers','philosophers-poster']);
 assert.equal(qaMediaAssets.introduction.pathname,'homepage/introduccion-parque-cancun-20261021.mp4');
});

test('the video library retains the protected philosophers video and matching poster',()=>{
 assert.equal(homeVideos.philosophers.src,'/api/qa-media/philosophers');
 assert.equal(homeVideos.philosophers.poster,'/api/qa-media/philosophers-poster');
 assert.equal(qaMediaAssets.philosophers.pathname,'homepage/humanismo-evolutivo-transpersonal-20261102.mp4');
 assert.equal(qaMediaAssets['philosophers-poster'].pathname,'homepage/humanismo-evolutivo-transpersonal-20261102.jpg');
 assert.notEqual(homeVideos.philosophers.src,homeVideos.introduction.src);
});

test('the welcome video uses the requested privacy-enhanced YouTube embed', () => {
  const embed = new URL(youtubeEmbedUrl(welcomeVideoYouTubeId));
  assert.equal(embed.origin, 'https://www.youtube-nocookie.com');
  assert.equal(embed.pathname, '/embed/jBXcNhNX9Jo');
});
