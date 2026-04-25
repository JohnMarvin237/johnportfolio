import Skeleton from '@/components/ui/Skeleton'

// Single-column work/volunteer card skeleton (max-w-3xl timeline)
function TimelineCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 p-6 space-y-3 mb-8 last:mb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-5 w-28 shrink-0" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  )
}

// Grid card skeleton used for education and certifications (3-col)
function GridCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  )
}

// Technical Skills section — 3 static skill category cards
function SkillCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export default function ExperienceLoading() {
  return (
    <div className="py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto max-w-3xl" />
        </div>

        {/* Work experience — single column, max-w-3xl */}
        <section className="mt-20">
          <Skeleton className="h-9 w-56 mb-10" />
          <div className="max-w-3xl">
            <TimelineCardSkeleton />
            <TimelineCardSkeleton />
            <TimelineCardSkeleton />
          </div>
        </section>

        {/* Education — 3-col grid */}
        <section className="mt-20">
          <Skeleton className="h-9 w-40 mb-10" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GridCardSkeleton />
            <GridCardSkeleton />
            <GridCardSkeleton />
          </div>
        </section>

        {/* Certifications — 3-col grid */}
        <section className="mt-20">
          <Skeleton className="h-9 w-52 mb-10" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GridCardSkeleton />
            <GridCardSkeleton />
            <GridCardSkeleton />
          </div>
        </section>

        {/* Volunteer — single column, max-w-3xl */}
        <section className="mt-20">
          <Skeleton className="h-9 w-44 mb-10" />
          <div className="space-y-6 max-w-3xl">
            <TimelineCardSkeleton />
            <TimelineCardSkeleton />
          </div>
        </section>

        {/* Technical Skills — 3-col grid (always rendered, mirrors real page) */}
        <section className="mt-20">
          <Skeleton className="h-9 w-48 mb-10" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SkillCardSkeleton />
            <SkillCardSkeleton />
            <SkillCardSkeleton />
          </div>
        </section>
      </div>
    </div>
  )
}
