// components/admin/DraggableEducationTable.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { formatDateRange } from '@/lib/utils';
import { getApiUrl } from '@/lib/utils';
import { useAuthHeaders } from '@/lib/hooks/useAuth';

interface Education {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  order: number;
  createdAt: string;
}

interface DraggableEducationTableProps {
  initialData: Education[];
  onDelete: (education: Education) => void;
}

export default function DraggableEducationTable({
  initialData,
  onDelete
}: DraggableEducationTableProps) {
  const [educations, setEducations] = useState<Education[]>(initialData);
  const [draggedItem, setDraggedItem] = useState<Education | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<Education | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const getAuthHeaders = useAuthHeaders();

  useEffect(() => {
    setEducations(initialData);
  }, [initialData]);

  const handleDragStart = (e: React.DragEvent, item: Education) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, item: Education) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== item.id) {
      setDraggedOverItem(item);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, droppedOnItem: Education) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === droppedOnItem.id) {
      setDraggedItem(null);
      setDraggedOverItem(null);
      return;
    }

    // Create a copy of educations
    const newEducations = [...educations];
    const draggedIndex = newEducations.findIndex((edu) => edu.id === draggedItem.id);
    const droppedIndex = newEducations.findIndex((edu) => edu.id === droppedOnItem.id);

    // Remove dragged item and insert at new position
    const [removed] = newEducations.splice(draggedIndex, 1);
    newEducations.splice(droppedIndex, 0, removed);

    // Update order property for all items
    const reorderedEducations = newEducations.map((edu, index) => ({
      ...edu,
      order: index + 1,
    }));

    // Update local state immediately for better UX
    setEducations(reorderedEducations);
    setDraggedItem(null);
    setDraggedOverItem(null);

    // Send update to server
    try {
      setIsUpdating(true);
      const updates = reorderedEducations.map((edu) => ({
        id: edu.id,
        order: edu.order,
      }));

      const response = await fetch(getApiUrl('/education/reorder'), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'ordre');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert to original order on error
      setEducations(initialData);
      alert('Erreur lors de la sauvegarde de l\'ordre. Veuillez réessayer.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (education: Education) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?');
    if (!confirmed) return;

    setDeletingId(education.id);
    try {
      await onDelete(education);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mise à jour de l'ordre...</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="w-12 px-4 py-3">
                <span className="sr-only">Drag handle</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Diplôme
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Institution
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Lieu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Période
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {educations.map((education) => (
              <tr
                key={education.id}
                draggable
                onDragStart={(e) => handleDragStart(e, education)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, education)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, education)}
                className={`
                  cursor-move transition-all duration-200
                  ${draggedOverItem?.id === education.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  ${draggedItem?.id === education.id ? 'opacity-50' : ''}
                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                `}
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{education.degree}</p>
                    {education.field && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{education.field}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {education.institution}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {education.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDateRange(education.startDate, education.endDate)}
                    </p>
                    {education.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                        En cours
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/education/${education.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(education)}
                      disabled={deletingId === education.id}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      {deletingId === education.id ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Glissez et déposez les lignes pour réorganiser l'ordre d'affichage sur le site
        </p>
      </div>
    </div>
  );
}