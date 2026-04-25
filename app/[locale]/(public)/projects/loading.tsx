// app/projects/loading.tsx
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function Loading() {
  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto mb-6 animate-pulse" />
          <div className="flex items-center justify-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}