// app/(public)/experience/loading.tsx
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton';

export default function ExperienceLoading() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-52 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto mb-2" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Experiences timeline */}
        <section className="mb-16">
          <Skeleton className="h-8 w-56 mb-8" />
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                <SkeletonCard />
              </div>
            ))}
          </div>
        </section>

        {/* Education grid */}
        <section className="mb-16">
          <Skeleton className="h-8 w-40 mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        {/* Certifications grid */}
        <section className="mb-16">
          <Skeleton className="h-8 w-44 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        {/* Volunteer grid */}
        <section>
          <Skeleton className="h-8 w-36 mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
