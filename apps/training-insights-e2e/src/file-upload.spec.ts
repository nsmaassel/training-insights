import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

test.describe('File Upload Flow', () => {
  test('should upload a FIT file successfully', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/upload');
    
    // Verify we're on the upload page
    await expect(page.getByText('Upload Training Data')).toBeVisible();

    // Setup file input handler
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload or drag and drop').click();
    const fileChooser = await fileChooserPromise;

    // Upload the file
    const testFilePath = join(__dirname, '../fixtures/sample.fit');
    await fileChooser.setFiles([testFilePath]);

    // Verify success toast appears
    await expect(page.getByText('Upload Complete')).toBeVisible({ timeout: 5000 });

    // Verify file appears in the list (if we implement this feature later)
    // await expect(page.getByText('sample.fit')).toBeVisible();
  });

  test('should show error toast for invalid files', async ({ page }) => {
    await page.goto('/upload');

    // Setup file input handler
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload or drag and drop').click();
    const fileChooser = await fileChooserPromise;

    // Try to upload an invalid file
    await fileChooser.setFiles([{
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid file content')
    }]);

    // Verify error toast appears
    await expect(page.getByText('Upload Failed')).toBeVisible({ timeout: 5000 });
  });
});