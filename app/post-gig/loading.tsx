import { MainNav } from "@/components/main-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostGigLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 bg-white/5 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl bg-white/5 mx-auto" />
            <Skeleton className="h-4 w-3/4 bg-white/5 mx-auto mt-2" />
          </div>

          <div className="bg-ethr-darkgray/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden mb-8">
            <div className="grid grid-cols-5 divide-x divide-white/10">
              {[1, 2, 3, 4, 5].map((step) => (
                <Skeleton key={step} className="h-12 bg-white/5" />
              ))}
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {[1, 2, 3].map((section) => (
                <div key={section} className="space-y-4">
                  <Skeleton className="h-6 w-48 bg-white/5" />
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full bg-white/5" />
                    <Skeleton className="h-10 w-full bg-white/5" />
                    <Skeleton className="h-10 w-full bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-24 bg-white/5" />
            <Skeleton className="h-10 w-32 bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  )
}
