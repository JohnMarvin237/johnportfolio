'use client';
// app/admin/volunteer/[id]/page.tsx — Edit volunteer entry
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { VolunteerInput } from '@/lib/schemas/volunteer.schema';
import VolunteerForm from '@/components/admin/forms/VolunteerForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVolunteerPage({ params }: PageProps) {
  const { id } = use(params);
  const [defaultValues, setDefaultValues] = useState<Partial<VolunteerInput> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get<VolunteerInput>(`/volunteer/${id}`)
      .then((res) => setDefaultValues(res.data))
      .catch(() => setFetchError("Impossible de charger l'activité bénévole."));
  }, [id]);

  async function handleSubmit(data: VolunteerInput) {
    setLoading(true);
    setSubmitError(null);
    try {
      await apiClient.put(`/volunteer/${id}`, data);
      router.push('/admin/volunteer');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Modifier l&apos;activité bénévole</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <VolunteerForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={loading}
          error={submitError ?? undefined}
        />
      </div>
    </div>
  );
}
