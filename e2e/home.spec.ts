import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows main content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText(/Stuck in the same|YouTube/i);
    await expect(page.getByRole('link', { name: /Discover/i }).first()).toBeVisible();
  });

  test('has link to Discover', async ({ page }) => {
    await page.goto('/');

    const discoverLink = page.getByRole('link', { name: /Open Discover|Discover/i }).first();
    await expect(discoverLink).toHaveAttribute('href', '/discover');
  });

  test('has link to GitHub', async ({ page }) => {
    await page.goto('/');

    const githubLink = page.getByRole('link', { name: /GitHub|View on GitHub/i });
    await expect(githubLink).toHaveAttribute('href', /github\.com/);
  });
});
