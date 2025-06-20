import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ethr-black via-ethr-darkgray/90 to-ethr-black pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section Skeleton */}
        <Skeleton className="h-12 w-64 bg-white/5 mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl bg-white/5 mb-10" />

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <Skeleton className="h-14 w-full bg-white/5 rounded-full" />
          <Skeleton className="h-14 w-32 bg-white/5 rounded-full md:w-32 w-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton - Hidden on mobile */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="space-y-6">
              <Skeleton className="h-8 w-40 bg-white/5 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-6 w-full bg-white/5" />
                ))}
              </div>

              <div className="pt-6">
                <Skeleton className="h-8 w-40 bg-white/5 mb-4" />
                <Skeleton className="h-10 w-full bg-white/5 mb-3" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-full bg-white/5" />
                  <Skeleton className="h-10 w-full bg-white/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Gig Listings Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-10 w-full bg-white/5 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full bg-white/5 rounded-xl" />
              ))}
            </div>

            <Skeleton className="h-10 w-full max-w-md mx-auto bg-white/5 mt-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
