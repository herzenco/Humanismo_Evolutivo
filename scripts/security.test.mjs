import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL('../supabase/migrations/20261112175820_harden_public_security_definer_functions.sql', import.meta.url);

test('privileged intake functions are callable only by trusted server code', async () => {
  const sql = await readFile(migrationUrl, 'utf8');
  assert.match(sql, /submit_contact_submission[\s\S]*from public, anon, authenticated;[\s\S]*submit_contact_submission[\s\S]*to service_role;/i);
  assert.match(sql, /submit_education_interest[\s\S]*from public, anon, authenticated;[\s\S]*submit_education_interest[\s\S]*to service_role;/i);
  assert.match(sql, /list_contact_submissions[\s\S]*from public, anon;[\s\S]*list_contact_submissions[\s\S]*to authenticated;/i);
});

test('server-only Supabase secrets are never public-prefixed', async () => {
  const source = await readFile(new URL('../src/lib/supabase/service.ts', import.meta.url), 'utf8');
  assert.match(source, /process\.env\.SUPABASE_SECRET_KEY/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_.*SECRET|SERVICE_ROLE/);
});
