// lib/schemas/volunteer-api.schema.ts
import { z } from 'zod';

// Base schema (no refinements)
const volunteerApiBaseSchema = z.object({
  // Legacy fields (optional to maintain backward compatibility)
  title: z.string().optional(),
  description: z.string().optional(),

  // New multilingual fields
  title_fr: z.string().optional(),
  title_en: z.string().optional().nullable(),
  description_fr: z.string().optional(),
  description_en: z.string().optional().nullable(),

  // Non-translatable fields
  organization: z.string()
    .min(2, 'L\'organisation doit contenir au moins 2 caractères')
    .max(100),

  location: z.string()
    .optional()
    .nullable(),

  startDate: z.coerce.date(),

  endDate: z.coerce.date()
    .optional()
    .nullable(),

  current: z.boolean()
    .default(false),

  order: z.number()
    .int()
    .default(0),
});

// API input schema that accepts both legacy and multilingual fields
export const volunteerApiSchema = volunteerApiBaseSchema.refine(
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

export type VolunteerApiInput = z.infer<typeof volunteerApiSchema>;

// For updates (all fields optional)
export const volunteerApiUpdateSchema = volunteerApiBaseSchema.partial();

// Transform function to ensure data consistency
export function normalizeVolunteerData(data: VolunteerApiInput) {
  return {
    // Use French fields as defaults for legacy fields if not provided
    title: data.title || data.title_fr || '',
    description: data.description || data.description_fr || '',

    // Always use the new multilingual fields
    title_fr: data.title_fr || data.title || '',
    title_en: data.title_en || '',
    description_fr: data.description_fr || data.description || '',
    description_en: data.description_en || '',

    // Non-translatable fields
    organization: data.organization,
    location: data.location || null,
    startDate: data.startDate,
    endDate: data.endDate || null,
    current: data.current || false,
    order: data.order || 0,
  };
}