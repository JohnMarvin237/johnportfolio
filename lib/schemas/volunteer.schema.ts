// lib/schemas/volunteer.schema.ts
import { z } from 'zod';

export const volunteerSchema = z.object({
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(150),

  organization: z.string()
    .min(2, "L'organisation doit contenir au moins 2 caractères")
    .max(150),

  location: z.string()
    .max(100)
    .optional()
    .nullable(),

  startDate: z.coerce.date(),

  endDate: z.coerce.date()
    .optional()
    .nullable(),

  current: z.boolean()
    .default(false),

  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000),

  order: z.number()
    .int()
    .default(0),

  // i18n fields
  title_fr: z.string().max(150).optional().nullable(),
  title_en: z.string().max(150).optional().nullable(),
  description_fr: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
});

export type VolunteerInput = z.infer<typeof volunteerSchema>;
export const volunteerUpdateSchema = volunteerSchema.partial();
