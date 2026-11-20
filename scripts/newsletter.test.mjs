import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import test from 'node:test';

const qa = 'https://qa.humanismoevolutivo.com';
const email1 = 'herzen+heqa-01@herzenco.co';
const email2 = 'herzen+heqa-02@herzenco.co';
const testEnv = {
  NEWSLETTER_ENVIRONMENT: 'qa',
  NEWSLETTER_SUPABASE_URL: 'https://nywgzeucqbfgvyjfmvgt.supabase.co',
  NEWSLETTER_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_mock',
  NEWSLETTER_FROM_EMAIL: 'newsletter@example.invalid',
  RESEND_API_KEY: 'mock',
  RESEND_NEWSLETTER_SEGMENT_ID: 'mock-segment',
};
Object.assign(process.env, testEnv);

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export{}', shortCircuit: true };
    if (specifier === 'next/headers') {
      return { url: 'data:text/javascript,export const headers = async () => new Headers({host:"qa.humanismoevolutivo.com",origin:"https://qa.humanismoevolutivo.com"})', shortCircuit: true };
    }
    if (specifier.startsWith('@/')) {
      return next(new URL('../src/' + specifier.slice(2) + '.ts', import.meta.url).href, context);
    }
    return next(specifier, context);
  },
});

const { hashToken, newToken, newsletterConfig, newsletterOrigin, signupSchema } = await import('../src/lib/newsletter.ts');
const { POST } = await import('../src/app/api/boletin/route.ts');
const { confirmNewsletter, unsubscribeNewsletter } = await import('../src/app/boletin/actions.ts');

function signup(body, origin = qa) {
  return POST(new Request(qa + '/api/boletin', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

function tokenForm(token) {
  const form = new FormData();
  form.set('token', token);
  return form;
}

test('environment flags reject unset or crossed database targets', () => {
  const live = 'https://iwtcdjkawcjsxmwhzlot.supabase.co';
  assert.equal(newsletterConfig({}), null);
  assert.equal(newsletterConfig({ ...testEnv, NEWSLETTER_SUPABASE_URL: live }), null);
  assert.equal(newsletterConfig({ ...testEnv, NEWSLETTER_ENVIRONMENT: 'production' }), null);
  assert.ok(newsletterConfig({ ...testEnv, NEWSLETTER_ENVIRONMENT: 'production', NEWSLETTER_SUPABASE_URL: live }));
  assert.ok(newsletterConfig(testEnv));
});

test('request origin, consent, plus-tagged addresses and SHA-256', () => {
  assert.equal(newsletterOrigin(new Request('https://preview.example.invalid', { headers: { origin: 'https://preview.example.invalid' } })), null);
  assert.equal(newsletterOrigin(new Request(qa, { headers: { origin: qa } })), qa);
  assert.equal(signupSchema.safeParse({ email: email1, consent: false }).success, false);
  const validate = email => signupSchema.parse({ email, consent: true }).email;
  assert.equal(validate(email1.toUpperCase()), email1);
  assert.equal(validate(email2), email2);
  const token = newToken();
  assert.equal(Buffer.from(token, 'base64url').length, 32);
  assert.match(hashToken(token), /^[a-f0-9]{64}$/);
  assert.equal(hashToken('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('SQL protects rows, keeps plus tags, and limits and consumes tokens atomically', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261120150000_newsletter_double_opt_in.sql', import.meta.url), 'utf8');
  assert.match(sql, /enable row level security/);
  assert.match(sql, /revoke all on public.newsletter_subscriptions from public, anon, authenticated/);
  assert.match(sql, /unique index if not exists newsletter_email_ci .* \(lower\(email\)\)/);
  assert.match(sql, /interval '48 hours'/);
  assert.match(sql, /where status = 'pending' and confirm_token_hash = p_token_hash and confirm_token_expires_at > now\(\)/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /interval '10 minutes'\) >= 5/);
  assert.match(sql, /interval '1 day'\) >= 5/);
});

test('mocked intake and token actions stay generic and persist during a Resend outage', async t => {
  const rows = new Map();
  const requests = [];
  const now = Date.now();
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url ?? input);
    const args = JSON.parse(init?.body ?? '{}');
    requests.push({ url, args });
    if (url.hostname === 'api.resend.com') return new Response(null, { status: 503 });
    assert.equal(url.origin, testEnv.NEWSLETTER_SUPABASE_URL);
    switch (url.pathname.split('/').at(-1)) {
      case 'signup_newsletter': {
        if (rows.has(args.p_email)) return Response.json('skip');
        rows.set(args.p_email, {
          email: args.p_email, hash: args.p_confirm_hash, bajaHash: args.p_unsubscribe_hash,
          expires: now + 1000, status: 'pending', resend_synced_at: null,
        });
        return Response.json('send');
      }
      case 'confirm_newsletter': {
        const row = [...rows.values()].find(item => item.hash === args.p_token_hash && item.expires > now && item.status === 'pending');
        if (!row) return Response.json(null);
        row.status = 'confirmed';
        return Response.json({ email: row.email });
      }
      case 'unsubscribe_newsletter': {
        const row = [...rows.values()].find(item => item.bajaHash === args.p_token_hash);
        if (!row) return Response.json(null);
        row.status = 'unsubscribed';
        return Response.json({ email: row.email });
      }
      default: assert.fail('Unexpected RPC');
    }
  });

  assert.equal((await signup({ website: 'bot' }, 'https://preview.example.invalid')).status, 403);
  assert.deepEqual(await (await signup({ website: 'bot' })).json(), { ok: true });
  assert.equal(requests.length, 0);
  assert.deepEqual(await (await signup({ email: email1, consent: true })).json(), { ok: true });
  assert.deepEqual(await (await signup({ email: email1, consent: true })).json(), { ok: true });
  assert.deepEqual(await (await signup({ email: email2, consent: true })).json(), { ok: true });

  const outbound = requests.filter(request => request.url.hostname === 'api.resend.com');
  assert.equal(outbound.length, 2);
  assert.equal(rows.size, 2);
  assert.equal(rows.get(email1).status, 'pending');
  const links = email => Array.from(outbound.find(request => request.args.to[0] === email).args.text.matchAll(/https:\/\/[^ .]+(?:\.[^ .]+)*\/boletin\/\w+\?token=([\w-]+)/g), match => match[1]);
  const [token1, baja1] = links(email1);
  const [token2] = links(email2);
  assert.equal(rows.get(email1).hash, hashToken(token1));
  rows.get(email2).expires = now - 1;
  assert.equal(await confirmNewsletter(null, tokenForm(token2)), false, 'expired token');
  assert.equal(await confirmNewsletter(null, tokenForm(token1)), true);
  assert.equal(await confirmNewsletter(null, tokenForm(token1)), false, 'reused token');
  assert.equal(rows.get(email1).status, 'confirmed');
  assert.equal(rows.get(email1).resend_synced_at, null);
  assert.equal(await unsubscribeNewsletter(null, tokenForm(baja1)), true);
  assert.equal(rows.get(email1).status, 'unsubscribed');
});
