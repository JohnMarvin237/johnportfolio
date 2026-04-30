'use client';
// app/admin/experiences/page.tsx — Experiences list
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/ui/Button';

interface Experience {
  id: string;
  title: string;
  company: string;
  current: boolean;
  order: number;
}

const COLUMNS: Column<Experience>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'company', label: 'Entreprise' },
  {
    key: 'current',
    label: 'Actuel',
    render: (v) =>
      v ? (
        <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 text-xs font-medium">
          Oui
        </span>
      ) : null,
  },
  { key: 'order', label: 'Ordre' },
];

export default function ExperiencesPage() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Experience[]>('/experiences')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: Experience) {
    await apiClient.delete(`/experiences/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expériences</h1>
        <Button onClick={() => router.push('/admin/experiences/new')}>Nouveau</Button>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/experiences/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucune expérience trouvée."
      />
    </div>
  );
}
