import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', workers: 1, timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:3100', headless: true, trace: 'retain-on-failure' },
  webServer: [
    { command: 'node scripts/mock-supabase.mjs', url: 'http://127.0.0.1:54329/test/state', reuseExistingServer: false },
    { command: 'npm run build && npm run start -- --port 3100', url: 'http://127.0.0.1:3100', timeout: 180_000, reuseExistingServer: false,
      env: { NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54329', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key', NEXT_TELEMETRY_DISABLED: '1' } },
  ],
});
