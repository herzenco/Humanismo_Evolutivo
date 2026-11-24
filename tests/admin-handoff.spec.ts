import { test, expect } from '@playwright/test';

// Verify the HTTP response without following it into another deployment.
test('legacy admin routes redirect to the standalone app before locale or auth handling', async ({ request }) => {
  for (const path of [
    '/admin', '/admin/', '/admin/dashboard', '/admin/contenido', '/admin/unknown/deep/path',
    '/admin/report.csv', '/es/admin', '/es/admin/imagenes', '/en/admin', '/en/admin/podcasts',
  ]) {
    let response = await request.get(path, { maxRedirects: 0 });
    // Next.js first normalizes trailing slashes, then applies configured redirects.
    if (path.endsWith('/')) {
      expect(response.status()).toBe(308);
      expect(response.headers().location).toBe(path.slice(0, -1));
      response = await request.get(response.headers().location, { maxRedirects: 0 });
    }
    expect(response.status(), path).toBe(308);
    const destination = new URL(response.headers().location, 'http://127.0.0.1:3100');
    expect(destination.origin, path).toBe('https://admin.humanismoevolutivo.com');
    expect(destination.pathname, path).toBe('/');
  }
  const response = await request.get('/admin/contenido?source=website&tab=books', { maxRedirects: 0 });
  const destination = new URL(response.headers().location);
  expect(destination.origin).toBe('https://admin.humanismoevolutivo.com');
  expect(destination.searchParams.get('source')).toBe('website');
  expect(destination.searchParams.get('tab')).toBe('books');
  expect(destination.searchParams.has('path')).toBe(false);
  expect((await request.get('/administration', { maxRedirects: 0 })).status()).toBe(404);
});
