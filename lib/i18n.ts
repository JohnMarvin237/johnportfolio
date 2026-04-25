// Simple i18n utility for server components
import { cache } from 'react';

export type Locale = 'fr' | 'en';

const translations: Record<Locale, any> = {
  fr: {},
  en: {}
};

// Load translations (cached per request)
export const loadTranslations = cache(async (locale: Locale) => {
  if (translations[locale] && Object.keys(translations[locale]).length > 0) {
    return translations[locale];
  }

  try {
    const messages = await import(`@/messages/${locale}.json`);
    translations[locale] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return {};
  }
});

// Get translation function for server components
export async function getTranslations(namespace: string, locale: Locale = 'fr') {
  const messages = await loadTranslations(locale);
  const namespaceMessages = messages[namespace] || {};

  return (key: string, defaultValue?: string) => {
    return namespaceMessages[key] || defaultValue || key;
  };
}

// Get locale from URL path segment
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (locale === 'en' || locale === 'fr') {
    return locale;
  }

  return 'fr'; // default
}