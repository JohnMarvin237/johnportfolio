import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AdminTable, { type ColumnDef } from '@/components/admin/AdminTable'

export default async function CertificationsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')
  const certifications = await prisma.certification.findMany({
    orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
  })

  const columns: ColumnDef[] = [
    { key: 'title', label: 'Certification', type: 'withSub', subKey: 'issuer' },
    { key: 'issueDate', label: 'Délivrée le', type: 'date' },
    { key: 'expiryDate', label: 'Expiration', type: 'expiry' },
    { key: 'order', label: 'Ordre' },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {certifications.length} certification{certifications.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/certifications/new">
          <Button>+ Nouvelle certification</Button>
        </Link>
      </div>
      <AdminTable
        items={JSON.parse(JSON.stringify(certifications))}
        columns={columns}
        baseUrl="certifications"
        entityName="certification"
      />
    </>
  )
}
