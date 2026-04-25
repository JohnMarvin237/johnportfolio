// components/sections/EducationCard.tsx
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

function formatYear(date: Date | string | null | undefined): string {
  if (!date) return '';
  return String(new Date(date).getFullYear());
}

export default function EducationCard({ education }: { education: Education }) {
  const { degree, institution, location, field, startDate, endDate, current, description, gpa, note } =
    education;

  const dateRange = `${formatYear(startDate)} — ${current ? 'Présent' : formatYear(endDate)}`;

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow">
            <CardTitle>{degree}</CardTitle>
            {field && (
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">{field}</p>
            )}
            <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">{institution}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{location}</span>
              <span>•</span>
              <span>{dateRange}</span>
            </div>
          </div>
          {current && (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              En cours
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{description}</p>
        )}

        {gpa && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold">GPA :</span> {gpa}
          </p>
        )}

        {note && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Note :</span> {note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
