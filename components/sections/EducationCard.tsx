// components/sections/EducationCard.tsx
'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  field?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description?: string | null;
  gpa?: string | null;
  note?: string | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EducationCardProps {
  education: Education;
}

/**
 * Formate une plage de dates
 */
function formatDateRange(
  startDate: Date | string,
  endDate: Date | string | null | undefined,
  current: boolean
): string {
  const start = new Date(startDate);
  const startYear = start.getFullYear();

  if (current) {
    return `${startYear} - Présent`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endYear = end.getFullYear();
    return `${startYear} - ${endYear}`;
  }

  return startYear.toString();
}

/**
 * Carte d'affichage d'une formation académique
 */
export default function EducationCard({ education }: EducationCardProps) {
  const {
    degree,
    institution,
    location,
    field,
    startDate,
    endDate,
    current,
    description,
    gpa,
    note,
  } = education;

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle>{degree}</CardTitle>
            {field && (
              <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">{field}</p>
            )}
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">{institution}</p>
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
        {description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{description}</p>
        )}

        {gpa && (
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">GPA: </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{gpa}</span>
          </div>
        )}

        {note && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Note: </span>
              {note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
