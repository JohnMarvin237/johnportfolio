// app/admin/experiences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DraggableExperienceTable from '@/components/admin/DraggableExperienceTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
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
  order: number;
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

      {experiences.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            Aucune expérience pour le moment
          </div>
        </div>
      ) : (
        <DraggableExperienceTable
          initialData={experiences}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}