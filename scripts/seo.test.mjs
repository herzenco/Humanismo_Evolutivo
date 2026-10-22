import test from 'node:test';import assert from 'node:assert/strict';
import { pageMetadata, SITE_ORIGIN } from '../src/lib/seo/site.ts';
import { publishedQuestions, questionKeywords } from '../src/data/questions.ts';
test('publishing metadata uses the canonical production origin regardless of QA configuration',()=>{
 const previous=process.env.SITE_URL;process.env.SITE_URL='https://qa.humanismoevolutivo.com';
 try{const metadata=pageMetadata('/autor','Autor','Una descripción única.');assert.equal(SITE_ORIGIN,'https://humanismoevolutivo.com');assert.equal(metadata.alternates.canonical,'https://humanismoevolutivo.com/autor');assert.equal(metadata.openGraph.url,metadata.alternates.canonical);}finally{if(previous===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=previous;}
});
test('all 51 questions have distinct topical keywords',()=>{
 const lists=publishedQuestions().map(q=>questionKeywords(q));assert.equal(lists.length,51);assert.equal(new Set(lists.map(v=>v.join(','))).size,51);for(const list of lists)assert.ok(list[0].length>5);
});
