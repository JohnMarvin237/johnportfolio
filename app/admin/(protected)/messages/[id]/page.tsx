'use client';
// app/admin/messages/[id]/page.tsx — View a single contact message
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/admin/api-client';
import type { ContactMessage } from '@/lib/admin/types';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MessageDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // The messages list endpoint returns all messages; we find ours by id
    apiClient
      .get<ContactMessage[]>('/messages')
      .then((res) => {
        const found = res.data.find((m) => m.id === id);
        if (!found) {
          setFetchError('Message introuvable.');
        } else {
          setMessage(found);
        }
      })
      .catch(() => setFetchError('Impossible de charger le message.'));
  }, [id]);

  async function handleMarkRead() {
    if (!message) return;
    setMarkingRead(true);
    try {
      await apiClient.patch(`/messages/${id}`, { read: true });
      setMessage({ ...message, read: true });
    } finally {
      setMarkingRead(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await apiClient.delete(`/messages/${id}`);
      router.push('/admin/messages');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (fetchError) {
    return (
      <div>
        <p className="text-red-600 dark:text-red-400">{fetchError}</p>
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/messages')} className="mt-4">
          Retour aux messages
        </Button>
      </div>
    );
  }

  if (!message) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/messages')}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">De</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{message.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Date</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(message.createdAt).toLocaleDateString('fr-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {message.subject && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Sujet</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{message.subject}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Message</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {message.read ? (
            <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 text-xs font-medium">
              Lu
            </span>
          ) : (
            <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-medium">
              Non lu
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        {!message.read && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkRead}
            disabled={markingRead}
          >
            {markingRead ? 'Marquage...' : 'Marquer comme lu'}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Supprimer
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Supprimer le message"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer ce message ?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={deleting}
      />
    </div>
  );
}
