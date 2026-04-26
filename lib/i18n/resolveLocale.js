/**
 * Resolves bilingual fields for a given locale.
 * Falls back to the original (legacy) field if the locale-specific one is missing.
 * @param {'fr' | 'en'} locale
 */

/**
 * Reads a bilingual field accepting both camelCase (Prisma @map) and snake_case (raw DB column).
 * This handles both the mapped Prisma client and the raw column names returned in some contexts.
 * @param {object} obj
 * @param {string} camel  e.g. 'titleFr'
 * @param {string} snake  e.g. 'title_fr'
 * @returns {any}
 */
function get(obj, camel, snake) {
  return obj[camel] ?? obj[snake] ?? null
}

/**
 * @param {object} exp - Prisma Experience record
 * @param {'fr' | 'en'} locale
 */
export function resolveExperience(exp, locale) {
  if (locale === 'en') {
    const achEn = get(exp, 'achievementsEn', 'achievements_en')
    return {
      ...exp,
      title: get(exp, 'titleEn', 'title_en') ?? exp.title,
      description: get(exp, 'descriptionEn', 'description_en') ?? exp.description,
      achievements: (achEn?.length ? achEn : null) ?? exp.achievements,
    }
  }
  const achFr = get(exp, 'achievementsFr', 'achievements_fr')
  return {
    ...exp,
    title: get(exp, 'titleFr', 'title_fr') ?? exp.title,
    description: get(exp, 'descriptionFr', 'description_fr') ?? exp.description,
    achievements: (achFr?.length ? achFr : null) ?? exp.achievements,
  }
}

/**
 * @param {object} edu - Prisma Education record
 * @param {'fr' | 'en'} locale
 */
export function resolveEducation(edu, locale) {
  if (locale === 'en') {
    return {
      ...edu,
      degree: get(edu, 'degreeEn', 'degree_en') ?? edu.degree,
      field: get(edu, 'fieldEn', 'field_en') ?? edu.field,
      description: get(edu, 'descriptionEn', 'description_en') ?? edu.description,
      note: get(edu, 'noteEn', 'note_en') ?? edu.note,
    }
  }
  return {
    ...edu,
    degree: get(edu, 'degreeFr', 'degree_fr') ?? edu.degree,
    field: get(edu, 'fieldFr', 'field_fr') ?? edu.field,
    description: get(edu, 'descriptionFr', 'description_fr') ?? edu.description,
    note: get(edu, 'noteFr', 'note_fr') ?? edu.note,
  }
}

/**
 * @param {object} proj - Prisma Project record
 * @param {'fr' | 'en'} locale
 */
export function resolveProject(proj, locale) {
  if (locale === 'en') {
    return {
      ...proj,
      title: get(proj, 'titleEn', 'title_en') ?? proj.title,
      description: get(proj, 'descriptionEn', 'description_en') ?? proj.description,
      longDesc: get(proj, 'longDescEn', 'longDesc_en') ?? proj.longDesc,
    }
  }
  return {
    ...proj,
    title: get(proj, 'titleFr', 'title_fr') ?? proj.title,
    description: get(proj, 'descriptionFr', 'description_fr') ?? proj.description,
    longDesc: get(proj, 'longDescFr', 'longDesc_fr') ?? proj.longDesc,
  }
}

/**
 * @param {object} cert - Prisma Certification record
 * @param {'fr' | 'en'} locale
 */
export function resolveCertification(cert, locale) {
  if (locale === 'en') {
    return {
      ...cert,
      title: get(cert, 'titleEn', 'title_en') ?? cert.title,
      description: get(cert, 'descriptionEn', 'description_en') ?? cert.description,
    }
  }
  return {
    ...cert,
    title: get(cert, 'titleFr', 'title_fr') ?? cert.title,
    description: get(cert, 'descriptionFr', 'description_fr') ?? cert.description,
  }
}

/**
 * @param {object} vol - Prisma Volunteer record
 * @param {'fr' | 'en'} locale
 */
export function resolveVolunteer(vol, locale) {
  if (locale === 'en') {
    return {
      ...vol,
      title: get(vol, 'titleEn', 'title_en') ?? vol.title,
      description: get(vol, 'descriptionEn', 'description_en') ?? vol.description,
    }
  }
  return {
    ...vol,
    title: get(vol, 'titleFr', 'title_fr') ?? vol.title,
    description: get(vol, 'descriptionFr', 'description_fr') ?? vol.description,
  }
}
