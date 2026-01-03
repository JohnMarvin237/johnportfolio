// lib/schemas/volunteer-bilingual.schema.ts
import { z } from 'zod';
import { volunteerApiSchema } from './volunteer-api.schema';

/**
 * Schema pour le formulaire bilingue de volunteer dans l'admin
 * Sépare les champs title, organization, description et location en FR et EN
 */
export const volunteerBilingualFormSchema = z.object({
  // Champs bilingues
  title_fr: z.string().min(1, "Le titre en français est requis"),
  title_en: z.string().optional().nullable(),

  organization_fr: z.string().min(1, "L'organisation en français est requise"),
  organization_en: z.string().optional().nullable(),

  description_fr: z.string().min(10, "La description en français est requise (min. 10 caractères)"),
  description_en: z.string().optional().nullable(),

  location_fr: z.string().optional().nullable(),
  location_en: z.string().optional().nullable(),

  // Champs non-bilingues
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date de début invalide",
  }),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional().default(false),
  order: z.union([z.string(), z.number()]).optional(),
});

/**
 * Transforme les données du formulaire vers le format API
 */
export function transformVolunteerFormData(formData: z.infer<typeof volunteerBilingualFormSchema>) {
  // Prepare data for API
  const apiData = {
    // Utilise les données françaises comme fallback pour les champs legacy
    title: formData.title_fr,
    organization: formData.organization_fr,
    description: formData.description_fr,
    location: formData.location_fr || null,

    // Nouveaux champs multilingues
    title_fr: formData.title_fr,
    title_en: formData.title_en || null,
    organization_fr: formData.organization_fr,
    organization_en: formData.organization_en || null,
    description_fr: formData.description_fr,
    description_en: formData.description_en || null,
    location_fr: formData.location_fr || null,
    location_en: formData.location_en || null,

    // Autres champs
    startDate: new Date(formData.startDate),
    endDate: formData.endDate ? new Date(formData.endDate) : null,
    current: formData.current || false,
    order: typeof formData.order === 'string' ? Number(formData.order) : (formData.order || 0),
  };

  // Valider avec le schema API
  return volunteerApiSchema.parse(apiData);
}

/**
 * Transforme les données de l'API vers le format formulaire
 */
export function transformVolunteerToFormData(apiData: any): z.infer<typeof volunteerBilingualFormSchema> {
  return {
    title_fr: apiData.title_fr || apiData.title || '',
    title_en: apiData.title_en || null,
    organization_fr: apiData.organization_fr || apiData.organization || '',
    organization_en: apiData.organization_en || null,
    description_fr: apiData.description_fr || apiData.description || '',
    description_en: apiData.description_en || null,
    location_fr: apiData.location_fr || apiData.location || null,
    location_en: apiData.location_en || null,
    startDate: apiData.startDate ? new Date(apiData.startDate).toISOString().split('T')[0] : '',
    endDate: apiData.endDate ? new Date(apiData.endDate).toISOString().split('T')[0] : null,
    current: apiData.current || false,
    order: apiData.order || 0,
  };
}