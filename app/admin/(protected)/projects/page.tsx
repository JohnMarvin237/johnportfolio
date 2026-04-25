import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AdminTable, { type ColumnDef } from '@/components/admin/AdminTable'

export default async function ProjectsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  const columns: ColumnDef[] = [
    { key: 'title', label: 'Titre', type: 'withSub', subKey: 'organization', badgeKey: 'featured', badgeLabel: 'Featured' },
    { key: 'technologies', label: 'Technologies', type: 'tags', maxTags: 3 },
    { key: 'order', label: 'Ordre' },
    { key: 'createdAt', label: 'Date', type: 'date' },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>+ Nouveau projet</Button>
        </Link>
      </div>
      <AdminTable
        items={JSON.parse(JSON.stringify(projects))}
        columns={columns}
        baseUrl="projects"
        entityName="projet"
      />
    </>
  )
}
