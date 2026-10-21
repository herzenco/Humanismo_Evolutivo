import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const QA_PROJECT_ID = 'prj_54xZriv1qBcJTuNqy8nLoSSB04u1';
export const QA_SESSION_SECONDS = 8 * 60 * 60;
export const QA_COOKIE = '__Host-qa-access';
export type QaGateConfig = { passwordHash: string; secret: string };

export function qaGateEnabled(env: Record<string, string | undefined> = process.env) {
  return env.VERCEL_PROJECT_ID === QA_PROJECT_ID || env.QA_GATE_ENABLED === 'true';
}

export function qaGateConfig(env: Record<string, string | undefined> = process.env): QaGateConfig {
  const passwordHash = env.QA_GATE_PASSWORD_HASH ?? '';
  const secret = env.QA_GATE_SECRET ?? '';
  if (!/^[a-f0-9]{64}$/.test(passwordHash) || secret.length < 32) {
    throw new Error('QA gate configuration unavailable');
  }
  return { passwordHash, secret };
}

function equal(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

export function validQaPassword(password: string, config: QaGateConfig) {
  return password.length > 0 && password.length <= 256 &&
    equal(createHash('sha256').update(password).digest('hex'), config.passwordHash);
}

function signature(expires: number, host: string, config: QaGateConfig) {
  return createHmac('sha256', config.secret)
    .update(`qa-gate:v1:${host}:${expires}:${config.passwordHash}`).digest('base64url');
}

export function createQaSession(host: string, config: QaGateConfig, now = Math.floor(Date.now() / 1000)) {
  const expires = now + QA_SESSION_SECONDS;
  return `${expires}.${signature(expires, host, config)}`;
}

export function validQaSession(token: string | undefined, host: string, config: QaGateConfig, now = Math.floor(Date.now() / 1000)) {
  if (!token || token.length > 128 || !/^\d{1,12}\.[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [expiry, mac] = token.split('.');
  const expires = Number(expiry);
  return expires > now && expires <= now + QA_SESSION_SECONDS && equal(mac, signature(expires, host, config));
}

export function qaReturnPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return '/';
  const url = new URL(value, 'https://qa.invalid');
  if (url.origin !== 'https://qa.invalid' || url.pathname.startsWith('/qa-access')) return '/';
  return `${url.pathname}${url.search}`;
}
