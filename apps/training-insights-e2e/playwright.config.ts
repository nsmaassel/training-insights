import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';
import axios from 'axios';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:4300';
const apiURL = process.env['API_URL'] || 'http://localhost:3000';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Helper to check if API is ready
async function waitForAPI(url: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(`${url}/api/health`);
      if (response.status === 200) return true;
    } catch (e) {
      console.log(`Waiting for API... (attempt ${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // Add custom test attributes
    testIdAttribute: 'data-testid',
    // Increase timeouts for network requests
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'nx serve training-insights-api',
      url: `${apiURL}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000, // Increase timeout to 2 minutes
      cwd: workspaceRoot,
      env: {
        NODE_ENV: 'test',
        MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/test'
      }
    },
    {
      command: 'nx serve training-insights',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120000, // Increase timeout to 2 minutes
      cwd: workspaceRoot,
      env: {
        NODE_ENV: 'test',
        VITE_API_URL: apiURL,
        VITE_TRPC_ENDPOINT: `${apiURL}/trpc`
      }
    }
  ],
  globalSetup: async () => {
    // Ensure API is available before running tests
    if (!await waitForAPI(apiURL)) {
      throw new Error('API failed to start');
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  // Increase overall timeout
  timeout: 180000,
  // Add retries for flaky tests
  retries: process.env.CI ? 2 : 0,
  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});
