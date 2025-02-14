import { test, expect } from './fixtures';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain app name
  expect(await page.locator('h1').innerText()).toContain('Training Insights');
});
