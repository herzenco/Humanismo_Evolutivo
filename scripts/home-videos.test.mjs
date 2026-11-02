import test from 'node:test';
import assert from 'node:assert/strict';
import { homeVideos, qaMediaAssets } from '../src/config/home-videos.ts';

test('the introduction uses protected media and the documentary retains the former popup video',()=>{
 assert.equal(homeVideos.introduction.src,'/api/qa-media/introduction');
 assert.equal(homeVideos.introduction.poster,'/api/qa-media/introduction-poster');
 assert.equal(homeVideos.documentary.youtubeId,'FbRIey3dFwA');
 assert.ok(homeVideos.introduction.durationSeconds>180&&homeVideos.introduction.durationSeconds<190);
 assert.deepEqual(Object.keys(qaMediaAssets).sort(),['introduction','introduction-poster','philosophers','philosophers-poster']);
 assert.equal(qaMediaAssets.introduction.pathname,'homepage/introduccion-parque-cancun-20261021.mp4');
});

 test('the philosophers section has its own supplied video and matching poster',()=>{
 assert.equal(homeVideos.philosophers.src,'/api/qa-media/philosophers');
 assert.equal(homeVideos.philosophers.poster,'/api/qa-media/philosophers-poster');
 assert.equal(qaMediaAssets.philosophers.pathname,'homepage/humanismo-evolutivo-transpersonal-20261102.mp4');
 assert.equal(qaMediaAssets['philosophers-poster'].pathname,'homepage/humanismo-evolutivo-transpersonal-20261102.jpg');
 assert.notEqual(homeVideos.philosophers.src,homeVideos.introduction.src);
});
