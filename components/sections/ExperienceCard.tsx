// components/sections/ExperienceCard.tsx
'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

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

export interface ExperienceCardProps {
  experience: Experience;
}

/**
 * Formate une plage de dates
 * @param startDate - Date de début
 * @param endDate - Date de fin (null si current)
 * @param current - Si l'expérience est actuelle
 */
function formatDateRange(
  startDate: Date | string,
  endDate: Date | string | null | undefined,
  current: boolean
): string {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString('fr-FR', {
    month: 'short',
    year: 'numeric',
  });

  if (current) {
    return `${startFormatted} - Présent`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString('fr-FR', {
      month: 'short',
      year: 'numeric',
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

/**
 * Carte d'affichage d'une expérience professionnelle
 */
export default function ExperienceCard({ experience }: ExperienceCardProps) {
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

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle>{title}</CardTitle>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium mt-1 inline-flex items-center"
              >
                {company}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">{company}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location}</p>
          </div>
          {current && (
            <span className="px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
              En cours
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {formatDateRange(startDate, endDate, current)}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{description}</p>

        {/* Réalisations */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Réalisations:</h4>
            <ul className="list-disc list-inside space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
