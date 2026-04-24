import Skeleton from '@/components/ui/Skeleton'

function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectsLoading() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-56 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto max-w-2xl" />
        </div>

        {/* Featured projects section */}
        <div className="mt-16">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        </div>

        {/* Other projects section */}
        <div className="mt-16">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
