import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Activity, ActivityType } from '@training-insights/shared/data-access';

const activityZonesSchema = z.object({
  zone1Duration: z.number(),
  zone2Duration: z.number(),
  zone3Duration: z.number(),
  zone4Duration: z.number(),
  zone5Duration: z.number(),
});

const lapSchema = z.object({
  startTime: z.date(),
  duration: z.number(),
  distance: z.number().optional(),
  avgHeartRate: z.number().optional(),
  maxHeartRate: z.number().optional(),
  calories: z.number().optional(),
});

export const activityRouter = router({
  getActivity: protectedProcedure
    .input(z.string())
    .query(async ({ input }): Promise<Activity> => {
      // TODO: Implement actual activity fetching
      throw new Error('Not implemented');
    }),

  listActivities: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
      type: z.nativeEnum(ActivityType).optional(),
    }))
    .query(async ({ input }): Promise<{ items: Activity[]; nextCursor?: string }> => {
      // TODO: Implement activity listing
      throw new Error('Not implemented');
    }),

  analyzeActivity: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }): Promise<{ zones: Activity['zones'] }> => {
      // TODO: Implement activity analysis
      throw new Error('Not implemented');
    }),
});