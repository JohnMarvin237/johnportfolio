'use client';
// app/admin/experiences/[id]/page.tsx — Edit experience
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { ExperienceInput } from '@/lib/schemas/experience.schema';
import ExperienceForm from '@/components/admin/forms/ExperienceForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditExperiencePage({ params }: PageProps) {
  const { id } = use(params);
  const [defaultValues, setDefaultValues] = useState<Partial<ExperienceInput> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get<ExperienceInput>(`/experiences/${id}`)
      .then((res) => setDefaultValues(res.data))
      .catch(() => setFetchError("Impossible de charger l'expérience."));
  }, [id]);

  async function handleSubmit(data: ExperienceInput) {
    setLoading(true);
    setSubmitError(null);
    try {
      await apiClient.put(`/experiences/${id}`, data);
      router.push('/admin/experiences');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Modifier l&apos;expérience</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <ExperienceForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={loading}
          error={submitError ?? undefined}
        />
      </div>
    </div>
  );
}
