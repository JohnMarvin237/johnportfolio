// components/sections/FeaturedProjects.tsx
'use client';

import React from 'react';
import ProjectCardMultilingual, { ProjectMultilingual } from './ProjectCardMultilingual';
import { useLocale } from '@/components/providers/LocaleProvider';

interface FeaturedProjectsProps {
  projects: ProjectMultilingual[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const locale = useLocale();

  const content = {
    viewAll: locale === 'fr' ? 'Voir tous les projets' : 'View all projects'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {projects.map((project) => (
        <ProjectCardMultilingual key={project.id} project={project} />
      ))}
    </div>
  );
}