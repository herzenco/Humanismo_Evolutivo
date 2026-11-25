import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/newsletter') {
      return nextResolve('../src/lib/newsletter.ts', { ...context, parentURL: import.meta.url });
    }
    if (specifier === '@/lib/qa-resources') {
      return { url: 'data:text/javascript,export const getBooks = async () => [{id:"book",title:"Title from catalog",downloadAvailable:true}]', shortCircuit: true };
    }
    if (specifier === '@/lib/supabase/newsletter') {
      return { url: 'data:text/javascript,export const createNewsletterClient = () => ({rpc: globalThis.recordDownload})', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const { POST } = await import('../src/app/api/book-downloads/route.ts');
hooks.deregister();

const origin = 'https://qa.humanismoevolutivo.com';
function submit(overrides = {}) {
  return POST(new Request(origin + '/api/book-downloads', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Reader', email: 'Reader@Example.test', bookId: 'book', ...overrides }),
  }));
}

test('download intake validates email and book, ignores honeypots, and honors the database limit', async () => {
  const calls = [];
  globalThis.recordDownload = (rpc, args) => {
    calls.push({ rpc, args });
    return { data: calls.length === 1, error: null };
  };
  try {
    assert.equal((await submit({ email: 'wrong' })).status, 400);
    assert.equal((await submit({ bookId: 'missing' })).status, 404);
    assert.equal((await submit({ website: 'spam' })).status, 200);
    assert.equal(calls.length, 0);
    assert.equal((await submit({ bookTitle: 'Untrusted title' })).status, 200);
    assert.equal(calls[0].rpc, 'record_book_download_contact');
    assert.equal(calls[0].args.p_email, 'reader@example.test');
    assert.equal(calls[0].args.p_book_title, 'Title from catalog');
    assert.equal((await submit()).status, 429);
  } finally {
    delete globalThis.recordDownload;
  }
});
