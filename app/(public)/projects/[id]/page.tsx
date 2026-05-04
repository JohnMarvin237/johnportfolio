import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { resolveProject } from '@/lib/i18n/resolveLocale';
import TrackPageView from '@/components/analytics/TrackPageView';
import type { Project } from '@/components/sections/ProjectCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Projet introuvable' };
  return {
    title: `${project.title} — John Portfolio`,
    description: project.description,
  };
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await getProject(id);
  if (!raw) notFound();

  const locale = (await cookies()).get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'fr';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = resolveProject(raw as any, locale) as Project;

  const {
    title,
    description,
    longDesc,
    technologies = [],
    imageUrl,
    demoUrl,
    githubUrl,
    featured,
    startDate,
    endDate,
    organization,
  } = project;

  const period = startDate
    ? `${formatDate(startDate)} — ${endDate ? formatDate(endDate) : 'En cours'}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <TrackPageView path={`/projects/${id}`} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux projets
        </Link>

        {/* Image */}
        {imageUrl && (
          <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
            {featured && (
              <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Mis en avant
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>

        {(period || organization) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {organization && <span>{organization}</span>}
            {period && <span>{period}</span>}
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((tech: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-gray dark:prose-invert max-w-none mb-10">
          {longDesc ? (
            longDesc.split('\n').map((para: string, i: number) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )
          ) : (
            <p>{description}</p>
          )}
        </div>

        {/* Buttons */}
        {(demoUrl || githubUrl) && (
          <div className="flex flex-wrap gap-4">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir la démo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Code source
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
