// lib/db/settings.ts — server-side only, never imported by client components
import { prisma } from '@/lib/db/prisma'

export type SiteSettingsMap = Record<string, string>

export async function getSettings(): Promise<SiteSettingsMap> {
  const rows = await prisma.siteSettings.findMany()
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}
