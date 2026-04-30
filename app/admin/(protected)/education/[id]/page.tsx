'use client';
// app/admin/education/[id]/page.tsx — Edit education entry
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { EducationInput } from '@/lib/schemas/education.schema';
import EducationForm from '@/components/admin/forms/EducationForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEducationPage({ params }: PageProps) {
  const { id } = use(params);
  const [defaultValues, setDefaultValues] = useState<Partial<EducationInput> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get<EducationInput>(`/education/${id}`)
      .then((res) => setDefaultValues(res.data))
      .catch(() => setFetchError("Impossible de charger la formation."));
  }, [id]);

  async function handleSubmit(data: EducationInput) {
    setLoading(true);
    setSubmitError(null);
    try {
      await apiClient.put(`/education/${id}`, data);
      router.push('/admin/education');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Une erreur est survenue lors de la mise à jour.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetchError) return <p className="text-red-600 dark:text-red-400">{fetchError}</p>;
  if (!defaultValues) return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Modifier la formation</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <EducationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={loading}
          error={submitError ?? undefined}
        />
      </div>
    </div>
  );
}
