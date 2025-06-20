import { MainNav } from "@/components/main-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function GigDetailLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ethr-black via-ethr-darkgray/90 to-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 bg-white/10" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 bg-white/10" />
              <Skeleton className="h-6 w-32 bg-white/10" />
              <Skeleton className="h-6 w-28 bg-white/10" />
            </div>
          </div>

          {/* Image Skeleton */}
          <Skeleton className="h-[400px] w-full mt-8 bg-white/10" />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48 bg-white/10" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
              </div>

              <Skeleton className="h-8 w-48 bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="h-[500px] w-full bg-white/10" />
            </div>
          </div>

          {/* Related Gigs Skeleton */}
          <div className="mt-16 space-y-6">
            <Skeleton className="h-8 w-48 bg-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-[300px] w-full bg-white/10" />
              <Skeleton className="h-[300px] w-full bg-white/10" />
              <Skeleton className="h-[300px] w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
