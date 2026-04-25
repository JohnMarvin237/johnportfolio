'use client'

import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

interface EditCertificationFormProps {
  certification: { id: string; [key: string]: unknown }
}

const certificationFields: FieldDef[] = [
  { name: 'title', label: 'Titre', type: 'bilingual', required: true },
  { name: 'issuer', label: 'Émetteur', type: 'text', required: true },
  { name: 'issueDate', label: "Date d'obtention", type: 'date' },
  { name: 'expiryDate', label: "Date d'expiration", type: 'date' },
  { name: 'credentialId', label: 'ID du certificat', type: 'text', nullable: true },
  { name: 'credentialUrl', label: 'URL du certificat', type: 'text', nullable: true },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 3, nullable: true },
  { name: 'skills', label: 'Compétences validées', type: 'tags' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default function EditCertificationForm({ certification }: EditCertificationFormProps) {
  return (
    <AdminForm
      fields={certificationFields}
      initialData={certification}
      apiUrl={`/api/certifications/${certification.id}`}
      redirectUrl="/admin/certifications"
      method="PUT"
    />
  )
}
