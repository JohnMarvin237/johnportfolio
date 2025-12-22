// components/ui/SkeletonCard.tsx
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export default function SkeletonCard({ className, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6 animate-pulse', className)}>
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 rounded-lg mb-4" />

      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

      {/* Description skeleton */}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded mb-2" style={{ width: `${100 - (i * 15)}%` }} />
      ))}

      {/* Button skeletons */}
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-gray-200 rounded-lg w-24" />
        <div className="h-10 bg-gray-200 rounded-lg w-24" />
      </div>
    </div>
  );
}