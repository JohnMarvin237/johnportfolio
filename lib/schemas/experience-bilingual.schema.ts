// lib/schemas/experience-bilingual.schema.ts
import { z } from 'zod';
import { experienceApiSchema } from './experience-api.schema';

/**
 * Schema pour le formulaire bilingue d'experience dans l'admin
 * Sépare les champs title, company, location, description et achievements en FR et EN
 */
export const experienceBilingualFormSchema = z.object({
  // Champs bilingues
  title_fr: z.string().min(1, "Le titre en français est requis"),
  title_en: z.string().optional().nullable(),

  company_fr: z.string().min(1, "L'entreprise en français est requise"),
  company_en: z.string().optional().nullable(),

  location_fr: z.string().min(1, "Le lieu en français est requis"),
  location_en: z.string().optional().nullable(),

  description_fr: z.string().min(10, "La description en français est requise (min. 10 caractères)"),
  description_en: z.string().optional().nullable(),

  // Achievements comme string pour le formulaire (sera transformé en tableau)
  achievements_fr: z.string().min(1, "Au moins une réalisation en français est requise"),
  achievements_en: z.string().optional().nullable(),

  // Champs non-bilingues
  companyUrl: z.string().url().optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date de début invalide",
  }),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional().default(false),
  technologies: z.string().min(1, "Au moins une technologie est requise"),
  order: z.union([z.string(), z.number()]).optional(),
});

/**
 * Transforme les données du formulaire vers le format API
 */
export function transformExperienceFormData(formData: z.infer<typeof experienceBilingualFormSchema>) {
  // Parse technologies (string to array)
  const technologies = formData.technologies
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  // Parse achievements (string with newlines to array)
  const parseAchievements = (achievementsStr: string | null | undefined): string[] => {
    if (!achievementsStr) return [];
    return achievementsStr
      .split('\n')
      .map(a => a.trim())
      .filter(Boolean);
  };

  const achievements_fr = parseAchievements(formData.achievements_fr);
  const achievements_en = parseAchievements(formData.achievements_en);

  // Prepare data for API
  const apiData = {
    // Utilise les données françaises comme fallback pour les champs legacy
    title: formData.title_fr,
    company: formData.company_fr,
    location: formData.location_fr,
    description: formData.description_fr,
    achievements: achievements_fr,

    // Nouveaux champs multilingues
    title_fr: formData.title_fr,
    title_en: formData.title_en || null,
    company_fr: formData.company_fr,
    company_en: formData.company_en || null,
    location_fr: formData.location_fr,
    location_en: formData.location_en || null,
    description_fr: formData.description_fr,
    description_en: formData.description_en || null,
    achievements_fr,
    achievements_en: achievements_en.length > 0 ? achievements_en : [],

    // Autres champs
    companyUrl: formData.companyUrl || null,
    startDate: new Date(formData.startDate),
    endDate: formData.endDate ? new Date(formData.endDate) : null,
    current: formData.current || false,
    technologies,
    order: typeof formData.order === 'string' ? Number(formData.order) : (formData.order || 0),
  };

  // Valider avec le schema API
  return experienceApiSchema.parse(apiData);
}

/**
 * Transforme les données de l'API vers le format formulaire
 */
export function transformExperienceToFormData(apiData: any): z.infer<typeof experienceBilingualFormSchema> {
  return {
    title_fr: apiData.title_fr || apiData.title || '',
    title_en: apiData.title_en || null,
    company_fr: apiData.company_fr || apiData.company || '',
    company_en: apiData.company_en || null,
    location_fr: apiData.location_fr || apiData.location || '',
    location_en: apiData.location_en || null,
    description_fr: apiData.description_fr || apiData.description || '',
    description_en: apiData.description_en || null,
    achievements_fr: (apiData.achievements_fr || apiData.achievements || []).join('\n'),
    achievements_en: apiData.achievements_en ? apiData.achievements_en.join('\n') : null,
    companyUrl: apiData.companyUrl || null,
    startDate: apiData.startDate ? new Date(apiData.startDate).toISOString().split('T')[0] : '',
    endDate: apiData.endDate ? new Date(apiData.endDate).toISOString().split('T')[0] : null,
    current: apiData.current || false,
    technologies: (apiData.technologies || []).join(', '),
    order: apiData.order || 0,
  };
}