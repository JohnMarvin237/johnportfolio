// app/admin/certifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
  createdAt: string;
}

export default function CertificationsAdminPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/certifications'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des certifications');
      }

      const data = await response.json();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleDelete = async (cert: Certification) => {
    try {
      const response = await fetch(getApiUrl(`/certifications/${cert.id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchCertifications();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const columns: Column<Certification>[] = [
    {
      key: 'title',
      label: 'Certification',
      render: (cert) => (
        <div>
          <p className="font-medium text-gray-900">{cert.title}</p>
          <p className="text-sm text-gray-500">{cert.issuer}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Validité',
      render: (cert) => {
        if (!cert.issueDate) return <span className="text-gray-400">-</span>;

        const issueDate = new Date(cert.issueDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
        });

        if (cert.expiryDate) {
          const expiryDate = new Date(cert.expiryDate).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
          });
          const isExpired = new Date(cert.expiryDate) < new Date();

          return (
            <div>
              <p className="text-sm text-gray-900">{issueDate} - {expiryDate}</p>
              {isExpired && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Expiré
                </span>
              )}
            </div>
          );
        }

        return (
          <div>
            <p className="text-sm text-gray-900">Depuis {issueDate}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Valide
            </span>
          </div>
        );
      },
    },
    {
      key: 'credential',
      label: 'Credential',
      render: (cert) => (
        <div className="text-sm">
          {cert.credentialId && (
            <p className="text-gray-900">ID: {cert.credentialId}</p>
          )}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900"
            >
              Voir credential
            </a>
          )}
          {!cert.credentialId && !cert.credentialUrl && (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'skills',
      label: 'Compétences',
      render: (cert) => (
        <div className="flex flex-wrap gap-1">
          {cert.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{cert.skills.length - 3}
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
          title="Certifications"
          description="Gérer vos certifications professionnelles"
        />
        <ErrorDisplay error={error} onRetry={fetchCertifications} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Certifications"
        description="Gérer vos certifications professionnelles"
        action={{
          label: 'Nouvelle certification',
          href: '/admin/certifications/new',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        }}
      />

      <DataTable
        data={certifications}
        columns={columns}
        onDelete={handleDelete}
        editPath={(cert) => `/admin/certifications/${cert.id}/edit`}
        emptyMessage="Aucune certification pour le moment"
      />
    </div>
  );
}