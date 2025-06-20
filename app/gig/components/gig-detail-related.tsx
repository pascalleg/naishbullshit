import { GigCard } from "@/app/find-gig/components/gig-card"
import type { Gig } from "@/app/find-gig/types/gig"

interface GigDetailRelatedProps {
  gigs: Gig[]
}

export function GigDetailRelated({ gigs }: GigDetailRelatedProps) {
  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-6">Similar Gigs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </div>
    </div>
  )
}
