'use client';
// app/admin/volunteer/page.tsx — Volunteer list
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/ui/Button';

interface Volunteer {
  id: string;
  title: string;
  organization: string;
  current: boolean;
  order: number;
}

const COLUMNS: Column<Volunteer>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'organization', label: 'Organisation' },
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

export default function VolunteerPage() {
  const [data, setData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Volunteer[]>('/volunteer')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: Volunteer) {
    await apiClient.delete(`/volunteer/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bénévolat</h1>
        <Button onClick={() => router.push('/admin/volunteer/new')}>Nouveau</Button>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/volunteer/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucune activité bénévole trouvée."
      />
    </div>
  );
}
