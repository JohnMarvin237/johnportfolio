// components/sections/ExperienceCard.tsx
'use client';

import React from 'react';

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string | null;
  location: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' });
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const {
    title,
    company,
    companyUrl,
    location,
    startDate,
    endDate,
    current,
    description,
    achievements,
    technologies,
  } = experience;

  const dateRange = `${formatDate(startDate)} — ${current ? 'Présent' : formatDate(endDate)}`;

  return (
    <div className="relative pl-8 pb-8">
      {/* Ligne de timeline */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Point de timeline */}
      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900" />

      {/* Carte */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            {current && (
              <span className="shrink-0 px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
                En cours
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {company}
              </a>
            ) : (
              <span className="font-medium text-gray-800 dark:text-gray-200">{company}</span>
            )}
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{location}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{dateRange}</span>
          </div>
        </div>

        {description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>
        )}

        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Réalisations principales :
            </h4>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-500 shrink-0">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
