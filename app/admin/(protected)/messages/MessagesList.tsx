'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

interface MessagesListProps {
  initialMessages: ContactMessage[]
}

export default function MessagesList({ initialMessages }: MessagesListProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        )
        router.refresh()
      }
    } catch {
      alert('Erreur lors de la mise a jour')
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur reseau')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center text-gray-500 dark:text-gray-400">
        Aucun message pour le moment.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all ${
            !message.read ? 'border-l-4 border-primary-500' : ''
          }`}
        >
          {/* Header */}
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {!message.read && (
                  <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full" />
                )}
                <div className="min-w-0">
                  <p className={`text-sm truncate ${!message.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {message.name} &lt;{message.email}&gt;
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {message.subject || '(Sans sujet)'} - {message.message.substring(0, 80)}
                    {message.message.length > 80 ? '...' : ''}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4 text-xs text-gray-400">
                {formatDate(message.createdAt)}
              </div>
            </div>
          </div>

          {/* Expanded content */}
          {expandedId === message.id && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">De :</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{message.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Email :</span>
                    <a href={`mailto:${message.email}`} className="ml-2 text-primary-600 dark:text-primary-400 hover:underline">
                      {message.email}
                    </a>
                  </div>
                </div>
                {message.subject && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Sujet :</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{message.subject}</span>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {message.message}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => toggleRead(message.id, message.read)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {message.read ? 'Marquer non lu' : 'Marquer lu'}
                  </button>
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject || 'Votre message'}`}
                    className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    Repondre
                  </a>
                  {confirmDeleteId === message.id ? (
                    <span className="inline-flex items-center gap-1 ml-auto">
                      <button
                        onClick={() => handleDelete(message.id)}
                        disabled={deletingId === message.id}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === message.id ? '...' : 'Confirmer'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(message.id)}
                      className="ml-auto px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
