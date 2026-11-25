import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

const source = {
  'server-only': 'export {}',
  'next/navigation': 'export function unstable_rethrow(error) { if (error === globalThis.qaDynamicSignal) throw error; }',
  '@/data/resources': 'export const resourceArticles = []',
  '@/data/school-calendar-2027': 'export const schoolCourses = []',
  '@/data/school-course-previews': 'export const schoolCoursePreviews = {}',
  '@/data/questions': 'export const questions = []',
  '@/data/questionTitlesEn': 'export const questionTitlesEn = {}',
  '@/data/books': 'export const books = []',
  '@/data/media': 'export const podcastSeries = []',
};
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (Object.hasOwn(source, specifier)) {
      return { url: 'data:text/javascript,' + encodeURIComponent(source[specifier]), shortCircuit: true };
    }
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL('../src/' + specifier.slice(2) + '.ts', import.meta.url).href, context);
    }
    if (specifier === './qa-resource-contract') {
      return nextResolve(new URL('../src/lib/qa-resource-contract.ts', import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});
process.env.QA_RESOURCE_READER_TOKEN = 'a'.repeat(64);
process.env.QA_RESOURCE_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mock';
process.env.QA_GATE_ENABLED = 'true';
const { getMagazineArticles } = await import('../src/lib/qa-resources.ts');
hooks.deregister();

test('Revista picks up an admin publication after an empty response and respects removal', async t => {
  const row = {
    slug: 'articulo-de-prueba', version: 1, updated_at: '2026-11-24T23:58:37.679875+00:00',
    payload: {
      title: 'Artículo de prueba', excerpt: 'Resumen', body: 'Primera línea\n\nSegunda línea',
      publishedAt: '2026-11-24', author: 'Autora', category: 'Revista',
    },
  };
  let entries = [];
  t.mock.method(globalThis, 'fetch', (url, input) => {
    assert.equal(new URL(url).hostname, 'nywgzeucqbfgvyjfmvgt.supabase.co');
    assert.equal(input.cache, 'no-store');
    assert.equal(JSON.parse(input.body).p_kind, 'revista');
    return Promise.resolve(Response.json(entries));
  });

  assert.deepEqual(await getMagazineArticles(), []);
  entries = [row];
  const [article] = await getMagazineArticles();
  assert.equal(article.title, row.payload.title);
  assert.equal(article.bodyHtml, '<p>Primera línea</p><p>Segunda línea</p>');
  entries = [{ ...row, version: 2, payload: null }];
  assert.deepEqual(await getMagazineArticles(), []);
});

test('the editorial reader lets Next switch from prerendering to request-time rendering', async t => {
  const signal = new Error('Next.js prerender signal');
  globalThis.qaDynamicSignal = signal;
  t.after(() => { delete globalThis.qaDynamicSignal; });
  t.mock.method(globalThis, 'fetch', async () => { throw signal; });
  await assert.rejects(getMagazineArticles('boletin'), error => error === signal);
});
