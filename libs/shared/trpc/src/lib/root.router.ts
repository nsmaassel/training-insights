import { router } from './trpc';
import { activityRouter } from './routers/activity.router';
import { fileUploadRouter } from './routers/file-upload.router';

export const appRouter = router({
  activity: activityRouter,
  fileUpload: fileUploadRouter,
});

export type AppRouter = typeof appRouter;