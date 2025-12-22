// lib/schemas/experience.schema.ts
import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(100),

  company: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100),

  companyUrl: z.string()
    .url('URL invalide')
    .optional()
    .nullable(),

  location: z.string()
    .min(2, 'La localisation doit contenir au moins 2 caractères')
    .max(100),

  startDate: z.coerce.date(),

  endDate: z.coerce.date()
    .optional()
    .nullable(),

  current: z.boolean()
    .default(false),

  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000),

  achievements: z.array(z.string())
    .min(1, 'Au moins une réalisation est requise')
    .max(15),

  technologies: z.array(z.string())
    .min(1, 'Au moins une technologie est requise')
    .max(20),

  order: z.number()
    .int()
    .default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
export const experienceUpdateSchema = experienceSchema.partial();
