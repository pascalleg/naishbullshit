import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueService } from '@/lib/services/venue-service'
import { format } from 'date-fns'
import { Star, StarHalf } from 'lucide-react'

interface VenueReviewsProps {
  venueId: string
  onReviewAdded?: () => void
}

export function VenueReviews({ venueId, onReviewAdded }: VenueReviewsProps) {
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [page, setPage] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    loadReviews()
  }, [venueId, page])

  const loadReviews = async () => {
    try {
      const venueService = VenueService.getInstance()
      const { reviews: newReviews, total } = await venueService.getVenueReviews(venueId, page)
      setReviews(newReviews)
      setTotalReviews(total)
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)
    try {
      const venueService = VenueService.getInstance()
      await venueService.addReview({
        venue_id: venueId,
        rating,
        comment,
      }, 'user-id') // Replace with actual user ID

      toast.success('Review submitted successfully')
      setRating(0)
      setComment('')
      onReviewAdded?.()
      loadReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isHalf = value >= star - 0.5 && value < star
          const isFull = value >= star
          const isHovered = interactive && hoveredRating >= star

          return (
            <div
              key={star}
              className={`cursor-pointer ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
              onMouseEnter={() => interactive && setHoveredRating(star)}
              onMouseLeave={() => interactive && setHoveredRating(0)}
              onClick={() => interactive && setRating(star)}
            >
              {isHalf ? (
                <StarHalf className="w-5 h-5 text-yellow-400" />
              ) : (
                <Star
                  className={`w-5 h-5 ${
                    isFull || isHovered ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0

  return (
    <div className="space-y-8">
      <ScrollReveal animation="fade">
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                {renderStars(averageRating)}
                <p className="text-sm text-muted-foreground">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                {renderStars(rating, true)}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={100}>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card key={review.id} className="bg-ethr-darkgray/50 border-muted">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-ethr-neonblue/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {review.profiles?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.profiles?.name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="mt-4 text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {totalReviews > 10 && (
        <ScrollReveal animation="fade" delay={200}>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * 10 >= totalReviews}
            >
              Load More Reviews
            </Button>
          </div>
        </ScrollReveal>
      )}
    </div>
  )
} 