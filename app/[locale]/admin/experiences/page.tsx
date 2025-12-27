// app/admin/experiences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl, formatDateRange } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  createdAt: string;
}

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/experiences'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des expériences');
      }

      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (experience: Experience) => {
    try {
      const response = await fetch(getApiUrl(`/experiences/${experience.id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchExperiences();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const columns: Column<Experience>[] = [
    {
      key: 'title',
      label: 'Poste',
      render: (exp) => (
        <div>
          <p className="font-medium text-gray-900">{exp.title}</p>
          <p className="text-sm text-gray-500">{exp.company}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lieu',
    },
    {
      key: 'period',
      label: 'Période',
      render: (exp) => (
        <div>
          <p className="text-sm text-gray-900">
            {formatDateRange(exp.startDate, exp.endDate)}
          </p>
          {exp.current && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Actuel
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'achievements',
      label: 'Réalisations',
      render: (exp) => (
        <p className="text-sm text-gray-500">
          {exp.achievements.length} réalisation{exp.achievements.length > 1 ? 's' : ''}
        </p>
      ),
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (exp) => (
        <div className="flex flex-wrap gap-1">
          {exp.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tech}
            </span>
          ))}
          {exp.technologies.length > 3 && (
            <span className="text-xs text-gray-500">
              +{exp.technologies.length - 3}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Expériences"
          description="Gérer vos expériences professionnelles"
        />
        <ErrorDisplay error={error} onRetry={fetchExperiences} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Expériences"
        description="Gérer vos expériences professionnelles"
        action={{
          label: 'Nouvelle expérience',
          href: '/admin/experiences/new',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        }}
      />

      <DataTable
        data={experiences}
        columns={columns}
        onDelete={handleDelete}
        editPath={(exp) => `/admin/experiences/${exp.id}/edit`}
        emptyMessage="Aucune expérience pour le moment"
      />
    </div>
  );
}