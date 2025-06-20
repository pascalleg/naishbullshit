import { Badge } from "@/components/ui/badge"
import type { Gig } from "@/app/find-gig/types/gig"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, FileText, Info, MessageCircle } from "lucide-react"

interface GigDetailContentProps {
  gig: Gig
}

export function GigDetailContent({ gig }: GigDetailContentProps) {
  // Expanded mock data for the gig detail page
  const expandedGigData = {
    description: gig.description,
    longDescription:
      gig.description +
      " We're looking for someone who can bring energy and professionalism to our event. This is a great opportunity to showcase your talents and connect with industry professionals. The ideal candidate will have a strong portfolio and references from previous similar engagements.",
    requirements: gig.requirements || [
      "Professional experience in the field",
      "Own equipment and transportation",
      "Punctuality and reliability",
      "Ability to adapt to changing circumstances",
    ],
    additionalInfo: [
      "Setup time will be provided 2 hours before the event",
      "Meals and refreshments will be provided",
      "Parking is available on-site",
      "Payment will be processed within 7 days after the event",
    ],
    contractTerms: [
      "50% deposit required upon booking",
      "Cancellation policy: Full refund if cancelled 30+ days before, 50% refund if 15-29 days before, no refund if less than 15 days",
      "Performance rights and licensing are the responsibility of the venue",
      "Insurance coverage required for equipment",
    ],
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
          <TabsTrigger value="details" className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white">
            <Info className="h-4 w-4 mr-2" />
            DETAILS
          </TabsTrigger>
          <TabsTrigger
            value="requirements"
            className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            REQUIREMENTS
          </TabsTrigger>
          <TabsTrigger value="contract" className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            CONTRACT
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            MESSAGES
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-white mb-3">Description</h2>
            <p className="text-white/80 leading-relaxed">{expandedGigData.longDescription}</p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white mb-3">Additional Information</h2>
            <ul className="space-y-2 text-white/80">
              {expandedGigData.additionalInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ethr-neonblue mr-2">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {gig.tags?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-white mb-3">Requirements</h2>
            <ul className="space-y-3 text-white/80">
              {expandedGigData.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 text-ethr-neonblue shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white mb-3">Qualifications</h2>
            <p className="text-white/80 leading-relaxed">
              The ideal candidate will have previous experience in similar settings and be able to provide references or
              portfolio examples. Professionalism, reliability, and excellent communication skills are essential.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="contract" className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-white mb-3">Contract Terms</h2>
            <ul className="space-y-3 text-white/80">
              {expandedGigData.contractTerms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 text-ethr-neonblue shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white mb-3">Legal Information</h2>
            <p className="text-white/80 leading-relaxed">
              All parties agree to the ETHR platform's standard terms and conditions. A formal contract will be
              generated upon acceptance of the gig, which both parties must sign electronically before the booking is
              confirmed.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Messages Yet</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Apply to this gig to start a conversation with the poster and discuss the details.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
