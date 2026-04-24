'use client'

import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

interface EditExperienceFormProps {
  experience: { id: string; [key: string]: unknown }
}

const experienceFields: FieldDef[] = [
  { name: 'title', label: 'Titre du poste', type: 'bilingual', required: true },
  { name: 'company', label: 'Entreprise', type: 'text', required: true },
  { name: 'companyUrl', label: 'URL Entreprise', type: 'text', nullable: true },
  { name: 'location', label: 'Lieu', type: 'text', required: true },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'Poste actuel', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, required: true },
  { name: 'achievements', label: 'Réalisations', type: 'bilingual-tags', required: true },
  { name: 'technologies', label: 'Technologies', type: 'tags', required: true },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default function EditExperienceForm({ experience }: EditExperienceFormProps) {
  return (
    <AdminForm
      fields={experienceFields}
      initialData={experience}
      apiUrl={`/api/experiences/${experience.id}`}
      redirectUrl="/admin/experiences"
      method="PUT"
    />
  )
}
