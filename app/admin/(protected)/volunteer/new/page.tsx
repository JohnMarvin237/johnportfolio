import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

const volunteerFields: FieldDef[] = [
  { name: 'title', label: 'Rôle / Titre', type: 'bilingual', required: true, placeholder: 'Bénévole en informatique' },
  { name: 'organization', label: 'Organisation', type: 'text', required: true, placeholder: "Nom de l'organisation" },
  { name: 'location', label: 'Lieu', type: 'text', placeholder: 'Ottawa, ON', nullable: true },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'En cours', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, required: true, placeholder: 'Description des activités' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default async function NewVolunteerPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau bénévolat</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter une nouvelle expérience de bénévolat
        </p>
      </div>
      <AdminForm
        fields={volunteerFields}
        apiUrl="/api/volunteer"
        redirectUrl="/admin/volunteer"
      />
    </>
  )
}
