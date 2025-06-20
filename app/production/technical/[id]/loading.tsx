import { LoadingSpinner } from "@/components/loading-spinner"

export default function TechnicalDirectorProfileLoading() {
  return (
    <div className="min-h-screen bg-ethr-black flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
