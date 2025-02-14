import '@testing-library/jest-dom';

// Add any global test setup here
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};