import { z } from 'zod';

const bucketSchema = z.object({
  bucket: z.string(),
  count: z.number(),
});

export const analyticsResponseSchema = z.object({
  daily: z.array(bucketSchema),
  weekly: z.array(bucketSchema),
  monthly: z.array(bucketSchema),
});

export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
