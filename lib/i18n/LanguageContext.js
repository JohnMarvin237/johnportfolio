'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { setLocaleCookie } from '@/app/actions/locale'
import fr from './translations/fr.json'
import en from './translations/en.json'

const translations = { fr, en }

/** @typedef {{ locale: string; setLocale: (locale: string) => void; t: (key: string) => string }} LanguageContextValue */

/** @type {import('react').Context<LanguageContextValue | undefined>} */
const LanguageContext = createContext(undefined)

/**
 * @param {object} obj
 * @param {string} path
 * @returns {string | undefined}
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('fr')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored === 'fr' || stored === 'en') {
      setLocaleState(stored)
      document.documentElement.lang = stored
      // Sync cookie with localStorage on first load so server reads correct locale
      setLocaleCookie(stored).then(() => router.refresh())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /** @param {string} newLocale */
  const setLocale = useCallback(async (newLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
    // Set cookie via Server Action (guaranteed to be available before the refresh)
    await setLocaleCookie(newLocale)
    // Re-render Server Components with the new locale
    router.refresh()
  }, [router])

  /** @param {string} key @returns {string} */
  const t = useCallback((key) => {
    const value = getNestedValue(translations[locale], key)
    if (value !== undefined) return value
    // Fallback to French
    const fallback = getNestedValue(translations.fr, key)
    if (fallback !== undefined) return fallback
    // Return key itself as last resort
    return key
  }, [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * @returns {LanguageContextValue}
 */
export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
