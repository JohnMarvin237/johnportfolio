// lib/schemas/education.schema.ts
import { z } from 'zod';

export const educationSchema = z.object({
  degree: z.string()
    .min(2, 'Le diplôme doit contenir au moins 2 caractères')
    .max(150),

  institution: z.string()
    .min(2, 'L\'institution doit contenir au moins 2 caractères')
    .max(150),

  location: z.string()
    .min(2, 'La localisation doit contenir au moins 2 caractères')
    .max(100),

  field: z.string()
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
    .max(1000)
    .optional()
    .nullable(),

  gpa: z.string()
    .max(20)
    .optional()
    .nullable(),

  note: z.string()
    .max(200)
    .optional()
    .nullable(),

  order: z.number()
    .int()
    .default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;
export const educationUpdateSchema = educationSchema.partial();
