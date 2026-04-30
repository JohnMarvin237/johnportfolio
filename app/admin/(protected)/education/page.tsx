'use client';
// app/admin/education/page.tsx — Education list
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/ui/Button';

interface Education {
  id: string;
  degree: string;
  institution: string;
  current: boolean;
  order: number;
}

const COLUMNS: Column<Education>[] = [
  { key: 'degree', label: 'Diplôme' },
  { key: 'institution', label: 'Institution' },
  {
    key: 'current',
    label: 'En cours',
    render: (v) =>
      v ? (
        <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 text-xs font-medium">
          Oui
        </span>
      ) : null,
  },
  { key: 'order', label: 'Ordre' },
];

export default function EducationPage() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Education[]>('/education')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: Education) {
    await apiClient.delete(`/education/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formation</h1>
        <Button onClick={() => router.push('/admin/education/new')}>Nouveau</Button>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/education/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucune formation trouvée."
      />
    </div>
  );
}
