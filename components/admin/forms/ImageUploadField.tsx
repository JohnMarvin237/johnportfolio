'use client';
// components/admin/forms/ImageUploadField.tsx
// Drag-and-drop image uploader that POSTs to /api/upload via the admin API client.
// Uses 'use client' because it manages upload state, handles drag events, and reads the file input.
import { useRef, useState } from 'react';
import Image from 'next/image';
import apiClient from '@/lib/admin/api-client';

interface ImageUploadFieldProps {
  currentUrl?: string | null;
  onUpload: (url: string, publicId: string) => void;
  onClear?: () => void;
  error?: string;
  label?: string;
}

export default function ImageUploadField({
  currentUrl,
  onUpload,
  onClear,
  error,
  label,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<{ url: string; publicId: string }>(
        '/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onUpload(response.data.url, response.data.publicId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'upload. Veuillez réessayer.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so re-selecting the same file triggers onChange again
    e.target.value = '';
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleZoneClick() {
    inputRef.current?.click();
  }

  function handleZoneKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </span>
      )}

      {currentUrl ? (
        <div className="flex flex-col items-start gap-3">
          <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={currentUrl}
              alt="Aperçu de l'image du projet"
              fill
              style={{ objectFit: 'cover' }}
              sizes="200px"
            />
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-red-600 dark:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
            >
              Supprimer l&apos;image
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Zone de dépôt d'image. Cliquez ou glissez une image ici."
          onClick={handleZoneClick}
          onKeyDown={handleZoneKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            'relative flex flex-col items-center justify-center gap-2',
            'min-h-[160px] w-full rounded-lg border-2 border-dashed',
            'cursor-pointer select-none transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            isDragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800/50',
          ].join(' ')}
        >
          {uploading ? (
            <>
              {/* Spinner */}
              <svg
                className="h-6 w-6 animate-spin text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400">Upload en cours...</span>
            </>
          ) : (
            <>
              {/* Upload icon */}
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-4">
                Glissez une image ici ou{' '}
                <span className="text-primary-500 font-medium">cliquez pour sélectionner</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                JPEG, PNG, WebP, GIF
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            disabled={uploading}
          />
        </div>
      )}

      {/* Upload error (internal, from the API call) */}
      {uploadError && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {uploadError}
        </p>
      )}

      {/* Validation error (from the form schema, passed via props) */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
