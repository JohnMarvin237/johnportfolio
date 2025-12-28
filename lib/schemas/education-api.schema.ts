// lib/schemas/education-api.schema.ts
import { z } from 'zod';

// API input schema that accepts both legacy and multilingual fields
export const educationApiSchema = z.object({
  // Legacy fields (optional to maintain backward compatibility)
  degree: z.string().optional(),
  field: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  note: z.string().optional().nullable(),

  // New multilingual fields
  degree_fr: z.string().optional(),
  degree_en: z.string().optional().nullable(),
  field_fr: z.string().optional().nullable(),
  field_en: z.string().optional().nullable(),
  description_fr: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  note_fr: z.string().optional().nullable(),
  note_en: z.string().optional().nullable(),

  // Non-translatable fields
  institution: z.string()
    .min(2, 'Le nom de l\'institution doit contenir au moins 2 caractères')
    .max(100),

  location: z.string()
    .min(2, 'La localisation doit contenir au moins 2 caractères')
    .max(100),

  startDate: z.coerce.date(),

  endDate: z.coerce.date()
    .optional()
    .nullable(),

  current: z.boolean()
    .default(false),

  order: z.number()
    .int()
    .default(0),
}).refine(
  data => {
    // Either French fields OR legacy fields must be present
    const hasFrenchFields = data.degree_fr;
    const hasLegacyFields = data.degree;
    return hasFrenchFields || hasLegacyFields;
  },
  {
    message: "Le diplôme en français est requis",
    path: ["degree_fr"]
  }
);

export type EducationApiInput = z.infer<typeof educationApiSchema>;

// For updates (all fields optional)
export const educationApiUpdateSchema = educationApiSchema
  .omit({
    institution: true,
    location: true,
    current: true,
    order: true
  })
  .extend({
    institution: z.string().min(2).max(100).optional(),
    location: z.string().min(2).max(100).optional(),
    current: z.boolean().optional(),
    order: z.number().int().optional(),
  });

// Transform function to ensure data consistency
export function normalizeEducationData(data: EducationApiInput) {
  return {
    // Use French fields as defaults for legacy fields if not provided
    degree: data.degree || data.degree_fr || '',
    field: data.field !== undefined ? data.field : (data.field_fr || null),
    description: data.description !== undefined ? data.description : (data.description_fr || null),
    note: data.note !== undefined ? data.note : (data.note_fr || null),

    // Always use the new multilingual fields
    degree_fr: data.degree_fr || data.degree || '',
    degree_en: data.degree_en || '',
    field_fr: data.field_fr !== undefined ? data.field_fr : (data.field || null),
    field_en: data.field_en || null,
    description_fr: data.description_fr !== undefined ? data.description_fr : (data.description || null),
    description_en: data.description_en || null,
    note_fr: data.note_fr !== undefined ? data.note_fr : (data.note || null),
    note_en: data.note_en || null,

    // Non-translatable fields
    institution: data.institution,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate || null,
    current: data.current || false,
    order: data.order || 0,
  };
}