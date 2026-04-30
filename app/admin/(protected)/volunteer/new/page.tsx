'use client';
// app/admin/volunteer/new/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { VolunteerInput } from '@/lib/schemas/volunteer.schema';
import VolunteerForm from '@/components/admin/forms/VolunteerForm';

export default function NewVolunteerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(data: VolunteerInput) {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/volunteer', data);
      router.push('/admin/volunteer');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nouvelle activité bénévole</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <VolunteerForm onSubmit={handleSubmit} loading={loading} error={error ?? undefined} />
      </div>
    </div>
  );
}
