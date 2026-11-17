import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { books } from '../src/data/books';
import { homeVideos } from '../src/config/home-videos';
import { getBookDownload } from '../src/lib/book-downloads';
import { indexablePaths } from '../src/lib/indexable-paths';
import { EN_ENABLED, PORTAL_ENABLED } from '../src/lib/release-flags';
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
  const languages = EN_ENABLED ? ['es', 'en'] as const : ['es'] as const;
  for (const language of languages) for (const path of indexablePaths()) {
    const response = await request.get(localizedPath(path, language));
    expect(response.status(), `${language}:${path}`).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<html lang="${language}"`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, `${language}:${path}`).toBe(absoluteUrl(path, language));
    expect(canonicals.has(canonical!)).toBe(false); canonicals.add(canonical!);
    expect(html).toContain('hrefLang="es"');
    if (EN_ENABLED) expect(html).toContain('hrefLang="en"');
    else expect(html).not.toContain('hrefLang="en"');
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/);
    expect(html).toMatch(/<meta property="og:image" content="https?:/);
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    expect(ogUrl).toBe(canonical);
    for (const json of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) expect(() => JSON.parse(json[1])).not.toThrow();
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  if (EN_ENABLED) expect((sitemap.match(/<loc>/g) || []).length).toBe(canonicals.size);
  else {
    expect(sitemap).not.toMatch(/humanismoevolutivo\.com\/en(?:\/|<|")/);
    expect(sitemap).not.toContain('/portal');
    expect(sitemap).not.toContain('/auth');
    for (const canonical of canonicals) expect(sitemap).toContain(`<loc>${canonical}</loc>`);
  }
  expect(sitemap).not.toContain('yosoynosotros.');
  expect(sitemap).not.toContain('biografia-mcm');
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

test('missing resources return HTTP 404 and utility pages are not indexable', async ({ request }) => {
  const missing = ['/libros/missing', '/libros/biografia-mcm', '/eventos/missing', '/medios/show/missing', '/medios/missing/missing', '/video/1junk', '/missing'];
  if (EN_ENABLED) missing.push('/en/libros/missing');
  for (const path of missing) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  if (!EN_ENABLED) {
    const home = await request.get('/en', { maxRedirects: 0 });
    expect(home.status()).toBe(308);
    expect(new URL(home.headers().location, 'http://127.0.0.1').pathname).toBe('/');
    const book = await request.get('/en/libros/x', { maxRedirects: 0 });
    expect(book.status()).toBe(308);
    expect(new URL(book.headers().location, 'http://127.0.0.1').pathname).toBe('/libros/x');
  }
  const utility = EN_ENABLED ? ['/auth', '/buscar?q=test', '/en/auth', '/en/buscar?q=test'] : ['/buscar?q=test'];
  for (const path of utility) {
    expect(await (await request.get(path)).text()).toMatch(/name="robots" content="noindex/);
  }
  if (!PORTAL_ENABLED) {
    for (const path of ['/portal', '/portal/cursos/x', '/auth', '/auth/callback']) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(404);
      expect(response.headers()['x-robots-tag']).toBe('noindex');
    }
  }
  const admin = await request.get('/admin', { maxRedirects: 0 });
  expect(admin.status()).toBe(308); expect(new URL(admin.headers().location).origin).toBe('https://admin.humanismoevolutivo.com');
  const es = await request.get('/es/libros?source=test', { maxRedirects: 0 });
  expect(es.status()).toBe(308); expect(es.headers().location).toContain('/libros?source=test');
});

test('public pages keep browser safeguards and link out to education', async ({ page, request }) => {
  for (const path of ['/', '/libros/yo-soy-nosotros', '/contacto']) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  }

  const portal = 'https://educacion.humanismoevolutivo.com/portal';
  const signup = 'https://educacion.humanismoevolutivo.com/auth?mode=signup';
  await page.goto('/');
  const desktopPortal = page.locator('header').getByRole('link', { name: 'Portal educativo' });
  await expect(desktopPortal).toBeVisible();
  await expect(desktopPortal).toHaveAttribute('href', portal);
  await expect(page.locator('footer').getByRole('link', { name: 'Portal educativo' })).toHaveAttribute('href', portal);
  await expect(page.locator('footer').getByRole('link', { name: 'Únete a la comunidad' })).toHaveAttribute('href', signup);
  await expect(page.getByRole('link', { name: /Únete al Club de Amigos que Evolucionan/i })).toHaveAttribute('href', '#s8');
  await expect(page.locator('#s8').getByRole('link', { name: 'Únete al club' })).toHaveAttribute('href', signup);
  await expect(page.locator('#s8').getByRole('link', { name: 'Ya soy miembro · Entrar al portal' })).toHaveAttribute('href', portal);
  await expect(page.locator('#portal').getByRole('link', { name: 'Entrar al portal' })).toHaveAttribute('href', portal);

  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole('button', { name: 'Abrir menú' });
  await menu.click();
  const mobilePortal = page.locator('#site-mobile-nav').getByRole('link', { name: 'Portal educativo' });
  await expect(mobilePortal).toBeVisible();
  await expect(mobilePortal).toHaveAttribute('href', portal);
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
});

test('first visit opens the welcome video, and Escape restores focus before the next visit', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /saltar/i });
  await expect(skipLink).toBeFocused();

  const dialog = page.getByRole('dialog', { name: 'Bienvenido a Parque Cancún' });
  await expect(dialog).toHaveCount(0);
  await page.clock.fastForward(5_000);
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Cerrar' });
  await expect(close).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  const video = dialog.locator('video');
  await expect(video).toHaveJSProperty('autoplay', false);
  await expect(video).toHaveJSProperty('paused', true);
  await expect(video).toHaveJSProperty('controls', true);
  await expect.poll(() => page.evaluate(
    (id) => localStorage.getItem(`welcomeVideoSeen:${id}`),
    homeVideos.introduction.id,
  )).toBe('true');

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(skipLink).toBeFocused();
  await page.reload();
  await page.clock.fastForward(5_001);
  await expect(dialog).toHaveCount(0);
});

test('home controls retain names from their visible content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header .site-brand')).toHaveAccessibleName('Humanismo Evolutivo Transpersonal');
  await expect(page.locator('header .site-brand-logo')).toHaveAccessibleName('Humanismo Evolutivo Transpersonal');
  await expect(page.getByRole('button', { name: /Conoce a los tres filósofos/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver el video de los tres filósofos' })).toBeVisible();
  await expect(page.locator('button.he-abf7b48b8')).toHaveAccessibleName(/documental.*Parque Cancún/i);
  await expect(page.locator('img.he-documentary-poster')).toHaveAccessibleName('Parque Cancún');
  await expect(page.locator('a[href*="biografia-mcm"]')).toHaveCount(0);
  await page.goto('/libros');
  await expect(page.getByText('Biografía MCM', { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href*="biografia-mcm"]')).toHaveCount(0);
});

test('old language preferences do not break hydration and language navigation preserves the page', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('language', 'en'));
  await page.goto('/libros?source=test#library');
  await expect(page.locator('html')).toHaveAttribute('lang','es');
  if (!EN_ENABLED) {
    await expect(page.locator('.site-language-toggle')).toHaveCount(0);
    await expect(page.locator('a[href="/portal"], a[href^="/auth"]')).toHaveCount(0);
    expect(errors).toEqual([]);
    return;
  }
  await page.getByRole('button', { name: 'Toggle language' }).first().click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/libros\?source=test#library/);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('header a[href="/en/autor"]').first()).toBeVisible();
  expect(errors).toEqual([]);
});

for (const path of ['/libros', '/libros/lo-mejor-esta-por-venir']) {
  test(`${path} downloads the book and omits personal data from analytics`, async ({ page, request }) => {
    await page.goto(path);
    if (path === '/libros') {
      const bookLink = page.locator('a[href="/libros/lo-mejor-esta-por-venir"]').filter({ hasText: /Explor/ }).first();
      await bookLink.locator('..').getByRole('button').click();
    } else {
      await page.getByRole('button', { name: 'Descargar Libro', exact: true }).click();
    }
    const dialog = page.getByRole('dialog');
    await dialog.locator('input[type="text"]').fill('Test Reader');
    await dialog.locator('input[type="email"]').fill('reader@example.test');
    if (path !== '/libros') await page.evaluate(() => { Reflect.deleteProperty(window, 'dataLayer'); });
    const downloadPromise = page.waitForEvent('download');
    await dialog.locator('button[type="submit"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('venir');
    const state = await (await request.get(`${fixture}/test/state`)).json();
    expect(state.book_downloads.at(-1).book_downloaded).toContain('venir');
    const analytics = await page.evaluate(() => JSON.stringify(window.dataLayer ?? []));
    if (path !== '/libros') expect(analytics).toContain('book_download_form_submit');
    expect(analytics).not.toContain('reader@example.test');
    expect(analytics).not.toContain('Test Reader');
  });
}

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

