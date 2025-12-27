// lib/schemas/project-bilingual.schema.ts
import { z } from 'zod';

// Form input schema for bilingual content
export const projectBilingualFormSchema = z.object({
  // French fields (required)
  title_fr: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),

  description_fr: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),

  longDesc_fr: z.string()
    .max(5000, 'La description longue ne peut pas dépasser 5000 caractères')
    .optional(),

  organization_fr: z.string()
    .max(100)
    .optional(),

  // English fields (optional but recommended)
  title_en: z.string()
    .max(100)
    .optional(),

  description_en: z.string()
    .max(500)
    .optional(),

  longDesc_en: z.string()
    .max(5000)
    .optional(),

  organization_en: z.string()
    .max(100)
    .optional(),

  // Non-translatable fields
  technologies: z.string()
    .min(1, 'Au moins une technologie est requise'), // Will be converted to array

  imageUrl: z.string()
    .url('URL d\'image invalide')
    .optional()
    .or(z.literal('')),

  demoUrl: z.string()
    .url('URL de démo invalide')
    .optional()
    .or(z.literal('')),

  githubUrl: z.string()
    .url('URL GitHub invalide')
    .optional()
    .or(z.literal('')),

  featured: z.boolean()
    .optional()
    .default(false),

  order: z.union([z.string(), z.number()])
    .optional(),

  startDate: z.string()
    .optional(),

  endDate: z.string()
    .optional(),
});

export type ProjectBilingualFormData = z.infer<typeof projectBilingualFormSchema>;

// Transform form data to API format
export function transformProjectFormData(data: ProjectBilingualFormData) {
  // For backward compatibility, use French as default values for legacy fields
  return {
    // Legacy fields (will be removed later)
    title: data.title_fr,
    description: data.description_fr,
    longDesc: data.longDesc_fr,
    organization: data.organization_fr,

    // New multilingual fields
    title_fr: data.title_fr,
    title_en: data.title_en || null,
    description_fr: data.description_fr,
    description_en: data.description_en || null,
    longDesc_fr: data.longDesc_fr || null,
    longDesc_en: data.longDesc_en || null,
    organization_fr: data.organization_fr || null,
    organization_en: data.organization_en || null,

    // Non-translatable fields
    technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
    imageUrl: data.imageUrl || null,
    demoUrl: data.demoUrl || null,
    githubUrl: data.githubUrl || null,
    featured: data.featured || false,
    order: data.order ? Number(data.order) : 0,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
  };
}

// For updates (all fields optional)
export const projectBilingualUpdateSchema = projectBilingualFormSchema.partial();