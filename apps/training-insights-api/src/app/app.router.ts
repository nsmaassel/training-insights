import { router } from '../trpc';
import { fileRouter } from './routers/file.router';

export const appRouter = router({
  file: fileRouter,
});

export type AppRouter = typeof appRouter;