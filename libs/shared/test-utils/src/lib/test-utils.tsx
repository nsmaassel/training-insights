import { render, RenderOptions } from '@testing-library/react';
import { type PropsWithChildren, type ReactElement } from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@training-insights/shared/trpc';

// Real query client for tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Real tRPC client that connects to the test server
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.API_URL || 'http://localhost:3000/trpc',
    }),
  ],
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  useRealTrpc?: boolean;
}

// Provider wrapper that uses real dependencies by default
const AllTheProviders = ({ 
  children,
  useRealTrpc = true 
}: PropsWithChildren<{ useRealTrpc?: boolean }>) => {
  // Always use real Query Client
  return (
    <QueryClientProvider client={queryClient}>
      {useRealTrpc ? (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {children}
        </trpc.Provider>
      ) : (
        children
      )}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) => render(ui, { 
  wrapper: (props) => AllTheProviders({ ...props, useRealTrpc: options?.useRealTrpc }), 
  ...options 
});

// Adding FIT file generation utility
export const generateTestFitFile = async (filePath: string) => {
  // For now, create a minimal binary file that matches FIT file header format
  // This is enough to test the upload flow - we can enhance this later with actual FIT protocol
  const header = Buffer.from([
    0x0E, // Header size
    0x10, // Protocol version 1.0
    0x2E, // Profile version 2.14
    0x00, 0x00, 0x00, 0x00, // Data size (placeholder)
    0x2E, 0x46, 0x49, 0x54, // .FIT signature
    0x00, // CRC
    0x00  // CRC
  ]);

  await require('fs').promises.writeFile(filePath, header);
};

export * from '@testing-library/react';
export * from '@testing-library/jest-dom';
export { customRender as render };
export { queryClient, trpcClient };
