'use client'

import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

interface EditEducationFormProps {
  education: { id: string; [key: string]: unknown }
}

const educationFields: FieldDef[] = [
  { name: 'degree', label: 'Diplôme', type: 'bilingual', required: true },
  { name: 'institution', label: 'Institution', type: 'text', required: true },
  { name: 'field', label: "Domaine d'étude", type: 'bilingual', nullable: true },
  { name: 'location', label: 'Lieu', type: 'text', required: true },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'En cours', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, nullable: true },
  { name: 'gpa', label: 'GPA / Moyenne', type: 'text', nullable: true },
  { name: 'note', label: 'Note', type: 'bilingual', nullable: true },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default function EditEducationForm({ education }: EditEducationFormProps) {
  return (
    <AdminForm
      fields={educationFields}
      initialData={education}
      apiUrl={`/api/education/${education.id}`}
      redirectUrl="/admin/education"
      method="PUT"
    />
  )
}
