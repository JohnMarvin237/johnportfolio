// components/sections/ProjectCardMultilingual.tsx
'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { useLocale } from '@/components/providers/LocaleProvider';

export interface ProjectMultilingual {
  id: string;
  // Legacy fields
  title?: string | null;
  description?: string | null;
  longDesc?: string | null;
  organization?: string | null;
  // Multilingual fields
  title_fr?: string | null;
  title_en?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
  longDesc_fr?: string | null;
  longDesc_en?: string | null;
  organization_fr?: string | null;
  organization_en?: string | null;
  // Non-translatable fields
  technologies: string[];
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  order: number;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProjectCardMultilingualProps {
  project: ProjectMultilingual;
}

/**
 * Carte d'affichage d'un projet avec support multilingue
 * Affiche les détails d'un projet avec image, technologies et liens
 */
export default function ProjectCardMultilingual({ project }: ProjectCardMultilingualProps) {
  const locale = useLocale();

  // Traductions simples
  const translations = {
    featured: locale === 'fr' ? 'En vedette' : 'Featured',
    viewDemo: locale === 'fr' ? 'Voir la démo' : 'View Demo'
  };

  // Get the appropriate language content
  const title = locale === 'fr'
    ? (project.title_fr || project.title || '')
    : (project.title_en || project.title || project.title_fr || '');

  const description = locale === 'fr'
    ? (project.description_fr || project.description || '')
    : (project.description_en || project.description || project.description_fr || '');

  const organization = locale === 'fr'
    ? (project.organization_fr || project.organization || '')
    : (project.organization_en || project.organization || project.organization_fr || '');

  const {
    technologies,
    imageUrl,
    demoUrl,
    githubUrl,
    featured,
  } = project;

  return (
    <Card hover className="h-full flex flex-col group overflow-hidden">
      {/* Image du projet avec overlay gradient */}
      {imageUrl && (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 overflow-hidden -m-6 mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </CardTitle>
          {featured && (
            <span className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/15 rounded-full border border-blue-200 dark:border-blue-400/20 shadow-sm">
              {translations.featured}
            </span>
          )}
        </div>
        {organization && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{organization}</p>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>

        {/* Technologies avec hover effect */}
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Actions */}
      {(demoUrl || githubUrl) && (
        <CardFooter>
          {demoUrl && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(demoUrl, '_blank')}
              className="flex-1"
            >
              {translations.viewDemo}
            </Button>
          )}
          {githubUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(githubUrl, '_blank')}
              className="flex-1"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}