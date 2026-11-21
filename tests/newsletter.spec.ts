import { expect, test } from '@playwright/test';

const legacy = /leadconnectorhq|LeadConnector|msgsndr|form_embed/i;
for (const path of ['/', '/contacto', '/libros', '/privacidad', '/autor']) {
  test(`built page ${path} has no legacy embed or disabled newsletter form`, async ({ page }) => {
    const scripts: Promise<string>[] = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'script' && response.url().startsWith('http://127.0.0.1:3100/')) {
        scripts.push(response.text());
      }
    });
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    expect(await response?.text()).not.toMatch(legacy);
    expect(response?.headers()['content-security-policy']).not.toMatch(legacy);
    expect((await Promise.all(scripts)).join('\n')).not.toMatch(legacy);
    await expect(page.locator('footer form[aria-labelledby="newsletter-title"]')).toHaveCount(0);
  });
}
