// lib/schemas/project-api.schema.ts
import { z } from 'zod';

// Base schema (no refinements)
const projectApiBaseSchema = z.object({
  // Legacy fields (optional to maintain backward compatibility)
  title: z.string().optional(),
  description: z.string().optional(),
  longDesc: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),

  // New multilingual fields
  title_fr: z.string().optional(),
  title_en: z.string().optional().nullable(),
  description_fr: z.string().optional(),
  description_en: z.string().optional().nullable(),
  longDesc_fr: z.string().optional().nullable(),
  longDesc_en: z.string().optional().nullable(),
  organization_fr: z.string().optional().nullable(),
  organization_en: z.string().optional().nullable(),

  // Non-translatable fields
  technologies: z.array(z.string())
    .min(1, 'Au moins une technologie est requise'),

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
});

// API input schema that accepts both legacy and multilingual fields
export const projectApiSchema = projectApiBaseSchema.refine(
  data => {
    // Either French fields OR legacy fields must be present
    const hasFrenchFields = data.title_fr && data.description_fr;
    const hasLegacyFields = data.title && data.description;
    return hasFrenchFields || hasLegacyFields;
  },
  {
    message: "Le titre et la description en français sont requis",
    path: ["title_fr"]
  }
);

export type ProjectApiInput = z.infer<typeof projectApiSchema>;

// For updates (all fields optional)
export const projectApiUpdateSchema = projectApiBaseSchema.partial();

// Transform function to ensure data consistency
export function normalizeProjectData(data: ProjectApiInput) {
  return {
    // Use French fields as defaults for legacy fields if not provided
    title: data.title || data.title_fr || '',
    description: data.description || data.description_fr || '',
    longDesc: data.longDesc !== undefined ? data.longDesc : (data.longDesc_fr || null),
    organization: data.organization !== undefined ? data.organization : (data.organization_fr || null),

    // Always use the new multilingual fields
    title_fr: data.title_fr || data.title || '',
    title_en: data.title_en || null,
    description_fr: data.description_fr || data.description || '',
    description_en: data.description_en || null,
    longDesc_fr: data.longDesc_fr !== undefined ? data.longDesc_fr : (data.longDesc || null),
    longDesc_en: data.longDesc_en || null,
    organization_fr: data.organization_fr !== undefined ? data.organization_fr : (data.organization || null),
    organization_en: data.organization_en || null,

    // Non-translatable fields
    technologies: data.technologies,
    imageUrl: data.imageUrl || null,
    demoUrl: data.demoUrl || null,
    githubUrl: data.githubUrl || null,
    featured: data.featured || false,
    order: data.order || 0,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
  };
}