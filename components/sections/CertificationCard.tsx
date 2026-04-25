// components/sections/CertificationCard.tsx
'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: Date | string | null;
  expiryDate?: Date | string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  skills: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' });
}

export default function CertificationCard({ certification }: { certification: Certification }) {
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, description, skills } =
    certification;

  const expired = expiryDate ? new Date(expiryDate) < new Date() : false;

  return (
    <Card hover className={`h-full flex flex-col relative ${expired ? 'opacity-75' : ''}`}>
      {expired && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded">
            Expirée
          </span>
        </div>
      )}

      {/* Icône */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{issuer}</p>

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
          {issueDate && <p>Délivrée le {formatDate(issueDate)}</p>}
          {expiryDate && (
            <p className={expired ? 'text-red-600 dark:text-red-400' : ''}>
              {expired ? 'Expirée le' : 'Expire le'} {formatDate(expiryDate)}
            </p>
          )}
        </div>

        {credentialId && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ID : {credentialId}</p>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        {description && (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{description}</p>
        )}

        {skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Compétences validées :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {credentialUrl && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(credentialUrl!, '_blank')}
            className="w-full"
          >
            Voir la certification
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
