import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Skeleton className="h-4 w-32 bg-white/5 mb-2" />
        <Skeleton className="h-10 w-64 bg-white/5" />
      </div>

      <Skeleton className="h-24 w-full bg-white/5 rounded-lg mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl bg-white/5" />
          ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Skeleton className="h-10 w-64 bg-white/5" />
      </div>
    </div>
  )
}
