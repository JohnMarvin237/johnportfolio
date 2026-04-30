'use client';
// app/admin/projects/page.tsx — Projects list
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/ui/Button';

interface Project {
  id: string;
  title: string;
  organization: string | null;
  featured: boolean;
  order: number;
}

const COLUMNS: Column<Project>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'organization', label: 'Organisation', render: (v) => (v as string | null) ?? '—' },
  {
    key: 'featured',
    label: 'Mis en avant',
    render: (v) =>
      v ? (
        <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 text-xs font-medium">
          Oui
        </span>
      ) : (
        <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 text-xs font-medium">
          Non
        </span>
      ),
  },
  { key: 'order', label: 'Ordre' },
];

export default function ProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Project[]>('/projects')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: Project) {
    await apiClient.delete(`/projects/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projets</h1>
        <Button onClick={() => router.push('/admin/projects/new')}>Nouveau</Button>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/projects/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucun projet trouvé."
      />
    </div>
  );
}
