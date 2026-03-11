import { test, expect } from '@playwright/test';

test.describe('Discover page', () => {
  test('shows UnlockGate when not unlocked', async ({ page }) => {
    await page.goto('/discover');

    await expect(page.locator('h1, h2')).toContainText(/See what YouTube|recommends|Share yours first/i);
  });

  test('shows feed when unlocked', async ({ page, context }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'https://feedlens.vercel.app';
    await context.addCookies([
      {
        name: 'feedlens_unlocked',
        value: '1',
        url: baseURL,
      },
    ]);
    await page.goto('/discover');

    await expect(page.locator('h1')).toContainText(/Discover/i);
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
