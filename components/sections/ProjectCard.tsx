// components/sections/ProjectCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDesc?: string | null;
  technologies: string[];
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  order: number;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  organization?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation();

  if (!project) return null;

  const {
    id,
    title,
    description,
    technologies = [],
    imageUrl,
    demoUrl,
    githubUrl,
    featured,
  } = project;

  return (
    <Card hover className="h-full flex flex-col">
      {/* Image du projet */}
      {imageUrl && (
        <div className="relative -m-6 mb-4 h-48 overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t('projects.featuredBadge')}
            </div>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              {t('projects.viewDemo')}
            </Button>
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              {t('projects.sourceCode')}
            </Button>
          </a>
        )}
        {!demoUrl && !githubUrl && (
          <a href={`/projects/${id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              {t('projects.learnMore')}
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
}
