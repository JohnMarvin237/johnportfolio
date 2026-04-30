'use client';
// components/admin/AdminTable.tsx
// Generic typed table with edit/delete actions and loading/empty states.
import { useState } from 'react';
import Button from '@/components/ui/Button';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void | Promise<void>;
  loading?: boolean;
  emptyMessage?: string;
}

function TableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-gray-100 dark:border-gray-700">
          {Array.from({ length: columnCount + 1 }).map((__, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AdminTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'Aucun élément trouvé.',
}: AdminTableProps<T>) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  function getCellValue(row: T, key: keyof T | string): unknown {
    return (row as Record<string, unknown>)[key as string];
  }

  const hasActions = !!(onEdit || onDelete);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton columnCount={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-0"
                >
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="px-4 py-3 text-gray-700 dark:text-gray-300"
                    >
                      {col.render
                        ? col.render(getCellValue(row, col.key), row)
                        : String(getCellValue(row, col.key) ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(row)}
                            aria-label="Modifier"
                          >
                            Modifier
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDelete(row)}
                            aria-label="Supprimer"
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Confirmer la suppression"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </>
  );
}
