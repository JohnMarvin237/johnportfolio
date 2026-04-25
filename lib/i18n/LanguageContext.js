'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import fr from './translations/fr.json'
import en from './translations/en.json'

const translations = { fr, en }

const LanguageContext = createContext(undefined)

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('fr')

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored === 'fr' || stored === 'en') {
      setLocaleState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }, [])

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

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
