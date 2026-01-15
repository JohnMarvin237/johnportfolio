// app/admin/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/projects'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (project: Project) => {
    try {
      const response = await fetch(getApiUrl(`/projects/${project.id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Refresh the list
      await fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const columns: Column<Project>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (project) => (
        <div>
          <p className="font-medium text-gray-900">{project.title}</p>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            {project.description}
          </p>
        </div>
      ),
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (project) => (
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs text-gray-500">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'links',
      label: 'Liens',
      render: (project) => (
        <div className="flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900 text-sm"
            >
              Démo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              GitHub
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (project) => (
        project.featured ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Featured
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Non</span>
        )
      ),
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      render: (project) => (
        <span className="text-sm text-gray-500">
          {new Date(project.createdAt).toLocaleDateString('fr-FR')}
        </span>
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
          title="Projets"
          description="Gérer les projets de votre portfolio"
        />
        <ErrorDisplay error={error} onRetry={fetchProjects} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Projets"
        description="Gérer les projets de votre portfolio"
        action={{
          label: 'Nouveau projet',
          href: '/admin/projects/new',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
        }}
      />

      <DataTable
        data={projects}
        columns={columns}
        onDelete={handleDelete}
        editPath={(project) => `/admin/projects/${project.id}/edit`}
        emptyMessage="Aucun projet pour le moment"
      />
    </div>
  );
}