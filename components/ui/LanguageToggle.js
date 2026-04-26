'use client'

import { useTranslation } from '@/lib/i18n/LanguageContext'

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => setLocale('fr')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === 'fr'
            ? 'text-primary-600 dark:text-primary-400 font-bold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        FR
      </button>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <button
        onClick={() => setLocale('en')}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === 'en'
            ? 'text-primary-600 dark:text-primary-400 font-bold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  )
}
