import { test as base } from '@playwright/test';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@training-insights/shared/trpc';
import { Activity, ActivityType } from '@training-insights/shared/data-access';

// Extend basic test fixture with app-specific functionality
export type TestFixtures = {
  loginAsUser: () => Promise<void>;
};

const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Declare the fixtures
export const test = base.extend<TestFixtures>({
  loginAsUser: async ({ page }, use) => {
    const login = async () => {
      await page.goto('/');
    };
    await use(login);
  },
});

export const testActivity: Activity = {
  id: 'test-activity-1',
  uploadedFileId: 'test-file-1',
  startTime: new Date('2024-01-01T10:00:00Z'),
  endTime: new Date('2024-01-01T11:00:00Z'),
  type: ActivityType.RUN,
  duration: 3600,
  distance: 10000,
  avgHeartRate: 145,
  maxHeartRate: 175,
  calories: 750,
  zones: {
    zone1Duration: 600,
    zone2Duration: 1200,
    zone3Duration: 1200,
    zone4Duration: 480,
    zone5Duration: 120
  },
  laps: [{
    startTime: new Date('2024-01-01T10:00:00Z'),
    duration: 3600,
    distance: 10000,
    avgHeartRate: 145,
    maxHeartRate: 175,
    calories: 750
  }]
};

export const testDeviceInfo = {
  manufacturer: 'Garmin',
  product: 'Forerunner 255',
  serialNumber: 'TEST123'
};

export { expect } from '@playwright/test';