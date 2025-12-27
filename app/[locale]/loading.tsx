// app/loading.tsx
import SkeletonCard from '@/components/ui/SkeletonCard';

/**
 * Loading state for the home page
 * Displayed while the page is fetching data
 */
export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Status Badge Skeleton */}
            <div className="inline-block h-10 w-48 bg-gray-200 rounded-full mb-6 animate-pulse" />

            {/* Title Skeleton */}
            <div className="h-16 md:h-20 bg-gray-200 rounded-lg max-w-2xl mx-auto mb-6 animate-pulse" />

            {/* Subtitle Skeleton */}
            <div className="h-8 md:h-10 bg-gray-200 rounded-lg max-w-lg mx-auto mb-4 animate-pulse" />

            {/* Description Skeleton */}
            <div className="space-y-2 mb-8 max-w-2xl mx-auto">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6 mx-auto" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    </div>
  );
}