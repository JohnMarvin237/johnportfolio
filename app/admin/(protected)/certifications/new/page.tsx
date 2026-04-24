import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

const certificationFields: FieldDef[] = [
  { name: 'title', label: 'Titre', type: 'bilingual', required: true, placeholder: 'AWS Solutions Architect' },
  { name: 'issuer', label: 'Émetteur', type: 'text', required: true, placeholder: 'Amazon Web Services' },
  { name: 'issueDate', label: "Date d'obtention", type: 'date' },
  { name: 'expiryDate', label: "Date d'expiration", type: 'date' },
  { name: 'credentialId', label: 'ID du certificat', type: 'text', placeholder: 'ABC123', nullable: true },
  { name: 'credentialUrl', label: 'URL du certificat', type: 'text', placeholder: 'https://...', nullable: true },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 3, nullable: true, placeholder: 'Description (optionnel)' },
  { name: 'skills', label: 'Compétences validées', type: 'tags', placeholder: 'Cloud, Architecture, DevOps' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default async function NewCertificationPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle certification</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter une nouvelle certification
        </p>
      </div>
      <AdminForm
        fields={certificationFields}
        apiUrl="/api/certifications"
        redirectUrl="/admin/certifications"
      />
    </>
  )
}
