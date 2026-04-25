'use client'

import { useTranslation } from '@/lib/i18n/LanguageContext'

export default function T({ k }) {
  const { t } = useTranslation()
  return t(k)
}
