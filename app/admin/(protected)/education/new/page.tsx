import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

const educationFields: FieldDef[] = [
  { name: 'degree', label: 'Diplôme', type: 'bilingual', required: true, placeholder: 'Baccalauréat en informatique' },
  { name: 'institution', label: 'Institution', type: 'text', required: true, placeholder: 'Université / Collège' },
  { name: 'field', label: "Domaine d'étude", type: 'bilingual', nullable: true, placeholder: 'Informatique' },
  { name: 'location', label: 'Lieu', type: 'text', required: true, placeholder: 'Ottawa, ON' },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'En cours', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, nullable: true, placeholder: 'Description (optionnel)' },
  { name: 'gpa', label: 'GPA / Moyenne', type: 'text', placeholder: '3.8/4.0', nullable: true },
  { name: 'note', label: 'Note', type: 'bilingual', nullable: true, placeholder: 'Ex: Équivalent Maîtrise canadienne' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default async function NewEducationPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle formation</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter une nouvelle formation
        </p>
      </div>
      <AdminForm
        fields={educationFields}
        apiUrl="/api/education"
        redirectUrl="/admin/education"
      />
    </>
  )
}
