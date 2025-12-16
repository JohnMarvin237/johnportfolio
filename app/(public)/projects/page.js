import ProjectCard from '@/components/sections/ProjectCard'
import { prisma } from '@/lib/db/prisma'

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    })
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export const metadata = {
  title: 'Projets - John Portfolio',
  description: 'Découvrez mes projets de développement web et applications',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Mes Projets
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Voici une sélection de mes projets récents. Chaque projet représente
            un défi unique et une opportunité d'apprentissage.
          </p>
        </div>

        {/* Grille de projets */}
        {projects.length > 0 ? (
          <>
            {/* Projets en vedette */}
            {projects.some(p => p.featured) && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Projets en vedette
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {projects
                    .filter(project => project.featured)
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </div>
            )}

            {/* Tous les autres projets */}
            {projects.some(p => !p.featured) && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Autres projets
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {projects
                    .filter(project => !project.featured)
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun projet pour le moment
            </h3>
            <p className="text-gray-500">
              Les projets seront ajoutés prochainement.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}