import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

export const metadata = { title: 'Paramètres — Admin' }

async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSettings.findMany()
  const result: Record<string, string> = {}
  rows.forEach((row) => {
    result[row.key] = row.value
  })
  return result
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const settings = await getSettings()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres du site</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez vos informations de contact, vos liens de profils et votre identité.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </>
  )
}
