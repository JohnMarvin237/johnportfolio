// app/projects/page.tsx
import ProjectCard from '@/components/sections/ProjectCard';
import { getApiUrl } from '@/lib/utils';

/**
 * Page listant tous les projets
 */
export default async function ProjectsPage() {
  // Récupérer tous les projets depuis l'API
  const response = await fetch(getApiUrl('/projects'), {
    cache: 'no-store',
  });

  const projects = response.ok ? await response.json() : [];

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mes Projets
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez mes réalisations et projets en développement web, intelligence artificielle et plus encore.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {projects.length} projet{projects.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grille de projets */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun projet pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
