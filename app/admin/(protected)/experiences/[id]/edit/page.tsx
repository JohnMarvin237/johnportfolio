import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import EditExperienceForm from './EditExperienceForm'

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const { id } = await params

  const experience = await prisma.experience.findUnique({ where: { id } })
  if (!experience) notFound()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier l'experience</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {experience.title} - {experience.company}
        </p>
      </div>
      <EditExperienceForm experience={JSON.parse(JSON.stringify(experience))} />
    </>
  )
}
