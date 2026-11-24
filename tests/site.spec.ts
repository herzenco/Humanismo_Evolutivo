import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { books } from '../src/data/books';
import { getBookDownload } from '../src/lib/book-downloads';
import { indexablePaths } from '../src/lib/indexable-paths';
import { SITE_URL, absoluteUrl, localizedPath } from '../src/lib/site';
const fixture = 'http://127.0.0.1:54329';

test('every book has an existing valid PDF for both languages', () => {
  for (const book of books) for (const language of ['es', 'en'] as const) {
    const download = getBookDownload(book.id, language);
    expect(readFileSync(`public/books/${download.file}`).subarray(0, 5).toString()).toBe('%PDF-');
  }
  expect(getBookDownload('lo-mejor-esta-por-venir', 'en').language).toBe('es');
  expect(localizedPath('/en/libros?q=book#download', 'es')).toBe('/libros?q=book#download');
});

test('every indexable URL serves unique metadata, correct canonicals and language alternates', async ({ request }) => {
  const canonicals = new Set<string>();
  for (const language of ['es', 'en'] as const) for (const path of indexablePaths()) {
    const response = await request.get(localizedPath(path, language));
    expect(response.status(), `${language}:${path}`).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<html lang="${language}"`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, `${language}:${path}`).toBe(absoluteUrl(path, language));
    expect(canonicals.has(canonical!)).toBe(false); canonicals.add(canonical!);
    expect(html).toContain('hrefLang="es"');
    expect(html).toContain('hrefLang="en"');
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/);
    expect(html).toMatch(/<meta property="og:image" content="https?:/);
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    expect(ogUrl).toBe(canonical);
    for (const json of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) expect(() => JSON.parse(json[1])).not.toThrow();
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect((sitemap.match(/<loc>/g) || []).length).toBe(canonicals.size);
  expect(sitemap).not.toContain('yosoynosotros.');
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

test('missing resources return HTTP 404 and utility pages are not indexable', async ({ request }) => {
  for (const path of ['/libros/missing', '/eventos/missing', '/medios/show/missing', '/medios/missing/missing', '/video/1junk', '/en/libros/missing', '/missing']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  for (const path of ['/auth', '/buscar?q=test', '/en/auth', '/en/buscar?q=test']) {
    expect(await (await request.get(path)).text()).toMatch(/name="robots" content="noindex/);
  }
  const admin = await request.get('/admin', { maxRedirects: 0 });
  expect(admin.status()).toBe(308); expect(new URL(admin.headers().location).origin).toBe('https://admin.humanismoevolutivo.com');
  const es = await request.get('/es/libros?source=test', { maxRedirects: 0 });
  expect(es.status()).toBe(308); expect(es.headers().location).toContain('/libros?source=test');
});

test('old language preferences do not break hydration and language navigation preserves the page', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('language', 'en'));
  await page.goto('/libros?source=test#library');
  await expect(page.locator('html')).toHaveAttribute('lang','es');
  await page.getByRole('button', { name: 'Toggle language' }).first().click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/libros\?source=test#library/);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('header a[href="/en/autor"]').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('library download succeeds for the previously broken book without analytics PII', async ({ page, request }) => {
  await page.addInitScript(() => { window.dataLayer = []; });
  await page.goto('/libros');
  const bookLink = page.locator('a[href="/libros/lo-mejor-esta-por-venir"]').filter({ hasText: /Explor/ }).first();
  await bookLink.locator('..').getByRole('button').click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('input[type="text"]').fill('Test Reader');
  await dialog.locator('input[type="email"]').fill('reader@example.test');
  const downloadPromise = page.waitForEvent('download');
  await dialog.locator('button[type="submit"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('venir');
  const state = await (await request.get(`${fixture}/test/state`)).json();
  expect(state.book_downloads.at(-1).book_downloaded).toContain('venir');
  const analytics = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(analytics).not.toContain('reader@example.test'); expect(analytics).not.toContain('Test Reader');
});

test('failed download registration never reports success or triggers a file', async ({ page, request }) => {
  await request.post(`${fixture}/test/fail-downloads`, { data: { fail: true } });
  let downloads = 0; page.on('download', () => downloads++);
  await page.goto('/libros/lo-mejor-esta-por-venir');
  await page.getByRole('button', { name: 'Descargar Libro', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('input[type="text"]').fill('Test Reader'); await dialog.locator('input[type="email"]').fill('reader@example.test');
  await dialog.locator('button[type="submit"]').click();
  await expect(page.getByText('No se pudo descargar', { exact: true })).toBeVisible();
  await expect(dialog.locator('form')).toBeVisible(); expect(downloads).toBe(0);
  await request.post(`${fixture}/test/fail-downloads`, { data: { fail: false } });
});

