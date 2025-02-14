import { test, expect } from './fixtures';

test('home page shows welcome message and upload section', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByRole('heading', { name: /Training Insights/i })).toBeVisible();
  await expect(page.getByText(/Upload your training data/i)).toBeVisible();
  await expect(page.locator('label[for="file-upload"]')).toBeVisible();
});

test('file upload interaction shows selected file', async ({ page }) => {
  await page.goto('/');

  // Create a test file and set up file input
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test.fit',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('dummy content'),
  });

  // Verify the selected file name is displayed
  await expect(page.getByText(/Selected file: test.fit/i)).toBeVisible();
});