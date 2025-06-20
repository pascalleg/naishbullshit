import type { ReactNode } from "react"

interface VenueFeatureProps {
  icon: ReactNode
  title: string
  value: string
}

export function VenueFeature({ icon, title, value }: VenueFeatureProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-ethr-neonblue/10 flex items-center justify-center text-ethr-neonblue">
        {icon}
      </div>
      <div>
        <p className="text-white/60 text-xs">{title}</p>
        <p className="text-white font-light">{value}</p>
      </div>
    </div>
  )
}
