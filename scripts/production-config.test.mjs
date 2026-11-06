import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeMediaCacheHeaders} from '../src/lib/home-media-cache.ts';

async function config(env) {
 const names=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','NEXT_PUBLIC_SUPABASE_ANON_KEY'];
 const saved=Object.fromEntries(names.map(name=>[name,process.env[name]]));
 try {
  for(const name of names) {if(env[name]===undefined) delete process.env[name];else process.env[name]=env[name];}
  const source=await readFile(new URL('../src/lib/supabase/config.ts',import.meta.url),'utf8');
  return await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${Math.random()}`);
 } finally {for(const name of names) {if(saved[name]===undefined) delete process.env[name];else process.env[name]=saved[name];}}
}
test('Supabase URL and keys tolerate pasted whitespace and a trailing URL slash',async()=>{
 const c=await config({NEXT_PUBLIC_SUPABASE_URL:' https://example.supabase.co/ \n',NEXT_PUBLIC_SUPABASE_ANON_KEY:' public-key\n'});
 assert.equal(c.isSupabaseConfigured,true);
 assert.deepEqual(c.getSupabaseConfig(),{url:'https://example.supabase.co',publishableKey:'public-key'});
});
test('blank publishable key falls back to anon; whitespace-only configuration remains missing',async()=>{
 const c=await config({NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:' ',NEXT_PUBLIC_SUPABASE_ANON_KEY:' anon '});
 assert.equal(c.getSupabaseConfig().publishableKey,'anon');
 const blank=await config({NEXT_PUBLIC_SUPABASE_URL:' ',NEXT_PUBLIC_SUPABASE_ANON_KEY:' '});
 assert.equal(blank.isSupabaseConfigured,false);assert.throws(()=>blank.getSupabaseConfig(),/not configured/);
});
test('public media permits browser reuse while QA and all CDN responses remain uncached',()=>{
 assert.equal(homeMediaCacheHeaders(false)['Cache-Control'],'public, max-age=86400');
 assert.equal(homeMediaCacheHeaders(true)['Cache-Control'],'private, no-store, max-age=0');
 for(const gated of [true,false]) {
  const h=homeMediaCacheHeaders(gated);
  assert.equal(h['CDN-Cache-Control'],'no-store');assert.equal(h['Vercel-CDN-Cache-Control'],'no-store');
 }
});
