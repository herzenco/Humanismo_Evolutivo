import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

const writes = [];
const stub = (source) => `data:text/javascript,${encodeURIComponent(source)}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/newsletter') return nextResolve('../src/lib/newsletter.ts', { ...context, parentURL: import.meta.url });
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

function submit(overrides = {}) {
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-type': 'application/json', 'accept-language': 'es' },
    body: JSON.stringify({
      name: 'Visitante', email: 'visitor@example.test', subject: 'Consulta',
      message: 'Mensaje de prueba', consent: true, locale: 'es', ...overrides,
    }),
  }));
}

test('contact validates, saves and notifies without Turnstile', async (t) => {
  for (const setting of ['RESEND_API_KEY', 'PORTAL_INVITATION_FROM', 'CONTACT_FROM_EMAIL']) {
    delete process.env[setting];
  }
  globalThis.recordContactWrite = (...args) => {
    writes.push(args);
    return { data: 'synthetic-id', error: null };
  };
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 'mock' }));

  const bot = await submit({ website: 'bot' });
  assert.equal(bot.status, 200);
  assert.deepEqual(await bot.json(), { ok: true });
  assert.equal(writes.length, 0);
  assert.equal(fetchMock.mock.callCount(), 0);

  const rejected = await submit({ consent: false });
  assert.equal(rejected.status, 400);
  assert.equal(writes.length, 0);

  const withoutNotification = await submit();
  assert.deepEqual(await withoutNotification.json(), { ok: true });
  assert.equal(fetchMock.mock.callCount(), 0);

  process.env.RESEND_API_KEY = 'synthetic';
  process.env.CONTACT_FROM_EMAIL = 'sender@example.test';
  process.env.PORTAL_INVITATION_FROM = 'invitation@example.test';
  const notified = await submit();
  assert.deepEqual(await notified.json(), { ok: true });
  assert.deepEqual(writes.map(([rpc]) => rpc), ['submit_contact_submission', 'submit_contact_submission']);
  assert.equal(fetchMock.mock.callCount(), 1);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, 'https://api.resend.com/emails');
  const message = JSON.parse(options.body);
  assert.equal(message.from, 'sender@example.test');
  assert.equal(message.reply_to, 'visitor@example.test');
});
