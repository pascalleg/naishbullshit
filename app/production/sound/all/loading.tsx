import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-12 w-64 bg-white/5" />
        <Skeleton className="h-6 w-96 mt-4 bg-white/5" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-full bg-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl bg-white/5" />
          ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-64 bg-white/5" />
      </div>
    </div>
  )
}
