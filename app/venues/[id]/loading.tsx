import { LoadingSpinner } from "@/components/loading-spinner"

export default function VenueDetailsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ethr-black">
      <LoadingSpinner size="lg" text="Loading venue details..." />
    </div>
  )
}
