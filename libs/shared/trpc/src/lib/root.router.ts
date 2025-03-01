import { router } from '../trpc';
import { fileRouter } from './routers/file.router';
import { createTRPCContext } from '@training-insights/shared/trpc';

export const appRouter = router({
  file: fileRouter,
});

export type AppRouter = typeof appRouter;