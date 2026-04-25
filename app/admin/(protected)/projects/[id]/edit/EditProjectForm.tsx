'use client'

import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

interface EditProjectFormProps {
  project: { id: string; [key: string]: unknown }
}

const projectFields: FieldDef[] = [
  { name: 'title', label: 'Titre', type: 'bilingual', required: true },
  { name: 'description', label: 'Description courte', type: 'bilingual-textarea', rows: 3, required: true },
  { name: 'longDesc', label: 'Description détaillée', type: 'bilingual-textarea', rows: 6, nullable: true },
  { name: 'technologies', label: 'Technologies', type: 'tags', required: true },
  { name: 'organization', label: 'Organisation', type: 'text', nullable: true },
  { name: 'imageUrl', label: 'URL Image', type: 'text', nullable: true },
  { name: 'demoUrl', label: 'URL Démo', type: 'text', nullable: true },
  { name: 'githubUrl', label: 'URL GitHub', type: 'text', nullable: true },
  { name: 'startDate', label: 'Date de début', type: 'date' },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
  { name: 'featured', label: 'Projet mis en avant', type: 'checkbox', default: false },
]

export default function EditProjectForm({ project }: EditProjectFormProps) {
  return (
    <AdminForm
      fields={projectFields}
      initialData={project}
      apiUrl={`/api/projects/${project.id}`}
      redirectUrl="/admin/projects"
      method="PUT"
    />
  )
}
