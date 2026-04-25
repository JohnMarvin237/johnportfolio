'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableItem = Record<string, any>

export interface ColumnDef {
  key: string
  label: string
  type?:
    | 'withSub'
    | 'tags'
    | 'date'
    | 'period'
    | 'expiry'
    | 'fallback'
    | 'badge'
  // withSub
  subKey?: string
  badgeKey?: string
  badgeLabel?: string
  // tags
  maxTags?: number
  // period
  startKey?: string
  endKey?: string
  currentKey?: string
  // fallback
  fallback?: string
}

export interface AdminTableProps {
  items: TableItem[]
  columns: ColumnDef[]
  baseUrl: string
  entityName: string
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * Render a cell based on column type.
 * Supported types:
 *   - (default): item[col.key]
 *   - 'withSub': bold key + subtitle from col.subKey
 *   - 'tags': array as badges, col.maxTags to limit
 *   - 'date': formatted date
 *   - 'period': startKey - endKey or "Present", uses col.startKey/col.endKey/col.currentKey
 *   - 'badge': show badge if item[col.conditionKey] is true, col.badgeLabel
 *   - 'expiry': date with expired indicator
 *   - 'fallback': show item[col.key] or col.fallback
 */
function renderCell(item: TableItem, col: ColumnDef): React.ReactNode {
  switch (col.type) {
    case 'withSub':
      return (
        <div>
          <p className="font-medium">{item[col.key]}</p>
          {col.subKey && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{item[col.subKey]}</p>
          )}
          {col.badgeKey && item[col.badgeKey] && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mt-1">
              {col.badgeLabel || col.badgeKey}
            </span>
          )}
        </div>
      )

    case 'tags': {
      const tags = item[col.key] || []
      const max = col.maxTags || tags.length
      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {tags.slice(0, max).map((t: string) => (
            <span key={t} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
              {t}
            </span>
          ))}
          {tags.length > max && (
            <span className="text-xs text-gray-500">+{tags.length - max}</span>
          )}
        </div>
      )
    }

    case 'date':
      return formatDate(item[col.key])

    case 'period': {
      const start = formatDate(item[col.startKey || 'startDate'])
      const isCurrent = item[col.currentKey || 'current']
      const end = isCurrent ? 'Present' : formatDate(item[col.endKey || 'endDate'])
      return <span>{start} - {end}</span>
    }

    case 'expiry': {
      if (!item[col.key]) return '-'
      const expired = new Date(item[col.key]) < new Date()
      return (
        <span className={expired ? 'text-red-600 dark:text-red-400' : ''}>
          {formatDate(item[col.key])}
          {expired && ' (expirée)'}
        </span>
      )
    }

    case 'fallback':
      return item[col.key] || col.fallback || '-'

    default:
      return item[col.key] ?? ''
  }
}

export default function AdminTable({ items, columns, baseUrl, entityName }: AdminTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  // Inline error state replaces alert() — shown in the table UI instead of blocking browser dialog
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/${baseUrl}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        setDeleteError(data.error || 'Erreur lors de la suppression')
      }
    } catch {
      setDeleteError('Erreur réseau')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {deleteError && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            aria-label="Fermer"
            className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-300"
          >
            &times;
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun {entityName} pour le moment.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {renderCell(item, col)}
                  </td>
                ))}
                <td className="px-6 py-4 text-right text-sm space-x-2 whitespace-nowrap">
                  <Link
                    href={`/admin/${baseUrl}/${item.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    Modifier
                  </Link>
                  {confirmId === item.id ? (
                    <span className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === item.id ? '...' : 'Confirmer'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmId(item.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
