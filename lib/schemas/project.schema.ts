// lib/schemas/project.schema.ts
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),

  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),

  longDesc: z.string()
    .max(5000, 'La description longue ne peut pas dépasser 5000 caractères')
    .optional()
    .nullable(),

  technologies: z.array(z.string())
    .min(1, 'Au moins une technologie est requise')
    .max(20, 'Maximum 20 technologies'),

  imageUrl: z.string()
    .url('URL d\'image invalide')
    .optional()
    .nullable(),

  demoUrl: z.string()
    .url('URL de démo invalide')
    .optional()
    .nullable(),

  githubUrl: z.string()
    .url('URL GitHub invalide')
    .optional()
    .nullable(),

  featured: z.boolean()
    .default(false),

  order: z.number()
    .int('L\'ordre doit être un nombre entier')
    .default(0),

  startDate: z.coerce.date()
    .optional()
    .nullable(),

  endDate: z.coerce.date()
    .optional()
    .nullable(),

  organization: z.string()
    .max(100)
    .optional()
    .nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// For updates (all fields optional)
export const projectUpdateSchema = projectSchema.partial();
