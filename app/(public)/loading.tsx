import Skeleton from '@/components/ui/Skeleton'

// Project card skeleton used in the featured grid
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

// Experience card skeleton used in the recent-experience column
function ExperienceCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 p-6 space-y-3 mb-8 last:mb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-5 w-24 shrink-0" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  )
}

// Hero section skeleton — mirrors the Hero component layout (profile image + text + CTA)
function HeroSkeleton() {
  return (
    <section className="relative py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Profile image */}
          <Skeleton className="h-40 w-40 rounded-full" />
          {/* Name */}
          <Skeleton className="h-10 w-64" />
          {/* Subtitle */}
          <Skeleton className="h-6 w-80" />
          {/* Description lines */}
          <div className="space-y-2 w-full max-w-lg">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          {/* CTA buttons */}
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomeLoading() {
  return (
    <>
      {/* Hero */}
      <HeroSkeleton />

      {/* Featured Projects section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>

          {/* 3-col project card grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>

          {/* View all button */}
          <div className="mt-12 flex justify-center">
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
      </section>

      {/* Recent Experience section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-72 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          {/* Single-column experience cards (max-w-3xl) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <ExperienceCardSkeleton />
            <ExperienceCardSkeleton />
          </div>

          {/* View all button */}
          <div className="mt-12 flex justify-center">
            <Skeleton className="h-11 w-48" />
          </div>
        </div>
      </section>
    </>
  )
}
