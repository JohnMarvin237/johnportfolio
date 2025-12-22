// app/experience/loading.tsx
export default function Loading() {
  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" />
        </div>

        {/* Experience Section Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-200 rounded max-w-sm mb-8 animate-pulse" />
          <div className="grid grid-cols-1 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3 max-w-md" />
                <div className="h-5 bg-gray-200 rounded mb-2 max-w-sm" />
                <div className="h-4 bg-gray-200 rounded mb-4 max-w-xs" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-200 rounded max-w-sm mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-5 bg-gray-200 rounded mb-2 w-4/5" />
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/5" />
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section Skeleton */}
        <section>
          <div className="h-8 bg-gray-200 rounded max-w-sm mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}