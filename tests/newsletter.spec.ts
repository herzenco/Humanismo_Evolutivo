import { expect, test, type Response } from '@playwright/test';

const legacy = /leadconnectorhq|LeadConnector|msgsndr|form_embed/i;
for (const path of ['/', '/contacto', '/libros', '/privacidad', '/autor']) {
  test(`built page ${path} has no legacy embed or disabled newsletter form`, async ({ page }) => {
    const scripts: Response[] = [];
    const collectScript = (response: Response) => {
      if (response.request().resourceType() === 'script' && response.url().startsWith('http://127.0.0.1:3100/')) {
        scripts.push(response);
      }
    };
    page.on('response', collectScript);
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    expect(await response?.text()).not.toMatch(legacy);
    expect(response?.headers()['content-security-policy']).not.toMatch(legacy);
    await expect(page.locator('footer form[aria-labelledby="newsletter-title"]')).toHaveCount(0);
    page.off('response', collectScript);
    expect((await Promise.all(scripts.map(script => script.text()))).join('\n')).not.toMatch(legacy);
  });
}
