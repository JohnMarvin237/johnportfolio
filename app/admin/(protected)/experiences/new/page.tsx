import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

const experienceFields: FieldDef[] = [
  { name: 'title', label: 'Titre du poste', type: 'bilingual', required: true, placeholder: 'Développeur Full-Stack' },
  { name: 'company', label: 'Entreprise', type: 'text', required: true, placeholder: "Nom de l'entreprise" },
  { name: 'companyUrl', label: 'URL Entreprise', type: 'text', placeholder: 'https://...', nullable: true },
  { name: 'location', label: 'Lieu', type: 'text', required: true, placeholder: 'Ottawa, ON' },
  { name: 'startDate', label: 'Date de début', type: 'date', required: true },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'current', label: 'Poste actuel', type: 'checkbox', default: false },
  { name: 'description', label: 'Description', type: 'bilingual-textarea', rows: 4, required: true, placeholder: 'Description du poste' },
  { name: 'achievements', label: 'Réalisations', type: 'bilingual-tags', required: true, placeholder: 'Réalisation 1, Réalisation 2' },
  { name: 'technologies', label: 'Technologies', type: 'tags', required: true, placeholder: 'React, Node.js, PostgreSQL' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
]

export default async function NewExperiencePage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle expérience</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter une nouvelle expérience professionnelle
        </p>
      </div>
      <AdminForm
        fields={experienceFields}
        apiUrl="/api/experiences"
        redirectUrl="/admin/experiences"
      />
    </>
  )
}
