'use client'

import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

interface EditVolunteerFormProps {
  volunteer: { id: string; [key: string]: unknown }
}

const volunteerFields: FieldDef[] = [
  { name: 'title', label: 'Rôle / Titre', type: 'bilingual', required: true },
  { name: 'organization', label: 'Organisation', type: 'text', required: true },
  { name: 'location', label: 'Lieu', type: 'text', nullable: true },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'En cours', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, required: true },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default function EditVolunteerForm({ volunteer }: EditVolunteerFormProps) {
  return (
    <AdminForm
      fields={volunteerFields}
      initialData={volunteer}
      apiUrl={`/api/volunteer/${volunteer.id}`}
      redirectUrl="/admin/volunteer"
      method="PUT"
    />
  )
}
