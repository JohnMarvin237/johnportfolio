import Skeleton from '@/components/ui/Skeleton'

// Info sidebar skeleton — mirrors the lg:col-span-1 card
function ContactInfoSkeleton() {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-900/20 p-6 space-y-6">
        {/* Card heading */}
        <Skeleton className="h-6 w-1/2" />

        {/* Contact info items — icon + label + value each */}
        <div className="space-y-6">
          {/* Email row */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-3/4 ml-7" />
          </div>

          {/* Phone row */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-2/3 ml-7" />
          </div>

          {/* Location row */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4 ml-7" />
          </div>

          {/* Availability row */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-2/3 ml-7" />
          </div>
        </div>

        {/* Social links */}
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </div>

        {/* FAQ divider + items */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Form skeleton — mirrors the lg:col-span-2 card
function ContactFormSkeleton() {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-900/20 p-8 space-y-6">
        {/* Card heading */}
        <Skeleton className="h-6 w-1/3" />

        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Subject field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Message textarea */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  )
}

export default function ContactLoading() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto max-w-2xl" />
        </div>

        {/* 3-col layout: info sidebar (1 col) + form (2 cols) */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ContactInfoSkeleton />
            <ContactFormSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
