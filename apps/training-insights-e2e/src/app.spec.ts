import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';
import { testActivity } from './fixtures';
import path from 'path';

test('handles basic file upload flow', async ({ page }) => {
  const mongo = (global as any).__MONGO_CLIENT__ as MongoClient;
  const db = mongo.db('test');
  
  await page.goto('/');
  await expect(page.getByTestId('app-container')).toBeVisible();

  // Create a test FIT file
  const testFilePath = path.join(__dirname, 'fixtures', 'test.fit');
  await page.setInputFiles('[data-testid="file-input"]', testFilePath);

  // Check file selection
  await expect(page.getByTestId('selected-file')).toContainText('test.fit');
  
  // Check upload status appears
  await expect(page.getByTestId('upload-status')).toBeVisible();
  
  // Wait for upload to complete and verify in database
  await expect(page.getByTestId('upload-complete')).toBeVisible();
  
  const activities = await db.collection('activities').find({}).toArray();
  expect(activities).toHaveLength(1);
  expect(activities[0].type).toBe(testActivity.type);
});

test('shows error message on upload failure', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('app-container')).toBeVisible();

  // Use an invalid file to trigger a real error
  await page.setInputFiles('[data-testid="file-input"]', {
    name: 'invalid.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not a FIT file')
  });

  // Verify error appears
  await expect(page.getByTestId('upload-error')).toBeVisible();
  await expect(page.getByTestId('upload-error')).toContainText('Invalid file format');
});