import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { QA_PROJECT_ID, QA_SESSION_SECONDS, qaGateEnabled, qaGateConfig, validQaPassword, createQaSession, validQaSession, qaReturnPath } from '../src/lib/qa-gate.ts';

const config = { passwordHash:createHash('sha256').update('test-only-password').digest('hex'),secret:'test-only-signing-key-with-at-least-32-chars' };
test('only QA auto-enables the gate; missing QA secrets fail closed',()=>{
  assert.equal(qaGateEnabled({VERCEL_PROJECT_ID:QA_PROJECT_ID}),true);
  assert.equal(qaGateEnabled({VERCEL_PROJECT_ID:'public-production-project'}),false);
  assert.equal(qaGateEnabled({QA_GATE_ENABLED:'true'}),true);
  assert.equal(qaGateEnabled({QA_GATE_ENABLED:'false'}),false);
  assert.throws(()=>qaGateConfig({}),/unavailable/);
  assert.throws(()=>qaGateConfig({QA_GATE_PASSWORD_HASH:config.passwordHash,QA_GATE_SECRET:'short'}));
  assert.deepEqual(qaGateConfig({QA_GATE_PASSWORD_HASH:config.passwordHash,QA_GATE_SECRET:config.secret}),config);
});
test('passwords require an exact match and are never the session credential',()=>{
  assert.equal(validQaPassword('test-only-password',config),true);
  for(const wrong of ['','wrong','test-only-password ','x'.repeat(257)]) assert.equal(validQaPassword(wrong,config),false);
  const token=createQaSession('qa.example.test',config,100);
  assert.equal(token.includes('test-only-password'),false);
  assert.equal(token.includes(config.passwordHash),false);
});
test('sessions reject forgery, expiry, another host and password/secret rotation',()=>{
  const token=createQaSession('qa.example.test',config,100);
  assert.equal(validQaSession(token,'qa.example.test',config,101),true);
  assert.equal(validQaSession(token,'other.example.test',config,101),false);
  assert.equal(validQaSession(token,'qa.example.test',config,100+QA_SESSION_SECONDS),false);
  assert.equal(validQaSession(token,'qa.example.test',{...config,secret:'changed'},101),false);
  assert.equal(validQaSession(token,'qa.example.test',{...config,passwordHash:'0'.repeat(64)},101),false);
  for(const forged of [undefined,'true',token+'x',token.replace(/^\d+/,'999999999999'),token.replace(/.$/,'!')])assert.equal(validQaSession(forged,'qa.example.test',config,101),false);
});
test('return paths cannot redirect to an external site or back to the gate',()=>{
  assert.equal(qaReturnPath('/portal?view=library'),'/portal?view=library');
  for(const path of [null,'https://evil.test','//evil.test','/\\evil.test','/qa-access','/a/../qa-access','/\n/evil.test'])assert.equal(qaReturnPath(path),'/');
});
