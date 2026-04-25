// app/[locale]/(public)/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="relative mx-auto w-24 h-24">
          {/* Animated circles */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping animation-delay-200" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping animation-delay-400" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}