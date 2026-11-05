import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async name=>JSON.parse(await readFile(new URL(`../src/generated/${name}.json`,import.meta.url),'utf8'));
test('all four supplied courses have complete ordered class workspaces and body-free catalogues',async()=>{
 const content=await load('course-content'),catalog=await load('course-catalog');
 assert.deepEqual(content.map(c=>c.lessons.length),[45,45,45,11]);
 assert.equal(content.flatMap(c=>c.lessons).length,146);
 for(const [i,c] of content.entries()) {
  assert.deepEqual(c.lessons.map(l=>({id:l.id,title:l.title})),catalog[i].lessons);
  for(const [j,l] of c.lessons.entries()) {
   assert.equal(l.id,String(j+1));assert.ok(l.title.length>10);
   assert.equal(l.sections.length,7);assert.ok(l.sections.every(s=>s.text.length>20));
   assert.ok(!JSON.stringify(l).includes('Fundación Humanismo EvolutivoIntroducción'));
  }
 }
 assert.ok(!JSON.stringify(catalog).includes('sections'));
});
