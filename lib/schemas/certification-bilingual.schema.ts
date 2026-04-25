// lib/schemas/certification-bilingual.schema.ts
import { z } from 'zod';
import { certificationApiSchema } from './certification-api.schema';

/**
 * Schema pour le formulaire bilingue de certification dans l'admin
 * Sépare les champs title, issuer, description et skills en FR et EN
 */
export const certificationBilingualFormSchema = z.object({
  // Champs bilingues
  title_fr: z.string().min(1, "Le titre en français est requis"),
  title_en: z.string().optional().nullable(),

  issuer_fr: z.string().min(1, "L'émetteur en français est requis"),
  issuer_en: z.string().optional().nullable(),

  description_fr: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),

  // Skills comme string pour le formulaire (sera transformé en tableau)
  skills_fr: z.string().optional().nullable(),
  skills_en: z.string().optional().nullable(),

  // Champs non-bilingues
  issueDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  order: z.union([z.string(), z.number()]).optional(),
});

/**
 * Transforme les données du formulaire vers le format API
 */
export function transformCertificationFormData(formData: z.infer<typeof certificationBilingualFormSchema>) {
  // Parse skills (string to array)
  const parseSkills = (skillsStr: string | null | undefined): string[] => {
    if (!skillsStr) return [];
    return skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  };

  const skills_fr = parseSkills(formData.skills_fr);
  const skills_en = parseSkills(formData.skills_en);

  // Prepare data for API
  const apiData = {
    // Utilise les données françaises comme fallback pour les champs legacy
    title: formData.title_fr,
    issuer: formData.issuer_fr,
    description: formData.description_fr || null,
    skills: skills_fr,

    // Nouveaux champs multilingues
    title_fr: formData.title_fr,
    title_en: formData.title_en || null,
    issuer_fr: formData.issuer_fr,
    issuer_en: formData.issuer_en || null,
    description_fr: formData.description_fr || null,
    description_en: formData.description_en || null,
    skills_fr,
    skills_en: skills_en.length > 0 ? skills_en : [],

    // Autres champs
    issueDate: formData.issueDate ? new Date(formData.issueDate) : null,
    expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
    credentialId: formData.credentialId || null,
    credentialUrl: formData.credentialUrl || null,
    order: typeof formData.order === 'string' ? Number(formData.order) : (formData.order || 0),
  };

  // Valider avec le schema API
  return certificationApiSchema.parse(apiData);
}

/**
 * Transforme les données de l'API vers le format formulaire
 */
export function transformCertificationToFormData(apiData: any): z.infer<typeof certificationBilingualFormSchema> {
  return {
    title_fr: apiData.title_fr || apiData.title || '',
    title_en: apiData.title_en || null,
    issuer_fr: apiData.issuer_fr || apiData.issuer || '',
    issuer_en: apiData.issuer_en || null,
    description_fr: apiData.description_fr || apiData.description || null,
    description_en: apiData.description_en || null,
    skills_fr: (apiData.skills_fr || apiData.skills || []).join(', '),
    skills_en: apiData.skills_en ? apiData.skills_en.join(', ') : null,
    issueDate: apiData.issueDate ? new Date(apiData.issueDate).toISOString().split('T')[0] : null,
    expiryDate: apiData.expiryDate ? new Date(apiData.expiryDate).toISOString().split('T')[0] : null,
    credentialId: apiData.credentialId || null,
    credentialUrl: apiData.credentialUrl || null,
    order: apiData.order || 0,
  };
}