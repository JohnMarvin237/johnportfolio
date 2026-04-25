// app/(public)/loading.tsx
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-14 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-14 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-5 w-3/5 mx-auto mb-2" />
          <Skeleton className="h-5 w-2/5 mx-auto mb-10" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Projects preview skeleton */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-72 mx-auto mb-12" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience preview skeleton */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-72 mx-auto mb-12" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
