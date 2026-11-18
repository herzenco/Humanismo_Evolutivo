import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

const writes = [];
const stub = (source) => `data:text/javascript,${encodeURIComponent(source)}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/contact') return nextResolve('../src/lib/contact.ts', { ...context, parentURL: import.meta.url });
    if (specifier === '@/lib/supabase/config') return { url: stub('export const isSupabaseConfigured = true'), shortCircuit: true };
    if (specifier === '@/lib/supabase/server') {
      return {
        url: stub('export const createClient = async () => ({ rpc: (...args) => globalThis.recordContactWrite(...args) })'),
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});
const { POST } = await import('../src/app/api/contact/route.ts');
hooks.deregister();

function submit() {
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-type': 'application/json', 'accept-language': 'es' },
    body: JSON.stringify({
      name: 'Visitante', email: 'visitor@example.test', subject: 'Consulta',
      message: 'Mensaje de prueba', consent: true, locale: 'es', turnstileToken: 'synthetic-token',
    }),
  }));
}

test('contact saves only after verification and succeeds without either notification setting', async (t) => {
  for (const setting of ['TURNSTILE_SECRET_KEY', 'RESEND_API_KEY', 'PORTAL_INVITATION_FROM', 'CONTACT_FROM_EMAIL']) {
    delete process.env[setting];
  }
  globalThis.recordContactWrite = (...args) => {
    writes.push(args);
    return { data: 'synthetic-id', error: null };
  };
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    return Response.json({ success: true });
  });

  const rejected = await submit();
  assert.equal(rejected.status, 400);
  assert.deepEqual(await rejected.json(), { error: 'No pudimos verificar que eres una persona. Intenta de nuevo.' });
  assert.equal(writes.length, 0);
  assert.equal(fetchMock.mock.callCount(), 0);

  process.env.TURNSTILE_SECRET_KEY = 'synthetic';
  process.env.CONTACT_FROM_EMAIL = 'sender@example.test';
  const withoutKey = await submit();
  assert.equal(withoutKey.status, 200);
  assert.deepEqual(await withoutKey.json(), { ok: true });

  delete process.env.CONTACT_FROM_EMAIL;
  process.env.RESEND_API_KEY = 'synthetic';
  const withoutSender = await submit();
  assert.equal(withoutSender.status, 200);
  assert.deepEqual(await withoutSender.json(), { ok: true });
  assert.deepEqual(writes.map(([rpc]) => rpc), ['submit_contact_submission', 'submit_contact_submission']);
  assert.equal(fetchMock.mock.callCount(), 2);
  assert.ok(fetchMock.mock.calls.every(({ arguments: [url] }) => url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify'));
});
