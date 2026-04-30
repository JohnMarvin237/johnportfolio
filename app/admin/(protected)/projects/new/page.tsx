'use client';
// app/admin/projects/new/page.tsx — Create a new project
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { ProjectInput } from '@/lib/schemas/project.schema';
import ProjectForm from '@/components/admin/forms/ProjectForm';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(data: ProjectInput) {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/projects', data);
      router.push('/admin/projects');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Une erreur est survenue lors de la création.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nouveau projet</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <ProjectForm onSubmit={handleSubmit} loading={loading} error={error ?? undefined} />
      </div>
    </div>
  );
}
