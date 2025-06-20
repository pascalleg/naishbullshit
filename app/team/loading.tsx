import { Skeleton } from "@/components/ui/skeleton"

export default function TeamLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-6 md:px-10 overflow-hidden">
        <div className="relative max-w-6xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-2/3 mx-auto mb-10" />
        </div>
      </section>

      {/* Team Grid Skeleton */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-ethr-darkgray rounded-lg overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
