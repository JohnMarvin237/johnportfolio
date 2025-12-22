// app/admin/education/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl, formatDateRange } from '@/lib/utils';
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
  createdAt: string;
}

export default function EducationAdminPage() {
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

  const columns: Column<Education>[] = [
    {
      key: 'degree',
      label: 'Diplôme',
      render: (edu) => (
        <div>
          <p className="font-medium text-gray-900">{edu.degree}</p>
          <p className="text-sm text-gray-500">{edu.field}</p>
        </div>
      ),
    },
    {
      key: 'institution',
      label: 'Institution',
      render: (edu) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{edu.institution}</p>
          <p className="text-sm text-gray-500">{edu.location}</p>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Période',
      render: (edu) => (
        <div>
          <p className="text-sm text-gray-900">
            {formatDateRange(edu.startDate, edu.endDate)}
          </p>
          {edu.current && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              En cours
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'gpa',
      label: 'GPA',
      render: (edu) => (
        edu.gpa ? (
          <span className="text-sm text-gray-900">{edu.gpa.toFixed(2)}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
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
          href: '/admin/education/new',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        }}
      />

      <DataTable
        data={education}
        columns={columns}
        onDelete={handleDelete}
        editPath={(edu) => `/admin/education/${edu.id}/edit`}
        emptyMessage="Aucune formation pour le moment"
      />
    </div>
  );
}