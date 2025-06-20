import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ethr-black to-ethr-darkgray p-6 md:p-10">
      {/* Hero Section Loading */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-ethr-darkgray" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-2 bg-ethr-darkgray" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-10 bg-ethr-darkgray" />
        </div>
      </section>

      {/* Mission Section Loading */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-10 w-48 mb-6 bg-ethr-darkgray" />
              <Skeleton className="h-4 w-full mb-3 bg-ethr-darkgray" />
              <Skeleton className="h-4 w-full mb-3 bg-ethr-darkgray" />
              <Skeleton className="h-4 w-full mb-3 bg-ethr-darkgray" />
              <Skeleton className="h-4 w-3/4 mb-3 bg-ethr-darkgray" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl bg-ethr-darkgray" />
          </div>
        </div>
      </section>

      {/* Values Section Loading */}
      <section className="py-16 bg-ethr-black/50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-6 bg-ethr-darkgray" />
          <Skeleton className="h-4 w-2/3 mx-auto bg-ethr-darkgray" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl bg-ethr-darkgray" />
          ))}
        </div>
      </section>

      {/* Team Section Loading */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-6 bg-ethr-darkgray" />
          <Skeleton className="h-4 w-2/3 mx-auto mb-12 bg-ethr-darkgray" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-ethr-darkgray" />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Loading */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-10 w-48 mb-6 bg-ethr-darkgray" />
              <Skeleton className="h-4 w-full mb-8 bg-ethr-darkgray" />

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-6 w-6 mr-4 bg-ethr-darkgray" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2 bg-ethr-darkgray" />
                      <Skeleton className="h-4 w-48 bg-ethr-darkgray" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Skeleton className="h-96 rounded-xl bg-ethr-darkgray" />
          </div>
        </div>
      </section>
    </div>
  )
}
