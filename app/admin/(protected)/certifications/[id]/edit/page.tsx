import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import EditCertificationForm from './EditCertificationForm'

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  const { id } = await params

  const certification = await prisma.certification.findUnique({ where: { id } })
  if (!certification) notFound()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier la certification</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {certification.title} - {certification.issuer}
        </p>
      </div>
      <EditCertificationForm certification={JSON.parse(JSON.stringify(certification))} />
    </>
  )
}
