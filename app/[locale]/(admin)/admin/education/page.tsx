// app/[locale]/admin/education/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/admin/PageHeader';
import DraggableEducationTable from '@/components/admin/DraggableEducationTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Education {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  description?: string;
  order: number;
  createdAt: string;
}

export default function EducationAdminPage() {
  const params = useParams();
  const locale = params?.locale as string || 'fr';
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/education'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des formations');
      }

      const data = await response.json();
      setEducation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleDelete = async (edu: Education) => {
    try {
      const response = await fetch(getApiUrl(`/education/${edu.id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchEducation();
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
          title="Formation"
          description="Gérer votre parcours académique"
        />
        <ErrorDisplay error={error} onRetry={fetchEducation} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Formation"
        description="Gérer votre parcours académique"
        action={{
          label: 'Nouvelle formation',
          href: `/${locale}/admin/education/new`,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        }}
      />

      {education.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            Aucune formation pour le moment
          </div>
        </div>
      ) : (
        <DraggableEducationTable
          initialData={education}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}