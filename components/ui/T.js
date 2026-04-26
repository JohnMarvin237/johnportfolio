'use client'
// Inline translation component — wraps a single key for use inside Server Components.
// On SSR it renders the French default; after hydration it reflects the user's locale.
import { useTranslation } from '@/lib/i18n/LanguageContext'

export default function T({ k }) {
  const { t } = useTranslation()
  return <>{t(k)}</>
}
