// app/[locale]/projects/page.tsx
import ProjectCardMultilingual from '@/components/sections/ProjectCardMultilingual';
import { fetchWithFallback } from '@/lib/utils/fetch-wrapper-with-fallback';
import { getTranslations } from 'next-intl/server';

/**
 * Page listant tous les projets
 */
export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('projects');

  // Récupérer tous les projets depuis l'API avec fallback JSON
  const result = await fetchWithFallback('/projects', {
    cache: 'no-store',
  });

  const projects = result.data || [];

  // Log source of data (for debugging)
  if (result.source === 'backup') {
    console.log('📁 Projects loaded from JSON backup');
  }

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 rounded-full font-medium">
              {projects.length} {projects.length > 1 ? t('projectsCount.plural', { count: projects.length }) : t('projectsCount.single', { count: 1 })}
            </span>
          </div>
        </div>

        {/* Grille de projets */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <ProjectCardMultilingual key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noProjects')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
