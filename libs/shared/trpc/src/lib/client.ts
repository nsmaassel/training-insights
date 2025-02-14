import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@training-insights/training-insights-api';

const baseUrl = process.env.API_URL || 'http://localhost:3000/trpc';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: baseUrl,
    }),
  ],
});