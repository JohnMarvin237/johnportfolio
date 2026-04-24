import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AdminTable, { type ColumnDef } from '@/components/admin/AdminTable'

export default async function EducationPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')
  const education = await prisma.education.findMany({
    orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
  })

  const columns: ColumnDef[] = [
    { key: 'degree', label: 'Diplôme', type: 'withSub', subKey: 'institution' },
    { key: 'field', label: 'Domaine', type: 'fallback', fallback: '-' },
    { key: 'location', label: 'Lieu' },
    { key: 'period', label: 'Période', type: 'period' },
    { key: 'order', label: 'Ordre' },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formation</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {education.length} formation{education.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/education/new">
          <Button>+ Nouvelle formation</Button>
        </Link>
      </div>
      <AdminTable
        items={JSON.parse(JSON.stringify(education))}
        columns={columns}
        baseUrl="education"
        entityName="formation"
      />
    </>
  )
}
