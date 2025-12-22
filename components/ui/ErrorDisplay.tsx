// components/ui/ErrorDisplay.tsx
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <svg
        className="mx-auto h-12 w-12 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Une erreur est survenue
      </h3>

      {error && (
        <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
          {error}
        </p>
      )}

      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      )}
    </div>
  );
}