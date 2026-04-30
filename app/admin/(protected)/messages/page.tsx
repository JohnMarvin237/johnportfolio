'use client';
// app/admin/messages/page.tsx — Contact messages list
// useSearchParams() requires a Suspense boundary; MessagesPageInner is wrapped below.
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { ContactMessage } from '@/lib/admin/types';
import type { Column } from '@/components/admin/AdminTable';
import AdminTable from '@/components/admin/AdminTable';

const COLUMNS: Column<ContactMessage>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Sujet', render: (v) => (v as string | null) ?? '—' },
  {
    key: 'createdAt',
    label: 'Date',
    render: (v) => new Date(v as string).toLocaleDateString('fr-CA'),
  },
  {
    key: 'read',
    label: 'Lu',
    render: (v) =>
      v ? (
        <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 text-xs font-medium">
          Lu
        </span>
      ) : (
        <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-medium">
          Non lu
        </span>
      ),
  },
];

function MessagesPageInner() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get('unread') === 'true';

  const fetchData = useCallback(() => {
    setLoading(true);
    const url = unreadOnly ? '/messages?unread=true' : '/messages';
    apiClient
      .get<ContactMessage[]>(url)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [unreadOnly]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(item: ContactMessage) {
    await apiClient.delete(`/messages/${item.id}`);
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          {unreadOnly && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Affichage des messages non lus uniquement.{' '}
              <button
                onClick={() => router.push('/admin/messages')}
                className="text-primary-600 dark:text-primary-400 underline"
              >
                Voir tous
              </button>
            </p>
          )}
        </div>
      </div>
      <AdminTable
        data={data}
        columns={COLUMNS}
        loading={loading}
        onEdit={(item) => router.push(`/admin/messages/${item.id}`)}
        onDelete={handleDelete}
        emptyMessage="Aucun message trouvé."
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-gray-500 dark:text-gray-400">Chargement...</p>}>
      <MessagesPageInner />
    </Suspense>
  );
}
