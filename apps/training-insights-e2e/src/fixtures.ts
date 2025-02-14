import { test as base } from '@playwright/test';

// Extend basic test fixture with app-specific functionality
export type TestFixtures = {
  // Add custom fixtures here as needed
  loginAsUser: () => Promise<void>;
};

// Declare the fixtures
export const test = base.extend<TestFixtures>({
  loginAsUser: async ({ page }, use) => {
    const login = async () => {
      // TODO: Implement login flow when auth is added
      await page.goto('/');
    };
    await use(login);
  },
});

export { expect } from '@playwright/test';