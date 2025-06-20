import { Skeleton } from "@/components/ui/skeleton"

export default function TeamMemberLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-ethr-black">
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-24 mb-6" />

            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
              <div>
                <Skeleton className="h-12 w-64 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="mb-8 flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>

              <div className="space-y-8">
                <div>
                  <Skeleton className="h-8 w-40 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-8 w-40 mb-4" />
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border-l-2 border-gray-700 pl-4 py-1">
                        <Skeleton className="h-6 w-48 mb-1" />
                        <Skeleton className="h-4 w-64 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div>
              <div className="bg-ethr-darkgray rounded-lg p-6 mb-8">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-ethr-darkgray rounded-lg p-6 mb-8">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div>
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-3 rounded-lg bg-ethr-darkgray">
                      <Skeleton className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
