"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Star } from "lucide-react"
import { VenueService } from "@/lib/database/venue-service"
import { useAuth } from "@/lib/auth"
import type { VenueReview } from "@/lib/database/types/venue"

interface VenueReviewFormProps {
  venueId: string
  onReviewSubmitted: () => void
  onCancel: () => void
  initialReview?: VenueReview | null
}

export function VenueReviewForm({ venueId, onReviewSubmitted, onCancel, initialReview }: VenueReviewFormProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [rating, setRating] = useState(initialReview?.rating || 0)
  const [comment, setComment] = useState(initialReview?.comment || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating)
      setComment(initialReview.comment || "")
    }
  }, [initialReview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment Too Short",
        description: "Please provide a more detailed review (minimum 10 characters).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (initialReview) {
        await VenueService.updateReview(initialReview.id, {
          rating,
          comment: comment.trim(),
        })
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        })
      } else {
        await VenueService.addReview(venueId, user.id, {
          rating,
          comment: comment.trim(),
        })
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        })
      }

      onReviewSubmitted()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {initialReview ? "Edit Review" : "Write a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-white/30"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-white/70 mb-2">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this venue..."
              className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : initialReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 