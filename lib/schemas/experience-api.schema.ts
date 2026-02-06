// lib/schemas/experience-api.schema.ts
import { z } from 'zod';

// Base schema (no refinements)
const experienceApiBaseSchema = z.object({
  // Legacy fields (optional to maintain backward compatibility)
  title: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),

  // New multilingual fields
  title_fr: z.string().optional(),
  title_en: z.string().optional().nullable(),
  description_fr: z.string().optional(),
  description_en: z.string().optional().nullable(),
  achievements_fr: z.array(z.string()).optional(),
  achievements_en: z.array(z.string()).optional().nullable(),

  // Non-translatable fields
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

  technologies: z.array(z.string())
    .min(1, 'Au moins une technologie est requise')
    .max(20),

  order: z.number()
    .int()
    .default(0),
});

// API input schema that accepts both legacy and multilingual fields
export const experienceApiSchema = experienceApiBaseSchema.refine(
  data => {
    // Either French fields OR legacy fields must be present
    const hasFrenchFields = data.title_fr && data.description_fr && data.achievements_fr;
    const hasLegacyFields = data.title && data.description && data.achievements;
    return hasFrenchFields || hasLegacyFields;
  },
  {
    message: "Le titre, la description et les réalisations en français sont requis",
    path: ["title_fr"]
  }
);

export type ExperienceApiInput = z.infer<typeof experienceApiSchema>;

// For updates (all fields optional)
export const experienceApiUpdateSchema = experienceApiBaseSchema.partial();

// Transform function to ensure data consistency
export function normalizeExperienceData(data: ExperienceApiInput) {
  return {
    // Use French fields as defaults for legacy fields if not provided
    title: data.title || data.title_fr || '',
    description: data.description || data.description_fr || '',
    achievements: data.achievements || data.achievements_fr || [],

    // Always use the new multilingual fields
    title_fr: data.title_fr || data.title || '',
    title_en: data.title_en || '',
    description_fr: data.description_fr || data.description || '',
    description_en: data.description_en || '',
    achievements_fr: data.achievements_fr || data.achievements || [],
    achievements_en: data.achievements_en || [],

    // Non-translatable fields
    company: data.company,
    companyUrl: data.companyUrl || null,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate || null,
    current: data.current || false,
    technologies: data.technologies,
    order: data.order || 0,
  };
}