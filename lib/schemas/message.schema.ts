// lib/schemas/message.schema.ts
import { z } from 'zod';

export const messageUpdateSchema = z.object({
  read: z.boolean(),
});

export type MessageUpdateInput = z.infer<typeof messageUpdateSchema>;
