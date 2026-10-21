import test from 'node:test';
import assert from 'node:assert/strict';
import { homeVideos, qaMediaAssets } from '../src/config/home-videos.ts';

test('the introduction uses protected media and the documentary retains the former popup video',()=>{
 assert.equal(homeVideos.introduction.src,'/api/qa-media/introduction');
 assert.equal(homeVideos.introduction.poster,'/api/qa-media/introduction-poster');
 assert.equal(homeVideos.documentary.youtubeId,'FbRIey3dFwA');
 assert.ok(homeVideos.introduction.durationSeconds>180&&homeVideos.introduction.durationSeconds<190);
 assert.deepEqual(Object.keys(qaMediaAssets).sort(),['introduction','introduction-poster']);
 for(const asset of Object.values(qaMediaAssets))assert.ok(asset.pathname.startsWith('homepage/introduccion-parque-cancun-20261021.'));
});
