// lib/schemas/certification.schema.ts
import { z } from 'zod';

export const certificationSchema = z.object({
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(150),

  issuer: z.string()
    .min(2, "L'émetteur doit contenir au moins 2 caractères")
    .max(150),

  issueDate: z.coerce.date()
    .optional()
    .nullable(),

  expiryDate: z.coerce.date()
    .optional()
    .nullable(),

  credentialId: z.string()
    .max(100)
    .optional()
    .nullable(),

  credentialUrl: z.string()
    .url('URL invalide')
    .optional()
    .nullable(),

  description: z.string()
    .max(1000)
    .optional()
    .nullable(),

  skills: z.array(z.string())
    .max(15, 'Maximum 15 compétences')
    .default([]),

  order: z.number()
    .int()
    .default(0),

  // i18n fields
  title_fr: z.string().max(150).optional().nullable(),
  title_en: z.string().max(150).optional().nullable(),
  description_fr: z.string().max(1000).optional().nullable(),
  description_en: z.string().max(1000).optional().nullable(),
});

export type CertificationInput = z.infer<typeof certificationSchema>;
export const certificationUpdateSchema = certificationSchema.partial();
