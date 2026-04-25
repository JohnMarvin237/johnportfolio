// components/sections/EducationCard.tsx
import React from 'react';
import Card from '../ui/Card';

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
  if (!education) return null;

  const { degree, institution, location, field, startDate, endDate, current, description, note } =
    education;

  const dateRange = `${formatYear(startDate)} - ${current ? 'En cours' : formatYear(endDate)}`;

  return (
    <Card className="h-full">
      {/* En-tête */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{degree}</h3>
        {field && (
          <p className="text-sm text-primary-600 font-medium mt-1">{field}</p>
        )}
      </div>

      {/* Institution et localisation */}
      <div className="mb-3">
        <p className="text-gray-700 font-medium">{institution}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <span>{location}</span>
          <span className="text-gray-400">•</span>
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}

      {/* Note */}
      {note && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note :</span> {note}
          </p>
        </div>
      )}

      {/* Indicateur de formation en cours */}
      {current && (
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <span className="mr-1.5 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            En cours
          </span>
        </div>
      )}
    </Card>
  );
}
