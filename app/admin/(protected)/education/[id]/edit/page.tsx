import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import EditEducationForm from './EditEducationForm'

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const { id } = await params

  const education = await prisma.education.findUnique({ where: { id } })
  if (!education) notFound()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier la formation</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {education.degree} - {education.institution}
        </p>
      </div>
      <EditEducationForm education={JSON.parse(JSON.stringify(education))} />
    </>
  )
}
