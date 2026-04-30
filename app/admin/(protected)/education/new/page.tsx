'use client';
// app/admin/education/new/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import apiClient from '@/lib/admin/api-client';
import type { EducationInput } from '@/lib/schemas/education.schema';
import EducationForm from '@/components/admin/forms/EducationForm';

export default function NewEducationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(data: EducationInput) {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/education', data);
      router.push('/admin/education');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nouvelle formation</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <EducationForm onSubmit={handleSubmit} loading={loading} error={error ?? undefined} />
      </div>
    </div>
  );
}
