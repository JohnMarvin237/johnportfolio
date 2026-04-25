import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import EditVolunteerForm from './EditVolunteerForm'

export default async function EditVolunteerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const { id } = await params

  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) notFound()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier le benevolat</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {volunteer.title} - {volunteer.organization}
        </p>
      </div>
      <EditVolunteerForm volunteer={JSON.parse(JSON.stringify(volunteer))} />
    </>
  )
}
