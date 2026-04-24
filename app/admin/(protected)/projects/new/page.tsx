import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import AdminForm, { type FieldDef } from '@/components/admin/AdminForm'

const projectFields: FieldDef[] = [
  { name: 'title', label: 'Titre', type: 'bilingual', required: true, placeholder: 'Mon super projet' },
  { name: 'description', label: 'Description courte', type: 'bilingual-textarea', rows: 3, required: true, placeholder: 'Description concise du projet' },
  { name: 'longDesc', label: 'Description détaillée', type: 'bilingual-textarea', rows: 6, nullable: true, placeholder: 'Description détaillée (optionnel)' },
  { name: 'technologies', label: 'Technologies', type: 'tags', required: true, placeholder: 'React, Next.js, PostgreSQL' },
  { name: 'organization', label: 'Organisation', type: 'text', placeholder: 'Entreprise ou personnel', nullable: true },
  { name: 'imageUrl', label: 'URL Image', type: 'text', placeholder: 'https://...', nullable: true },
  { name: 'demoUrl', label: 'URL Démo', type: 'text', placeholder: 'https://...', nullable: true },
  { name: 'githubUrl', label: 'URL GitHub', type: 'text', placeholder: 'https://github.com/...', nullable: true },
  { name: 'startDate', label: 'Date de début', type: 'date' },
  { name: 'endDate', label: 'Date de fin', type: 'date' },
  { name: 'order', label: "Ordre d'affichage", type: 'number', default: 0 },
  { name: 'featured', label: 'Projet mis en avant', type: 'checkbox', default: false },
]

export default async function NewProjectPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau projet</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter un nouveau projet à votre portfolio
        </p>
      </div>
      <AdminForm
        fields={projectFields}
        apiUrl="/api/projects"
        redirectUrl="/admin/projects"
      />
    </>
  )
}
