import type { Metadata } from 'next';
import ProjectCard from '@/components/sections/ProjectCard';
import T from '@/components/ui/T';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import { resolveProject } from '@/lib/i18n/resolveLocale';

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Projets - John Portfolio',
  description: 'Découvrez mes projets de développement web et applications',
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const locale = (await cookies()).get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'fr';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedProjects: any[] = projects.map((p) => resolveProject(p, locale));

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="projects.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <T k="projects.subtitle" />
          </p>
        </div>

        {resolvedProjects.length > 0 ? (
          <>
            {resolvedProjects.some((p) => p.featured) && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  <T k="projects.featured" />
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {resolvedProjects.filter((p) => p.featured).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
            {resolvedProjects.some((p) => !p.featured) && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  <T k="projects.others" />
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {resolvedProjects.filter((p) => !p.featured).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              <T k="projects.noProjects" />
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              <T k="projects.noProjectsDesc" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
