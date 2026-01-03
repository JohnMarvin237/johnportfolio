// lib/schemas/education-bilingual.schema.ts
import { z } from 'zod';
import { educationApiSchema } from './education-api.schema';

/**
 * Schema pour le formulaire bilingue d'education dans l'admin
 * Sépare les champs degree, institution, field, description et note en FR et EN
 */
export const educationBilingualFormSchema = z.object({
  // Champs bilingues
  degree_fr: z.string().min(1, "Le diplôme en français est requis"),
  degree_en: z.string().optional().nullable(),

  institution_fr: z.string().min(1, "L'institution en français est requise"),
  institution_en: z.string().optional().nullable(),

  field_fr: z.string().optional().nullable(),
  field_en: z.string().optional().nullable(),

  description_fr: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),

  note_fr: z.string().optional().nullable(),
  note_en: z.string().optional().nullable(),

  // Champs non-bilingues
  location: z.string().min(1, "Le lieu est requis"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date de début invalide",
  }),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional().default(false),
  gpa: z.string().optional().nullable(),
  order: z.union([z.string(), z.number()]).optional(),
});

/**
 * Transforme les données du formulaire vers le format API
 */
export function transformEducationFormData(formData: z.infer<typeof educationBilingualFormSchema>) {
  // Prepare data for API
  const apiData = {
    // Utilise les données françaises comme fallback pour les champs legacy
    degree: formData.degree_fr,
    institution: formData.institution_fr,
    field: formData.field_fr || null,
    description: formData.description_fr || null,
    note: formData.note_fr || null,

    // Nouveaux champs multilingues
    degree_fr: formData.degree_fr,
    degree_en: formData.degree_en || null,
    institution_fr: formData.institution_fr,
    institution_en: formData.institution_en || null,
    field_fr: formData.field_fr || null,
    field_en: formData.field_en || null,
    description_fr: formData.description_fr || null,
    description_en: formData.description_en || null,
    note_fr: formData.note_fr || null,
    note_en: formData.note_en || null,

    // Autres champs
    location: formData.location,
    startDate: new Date(formData.startDate),
    endDate: formData.endDate ? new Date(formData.endDate) : null,
    current: formData.current || false,
    gpa: formData.gpa || null,
    order: typeof formData.order === 'string' ? Number(formData.order) : (formData.order || 0),
  };

  // Valider avec le schema API
  return educationApiSchema.parse(apiData);
}

/**
 * Transforme les données de l'API vers le format formulaire
 */
export function transformEducationToFormData(apiData: any): z.infer<typeof educationBilingualFormSchema> {
  return {
    degree_fr: apiData.degree_fr || apiData.degree || '',
    degree_en: apiData.degree_en || null,
    institution_fr: apiData.institution_fr || apiData.institution || '',
    institution_en: apiData.institution_en || null,
    field_fr: apiData.field_fr || apiData.field || null,
    field_en: apiData.field_en || null,
    description_fr: apiData.description_fr || apiData.description || null,
    description_en: apiData.description_en || null,
    note_fr: apiData.note_fr || apiData.note || null,
    note_en: apiData.note_en || null,
    location: apiData.location || '',
    startDate: apiData.startDate ? new Date(apiData.startDate).toISOString().split('T')[0] : '',
    endDate: apiData.endDate ? new Date(apiData.endDate).toISOString().split('T')[0] : null,
    current: apiData.current || false,
    gpa: apiData.gpa || null,
    order: apiData.order || 0,
  };
}