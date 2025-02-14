import '@testing-library/jest-dom';
import { createTRPCMsw } from 'msw-trpc';
import { setupServer } from 'msw/node';
import type { AppRouter } from '@training-insights/shared/trpc';

// Add any global test setup here
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const trpcMsw = createTRPCMsw<AppRouter>();

// Set up handlers
const handlers = [
  trpcMsw.fileUpload.uploadFile.mutation((req, res, ctx) => {
    return {
      id: 'test-upload-id',
      fileName: 'test.fit',
      uploadDate: new Date(),
      status: 'COMPLETED'
    };
  }),
  
  trpcMsw.fileUpload.getUploadStatus.query((req, res, ctx) => {
    return {
      id: req.input,
      fileName: 'test.fit',
      uploadDate: new Date(),
      status: 'COMPLETED'
    };
  })
];

export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());