// app/admin/volunteer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl, formatDateRange } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Volunteer {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  createdAt: string;
}

export default function VolunteerAdminPage() {
  const [volunteer, setVolunteer] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const fetchVolunteer = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/volunteer'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des expériences bénévoles');
      }

      const data = await response.json();
      setVolunteer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteer();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience bénévole ?')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/volunteer/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchVolunteer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const columns: Column<Volunteer>[] = [
    {
      key: 'title',
      label: 'Poste',
      render: (vol) => (
        <div>
          <p className="font-medium text-gray-900">{vol.title}</p>
          <p className="text-sm text-gray-500">{vol.organization}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lieu',
      render: (vol) => (
        <span className="text-sm text-gray-900">{vol.location || '-'}</span>
      ),
    },
    {
      key: 'period',
      label: 'Période',
      render: (vol) => (
        <div>
          <p className="text-sm text-gray-900">
            {formatDateRange(vol.startDate, vol.endDate)}
          </p>
          {vol.current && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              En cours
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (vol) => (
        <p className="text-sm text-gray-500 max-w-xs truncate">{vol.description}</p>
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
    return <ErrorDisplay error={error} onRetry={fetchVolunteer} />;
  }

  return (
    <div>
      <PageHeader
        title="Bénévolat"
        description="Gérez vos expériences de bénévolat"
        actions={[
          {
            label: 'Ajouter une expérience',
            href: '/admin/volunteer/new',
            variant: 'primary',
          },
        ]}
      />

      <DataTable
        data={volunteer}
        columns={columns}
        onEdit={(vol) => window.location.href = `/admin/volunteer/${vol.id}/edit`}
        onDelete={handleDelete}
      />
    </div>
  );
}