// components/ui/DataWrapper.tsx
'use client';

import { ReactNode } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { cn } from '@/lib/utils';

interface DataWrapperProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
  loadingClassName?: string;
  children: ReactNode;
}

/**
 * Wrapper component to handle loading, error, and empty states
 * For use in Client Components
 */
export default function DataWrapper({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'Aucune donnée disponible',
  onRetry,
  className,
  loadingClassName,
  children,
}: DataWrapperProps) {
  // Loading state
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', loadingClassName)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} className={className} />;
  }

  // Empty state
  if (empty) {
    return (
      <div className={cn('text-center py-12', className)}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // Success state - render children
  return <>{children}</>;
}