// lib/schemas/certification-api.schema.ts
import { z } from 'zod';

// API input schema that accepts both legacy and multilingual fields
export const certificationApiSchema = z.object({
  // Legacy fields (optional to maintain backward compatibility)
  title: z.string().optional(),
  description: z.string().optional().nullable(),

  // New multilingual fields
  title_fr: z.string().optional(),
  title_en: z.string().optional().nullable(),
  description_fr: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),

  // Non-translatable fields
  issuer: z.string()
    .min(2, 'L\'émetteur doit contenir au moins 2 caractères')
    .max(100),

  issueDate: z.coerce.date()
    .optional()
    .nullable(),

  expiryDate: z.coerce.date()
    .optional()
    .nullable(),

  credentialId: z.string()
    .optional()
    .nullable(),

  credentialUrl: z.string()
    .url('URL invalide')
    .optional()
    .nullable(),

  skills: z.array(z.string())
    .default([]),

  order: z.number()
    .int()
    .default(0),
}).refine(
  data => {
    // Either French fields OR legacy fields must be present
    const hasFrenchFields = data.title_fr;
    const hasLegacyFields = data.title;
    return hasFrenchFields || hasLegacyFields;
  },
  {
    message: "Le titre en français est requis",
    path: ["title_fr"]
  }
);

export type CertificationApiInput = z.infer<typeof certificationApiSchema>;

// For updates (all fields optional)
export const certificationApiUpdateSchema = certificationApiSchema
  .omit({
    issuer: true,
    skills: true,
    order: true
  })
  .extend({
    issuer: z.string().min(2).max(100).optional(),
    skills: z.array(z.string()).optional(),
    order: z.number().int().optional(),
  });

// Transform function to ensure data consistency
export function normalizeCertificationData(data: CertificationApiInput) {
  return {
    // Use French fields as defaults for legacy fields if not provided
    title: data.title || data.title_fr || '',
    description: data.description !== undefined ? data.description : (data.description_fr || null),

    // Always use the new multilingual fields
    title_fr: data.title_fr || data.title || '',
    title_en: data.title_en || '',
    description_fr: data.description_fr !== undefined ? data.description_fr : (data.description || null),
    description_en: data.description_en || null,

    // Non-translatable fields
    issuer: data.issuer,
    issueDate: data.issueDate || null,
    expiryDate: data.expiryDate || null,
    credentialId: data.credentialId || null,
    credentialUrl: data.credentialUrl || null,
    skills: data.skills || [],
    order: data.order || 0,
  };
}