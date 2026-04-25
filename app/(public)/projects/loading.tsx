// app/(public)/projects/loading.tsx
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton';

export default function ProjectsLoading() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto mb-2" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Featured projects */}
        <div className="mb-16">
          <Skeleton className="h-8 w-52 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} className="h-72" />
            ))}
          </div>
        </div>

        {/* Other projects */}
        <div>
          <Skeleton className="h-8 w-44 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
