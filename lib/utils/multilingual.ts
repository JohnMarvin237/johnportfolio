// Utility functions for handling multilingual content

/**
 * Get the correct field value based on the current locale
 * Falls back to the other language if the requested locale is empty
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  fieldName: string,
  locale: 'fr' | 'en'
): string | string[] | null {
  const localizedField = `${fieldName}_${locale}`;
  const fallbackField = `${fieldName}_${locale === 'fr' ? 'en' : 'fr'}`;

  // Try to get the localized value
  const localizedValue = item[localizedField];
  if (localizedValue && (Array.isArray(localizedValue) ? localizedValue.length > 0 : localizedValue.trim() !== '')) {
    return localizedValue;
  }

  // Fall back to the other language
  const fallbackValue = item[fallbackField];
  if (fallbackValue && (Array.isArray(fallbackValue) ? fallbackValue.length > 0 : fallbackValue.trim() !== '')) {
    return fallbackValue;
  }

  // Fall back to legacy field without locale suffix
  const legacyValue = item[fieldName];
  if (legacyValue && (Array.isArray(legacyValue) ? legacyValue.length > 0 : legacyValue.trim() !== '')) {
    return legacyValue;
  }

  return null;
}

/**
 * Transform an object to include localized fields
 */
export function getLocalizedObject<T extends Record<string, any>>(
  item: T,
  fields: string[],
  locale: 'fr' | 'en'
): T {
  const localizedItem = { ...item } as any;

  fields.forEach(field => {
    const value = getLocalizedField(item, field, locale);
    if (value !== null) {
      localizedItem[field] = value;
    }
  });

  return localizedItem as T;
}

/**
 * Get all projects with localized fields
 */
export function getLocalizedProjects(projects: any[], locale: 'fr' | 'en') {
  return projects.map(project =>
    getLocalizedObject(project, ['title', 'description', 'longDesc'], locale)
  );
}

/**
 * Get all experiences with localized fields
 */
export function getLocalizedExperiences(experiences: any[], locale: 'fr' | 'en') {
  return experiences.map(experience =>
    getLocalizedObject(experience, ['title', 'description', 'achievements'], locale)
  );
}

/**
 * Get all education with localized fields
 */
export function getLocalizedEducation(education: any[], locale: 'fr' | 'en') {
  return education.map(edu =>
    getLocalizedObject(edu, ['degree', 'field', 'description', 'note'], locale)
  );
}

/**
 * Get all certifications with localized fields
 */
export function getLocalizedCertifications(certifications: any[], locale: 'fr' | 'en') {
  return certifications.map(cert =>
    getLocalizedObject(cert, ['title', 'description'], locale)
  );
}