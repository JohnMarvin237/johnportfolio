// app/admin/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { Column } from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getAuthHeaders = useAuthHeaders();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/contact'), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);

    // Mark as read if not already
    if (!message.read) {
      try {
        await fetch(getApiUrl(`/contact/${message.id}/read`), {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });

        // Update local state
        setMessages(prev =>
          prev.map(m => m.id === message.id ? { ...m, read: true } : m)
        );
      } catch (err) {
        console.error('Erreur lors du marquage comme lu:', err);
      }
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    try {
      const response = await fetch(getApiUrl(`/contact/${message.id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: 'status',
      label: '',
      render: (message) => (
        <div className="flex items-center">
          {!message.read && (
            <div className="h-2 w-2 bg-blue-600 rounded-full" title="Non lu" />
          )}
        </div>
      ),
      className: 'w-8',
    },
    {
      key: 'name',
      label: 'Nom',
      render: (message) => (
        <div>
          <p className="font-medium text-gray-900">{message.name}</p>
          <p className="text-sm text-gray-500">{message.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Objet',
      render: (message) => (
        <p className="text-sm text-gray-900">
          {message.subject || <span className="text-gray-400 italic">Sans objet</span>}
        </p>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (message) => (
        <p className="text-sm text-gray-500 truncate max-w-md">
          {message.message}
        </p>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (message) => (
        <p className="text-sm text-gray-500">
          {new Date(message.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Messages"
          description="Gérer les messages reçus via le formulaire de contact"
        />
        <ErrorDisplay error={error} onRetry={fetchMessages} />
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`${messages.length} message${messages.length > 1 ? 's' : ''} ${unreadCount > 0 ? `(${unreadCount} non lu${unreadCount > 1 ? 's' : ''})` : ''}`}
      />

      <DataTable
        data={messages}
        columns={columns}
        onEdit={handleView}
        onDelete={handleDelete}
        emptyMessage="Aucun message pour le moment"
      />

      {/* Message Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }}
        title="Détails du message"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Expéditeur</p>
                <p className="mt-1 text-sm text-gray-900">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-500"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedMessage.read
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedMessage.read ? 'Lu' : 'Non lu'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Objet</p>
              <p className="mt-1 text-sm text-gray-900">
                {selectedMessage.subject || <span className="italic">Sans objet</span>}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Message</p>
              <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Votre message'}`}
                className="flex-1"
              >
                <Button variant="primary" className="w-full justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Répondre par email
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMessage(null);
                }}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}