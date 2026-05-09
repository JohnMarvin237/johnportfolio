// lib/db/settings.ts — server-side only, never imported by client components
import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'

export type SiteSettingsMap = Record<string, string>

// cache() deduplicates calls within the same request tree — layout + page
// both calling getSettings() only hit the DB once.
export const getSettings = cache(async (): Promise<SiteSettingsMap> => {
  try {
    const rows = await prisma.siteSettings.findMany()
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {
    return {}
  }
})
