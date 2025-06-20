"use client"

import { useGigForm } from "./gig-form-context"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, DollarSign, FileImage, FileText, MapPin, Music, User, Youtube } from "lucide-react"

export function GigPreview() {
  const { formData } = useGigForm()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Preview Your Gig</h2>
        <p className="text-white/70">
          Review all the information before publishing your gig. This is how it will appear to artists.
        </p>
      </div>

      <div className="bg-ethr-black/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-medium text-white mb-2">{formData.title || "Untitled Gig"}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-ethr-neonblue/10 text-white border-ethr-neonblue/20">
              {formData.eventType || "Event"}
            </Badge>
            {formData.isVirtual && (
              <Badge variant="outline" className="bg-ethr-neonpurple/10 text-white border-ethr-neonpurple/20">
                Virtual Event
              </Badge>
            )}
            {formData.artistType.map((type) => (
              <Badge key={type} variant="outline" className="bg-white/10 text-white border-white/20">
                {type}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Date & Time</p>
                <p className="text-white/70">
                  {formData.date ? format(formData.date, "EEEE, MMMM d, yyyy") : "Date not specified"}
                  {formData.startTime && formData.endTime && (
                    <>
                      {" "}
                      • {formData.startTime} - {formData.endTime}
                    </>
                  )}
                </p>
              </div>
            </div>

            {!formData.isVirtual && formData.venue.name && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Venue</p>
                  <p className="text-white/70">{formData.venue.name}</p>
                  <p className="text-white/70">
                    {formData.venue.address}, {formData.venue.city}, {formData.venue.state} {formData.venue.zipCode}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Artist Requirements</p>
                <p className="text-white/70">Looking for: {formData.artistType.join(", ") || "Any artist type"}</p>
                {formData.experienceLevel && (
                  <p className="text-white/70">Experience level: {formData.experienceLevel}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Performance Details</p>
                {formData.performanceDuration && (
                  <p className="text-white/70">Duration: {formData.performanceDuration}</p>
                )}
                {formData.setupTime && <p className="text-white/70">Setup time: {formData.setupTime}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Budget</p>
                {formData.paymentType === "fixed" ? (
                  <p className="text-white/70">Fixed: {formatCurrency(formData.fixedAmount)}</p>
                ) : formData.paymentType === "range" ? (
                  <p className="text-white/70">
                    Range: {formatCurrency(formData.minBudget)} - {formatCurrency(formData.maxBudget)}
                  </p>
                ) : (
                  <p className="text-white/70">Negotiable</p>
                )}
                {formData.depositRequired && (
                  <p className="text-white/70">Deposit: {formatCurrency(formData.depositAmount)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Description</h3>
          <div className="text-white/70 whitespace-pre-wrap">{formData.description || "No description provided."}</div>
        </div>

        {(formData.equipmentProvided.length > 0 || formData.equipmentRequired.length > 0) && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Equipment</h3>

            {formData.equipmentProvided.length > 0 && (
              <div className="mb-4">
                <p className="text-white mb-2">Equipment Provided:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.equipmentProvided.map((item) => (
                    <Badge key={item} variant="outline" className="bg-white/10 text-white border-white/20">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.equipmentRequired.length > 0 && (
              <div>
                <p className="text-white mb-2">Equipment Required:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.equipmentRequired.map((item) => (
                    <Badge key={item} variant="outline" className="bg-white/10 text-white border-white/20">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {formData.additionalRequirements && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Additional Requirements</h3>
            <div className="text-white/70 whitespace-pre-wrap">{formData.additionalRequirements}</div>
          </div>
        )}

        {formData.paymentTerms && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Payment Terms</h3>
            <div className="text-white/70 whitespace-pre-wrap">{formData.paymentTerms}</div>
          </div>
        )}

        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Media</h3>

          <div className="space-y-6">
            {formData.images.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileImage className="h-4 w-4 text-ethr-neonblue" />
                  <p className="text-white">Images ({formData.images.length})</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-ethr-black/50 rounded-md overflow-hidden border border-white/10"
                    >
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Event ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(formData.stagePlot || formData.technicalRider) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-ethr-neonblue" />
                  <p className="text-white">Documents</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {formData.stagePlot && (
                    <div className="bg-ethr-black/50 rounded-md border border-white/10 px-4 py-2 flex items-center">
                      <FileText className="h-4 w-4 text-white/70 mr-2" />
                      <span className="text-white/70">{formData.stagePlot.name}</span>
                    </div>
                  )}
                  {formData.technicalRider && (
                    <div className="bg-ethr-black/50 rounded-md border border-white/10 px-4 py-2 flex items-center">
                      <FileText className="h-4 w-4 text-white/70 mr-2" />
                      <span className="text-white/70">{formData.technicalRider.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.audioSamples.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Music className="h-4 w-4 text-ethr-neonblue" />
                  <p className="text-white">Audio Samples ({formData.audioSamples.length})</p>
                </div>
                <ScrollArea className="h-24 border border-white/10 rounded-md p-3">
                  <div className="space-y-2">
                    {formData.audioSamples.map((audio, index) => (
                      <div key={index} className="flex items-center bg-ethr-black/50 p-2 rounded-md">
                        <Music className="h-4 w-4 text-ethr-neonblue mr-2" />
                        <span className="text-white/70 truncate">{audio.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {formData.videoLinks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Youtube className="h-4 w-4 text-ethr-neonblue" />
                  <p className="text-white">Video Links ({formData.videoLinks.length})</p>
                </div>
                <div className="space-y-2">
                  {formData.videoLinks.map((link, index) => (
                    <div key={index} className="bg-ethr-black/50 p-2 rounded-md">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ethr-neonblue hover:underline truncate block"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.images.length === 0 &&
              !formData.stagePlot &&
              !formData.technicalRider &&
              formData.audioSamples.length === 0 &&
              formData.videoLinks.length === 0 && <p className="text-white/50 italic">No media added</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
