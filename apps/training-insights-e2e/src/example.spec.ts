import { test, expect } from '@playwright/test';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import path from 'path';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain app name
  expect(await page.locator('h1').innerText()).toContain('Training Insights');
});

// Example E2E test using real dependencies
test('activity upload flow', async ({ page }) => {
  // Setup test data directly in the database
  const mongo = (global as any).__MONGO_CLIENT__ as MongoClient;
  const db = mongo.db('test');
  await db.collection('activities').deleteMany({});

  // Test the full flow with real services
  await page.goto('/');
  await page.getByTestId('upload-button').click();
  await page.setInputFiles('input[type="file"]', 'path/to/test.fit');
  
  // Verify data was properly saved
  const activities = await db.collection('activities').find({}).toArray();
  expect(activities).toHaveLength(1);
  expect(activities[0]).toHaveProperty('type', 'running');
});

test('activity analysis with real API', async ({ page }) => {
  // This test demonstrates using real API endpoints
  const response = await axios.post('/api/activities/analyze', {
    activityId: 'test-activity'
  });
  
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('analysis');
});

test('activity analysis without file upload', async ({ page }) => {
  // Test basic page load and UI elements
  await page.goto('/');
  
  // Verify core UI elements
  await expect(page.getByTestId('upload-section')).toBeVisible();
  await expect(page.getByTestId('upload-button')).toBeEnabled();
});

test('activity API health check', async () => {
  try {
    const response = await axios.get('/api/health');
    expect(response.status).toBe(200);
  } catch (err) {
    console.log('API may not be running. Please start the API service first.');
    throw err;
  }
});
