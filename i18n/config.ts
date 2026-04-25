// i18n/config.ts
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

// Prefix strategy for locales in URL
export const localePrefix = 'always' as const;

// Language names for display
export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English'
};