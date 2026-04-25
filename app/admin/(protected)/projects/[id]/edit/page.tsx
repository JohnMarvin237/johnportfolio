import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const { id } = await params

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) notFound()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier le projet</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {project.title}
        </p>
      </div>
      <EditProjectForm project={JSON.parse(JSON.stringify(project))} />
    </>
  )
}
