import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"

export default function SettingsLoading() {
  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>

        <Card className="bg-ethr-darkgray border-muted overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-muted">
              <div className="p-4 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-4 w-full max-w-md mb-8" />
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Skeleton className="h-36 w-36 rounded-full" />
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  <Skeleton className="h-32 w-full" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
