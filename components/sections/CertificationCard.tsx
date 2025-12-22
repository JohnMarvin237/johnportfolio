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

export interface CertificationCardProps {
  certification: Certification;
}

/**
 * Formate une date
 */
function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Vérifie si une certification est expirée
 */
function isExpired(expiryDate: Date | string | null | undefined): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

/**
 * Carte d'affichage d'une certification
 */
export default function CertificationCard({ certification }: CertificationCardProps) {
  const {
    title,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    description,
    skills,
  } = certification;

  const expired = isExpired(expiryDate);

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-gray-600 font-medium mt-1">{issuer}</p>

        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          {issueDate && (
            <span>Délivrée: {formatDate(issueDate)}</span>
          )}
          {expiryDate && (
            <span className={expired ? 'text-red-600' : ''}>
              {expired ? 'Expirée' : 'Expire'}: {formatDate(expiryDate)}
            </span>
          )}
        </div>

        {credentialId && (
          <p className="text-xs text-gray-500 mt-2">
            ID: {credentialId}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-grow">
        {description && (
          <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Compétences acquises:
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Action - Voir le certificat */}
      {credentialUrl && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(credentialUrl, '_blank')}
            className="w-full"
          >
            Voir le certificat
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
