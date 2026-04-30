'use client';
// app/admin/certifications/page.tsx — Certifications list
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/ui/Button';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  order: number;
}

const COLUMNS: Column<Certification>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'issuer', label: 'Émetteur' },
  { key: 'order', label: 'Ordre' },
];

export default function CertificationsPage() {
  const [data, setData] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(() => {
    setLoading(true);
    apiClient
      .get<Certification[]>('/certifications')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: Certification) {
    await apiClient.delete(`/certifications/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
        <Button onClick={() => router.push('/admin/certifications/new')}>Nouveau</Button>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/certifications/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucune certification trouvée."
      />
    </div>
  );
}
