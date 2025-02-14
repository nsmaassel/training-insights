import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@training-insights/shared/trpc';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_TRPC_ENDPOINT || 'http://localhost:3000/trpc';
  }
  return 'http://localhost:3000/trpc';
};

export const trpcClient = createTRPCReact<AppRouter>();

export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: getBaseUrl(),
      // You can pass any HTTP headers you wish here
      headers() {
        return {};
      },
    }),
  ],
};