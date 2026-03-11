import { test, expect } from '@playwright/test';

test.describe('Snapshot page', () => {
  test('returns 404 for non-existent snapshot', async ({ page }) => {
    const res = await page.goto('/snapshot/00000000-0000-0000-0000-000000000000');
    expect(res?.status()).toBe(404);
  });

  test('shows not-found content for invalid ID', async ({ page }) => {
    await page.goto('/snapshot/00000000-0000-0000-0000-000000000000');

    await expect(page.locator('body')).toContainText(/not found|404|doesn't exist|removed/i);
  });
});
