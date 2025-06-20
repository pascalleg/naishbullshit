"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { VenueService } from "@/lib/database/venue-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { VenueCalendar } from "@/components/venue-calendar"
import { VenueGallery } from "@/components/venue-gallery"
import { VenueFeature } from "@/components/venue-feature"
import { VenueReviewForm } from "@/components/venue-review-form" // Corrected import
import { MapPin, Users, Clock, Star, Calendar, Edit, Share2 } from "lucide-react"
import type { VenueWithDetails, VenueReview } from "@/lib/database/types/venue"
import { format } from "date-fns"
import Image from "next/image"
import { NotificationService } from "@/lib/services/notification-service"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, Briefcase, Bell, Settings, PlusCircle, LayoutDashboard, Building2, Receipt, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VenueDetailsPageProps {
  params: {
    id: string
  }
}

export default function VenueDetailsPage({ params }: VenueDetailsPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [venue, setVenue] = useState<VenueWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<VenueReview | null>(null)
  const pathname = usePathname()
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    loadVenue()
    if (user?.id) {
      fetchUnreadNotifications()
      NotificationService.getInstance().subscribeToNotifications(user.id, handleNewNotification)
    }

    return () => {
      if (user?.id) {
        NotificationService.getInstance().unsubscribeFromPushNotifications()
      }
    }
  }, [params.id, user?.id])

  const loadVenue = async () => {
    setIsLoading(true)
    try {
      const venueData = await VenueService.getVenue(params.id)
      setVenue(venueData)
    } catch (error) {
      console.error("Error loading venue:", error)
      toast({
        title: "Error",
        description: "Failed to load venue",
        variant: "destructive",
      })
      router.push("/venues")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (!venue) return

    try {
      await navigator.share({
        title: venue.name,
        text: venue.description || "",
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Error",
        description: "Failed to share venue",
        variant: "destructive",
      })
    }
  }

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false)
    setEditingReview(null)
    await loadVenue()
  }

  const handleEditReview = (review: VenueReview) => {
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId: string) => { // Updated function signature
    try {
      await VenueService.deleteReview(reviewId) // Corrected usage
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      })
      await loadVenue()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchUnreadNotifications = async () => {
    if (!user?.id) return
    try {
      const count = await NotificationService.getInstance().getUnreadCount(user.id)
      setUnreadNotifications(count)
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error)
    }
  }

  const handleNewNotification = (payload: any) => {
    // Check if it's a new notification insertion
    if (payload.eventType === "INSERT") {
      setUnreadNotifications((prev) => prev + 1)
      toast({
        title: "New Notification",
        description: payload.new.message,
      })
    } else if (payload.eventType === "UPDATE" && payload.new.read === true) {
      setUnreadNotifications((prev) => Math.max(0, prev - 1))
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white/70">Loading venue...</p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Venue Not Found</h1>
          <p className="text-white/70">The venue you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === venue.owner_id

  // Transform venue images to the required format
  const venueImages = venue.images?.map((image, index) => ({
    src: image,
    alt: `${venue.name} - Image ${index + 1}`
  })) || []

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", enabled: !!user },
    { href: "/find-gig", icon: Search, label: "Find Gigs", enabled: true },
    { href: "/post-gig", icon: PlusCircle, label: "Post Gig", enabled: user?.user_metadata?.account_type === "venue" || user?.user_metadata?.account_type === "production" },
    { href: "/bookings", icon: Calendar, label: "Bookings", enabled: !!user },
    { href: "/contracts", icon: Receipt, label: "Contracts", enabled: !!user },
    { href: "/messages", icon: MessageSquare, label: "Messages", enabled: !!user },
    { href: "/venues", icon: Building2, label: "Venues", enabled: user?.user_metadata?.account_type === "venue" },
    { href: "/professionals", icon: Users, label: "Professionals", enabled: user?.user_metadata?.account_type === "artist" || user?.user_metadata?.account_type === "production" },
    { href: "/production", icon: Briefcase, label: "Production", enabled: user?.user_metadata?.account_type === "production" },
    { href: "/notifications", icon: Bell, label: "Notifications", enabled: !!user, count: unreadNotifications },
    { href: "/settings", icon: Settings, label: "Settings", enabled: !!user },
  ].filter(item => item.enabled)

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Venue Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
              <div className="flex items-center text-white/70">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{venue.city}, {venue.state}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/venues/${venue.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <VenueGallery images={venueImages} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-white/70">{venue.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-white/70">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Capacity</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{venue.capacity}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-white/70">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Min Booking</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{venue.min_booking_hours}h</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-white/70">
                      <Star className="w-4 h-4 mr-2" />
                      <span>Base Price</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2">${venue.base_price}/{venue.min_booking_hours}h</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center text-white/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Type</span>
                    </div>
                    <p className="text-2xl font-semibold mt-2 capitalize">{venue.type.replace("_", " ")}</p>
                  </CardContent>
                </Card>
              </div>

              {venue.amenities && venue.amenities.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-white/70">
                          <span className="w-2 h-2 bg-ethr-neonblue rounded-full mr-2"></span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {venue.rules && venue.rules.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Rules</h2>
                    <div className="space-y-2">
                      {venue.rules.map((rule, index) => (
                        <div key={index} className="flex items-center text-white/70">
                          <span className="w-2 h-2 bg-ethr-neonblue rounded-full mr-2"></span>
                          {rule}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  {venue.features && venue.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {venue.features.map((feature) => (
                        <VenueFeature key={feature.id} feature={feature} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70">No features listed for this venue.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-ethr-neonblue hover:bg-ethr-neonblue/90"
                  >
                    Write a Review
                  </Button>

                  {/* Review List */}
                  <div className="space-y-6 mt-6">
                    {venue.reviews?.length === 0 ? (
                      <p className="text-white/70 text-center">No reviews yet. Be the first to review this venue!</p>
                    ) : (
                      venue.reviews?.map((review) => (
                        <Card key={review.id} className="bg-white/5 border-white/10">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                                <span className="font-semibold">{review.rating}.0</span>
                                <span className="text-white/70 ml-2">by {review.profiles?.username || 'Anonymous'}</span> {/* Corrected access */}
                              </div>
                              <span className="text-white/50 text-sm">{format(new Date(review.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                            <p className="text-white/70 mb-4">{review.comment}</p>
                            {user?.id === review.user_id && (
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditReview(review)}>
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id)}>
                                  Delete
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {showReviewForm && venue && (
            <VenueReviewForm
              venueId={venue.id}
              initialReview={editingReview} // Corrected prop name
              onCancel={() => setShowReviewForm(false)} // Corrected prop name
              onReviewSubmitted={handleReviewSubmitted} // Corrected prop name
            />
          )}
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          {venue.id && <VenueCalendar venueId={venue.id} />}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-ethr-darkgray border-t border-muted-foreground/10 lg:hidden">
        <div className="flex justify-around h-16 items-center">
          {navItems.slice(0, 5).map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 ${
                      pathname === item.href ? "text-ethr-neonblue" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="relative">
                      <item.icon className="w-6 h-6 mb-1" />
                      {item.count !== undefined && item.count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[8px] font-bold text-white">
                          {item.count}
                        </span>
                      )}
                    </div>
                    {item.label}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className={`flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 ${
                    pathname === "/profile" ? "text-ethr-neonblue" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt="User Avatar" />
                    <AvatarFallback>{user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col overflow-y-auto border-r border-muted-foreground/10 bg-ethr-darkgray p-4 lg:flex">
        <div className="flex items-center justify-between px-2 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">Ether</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                pathname === item.href ? "bg-ethr-neonblue/20 text-ethr-neonblue" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[8px] font-bold text-white">
                    {item.count}
                  </span>
                )}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/60">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="User Avatar" />
            <AvatarFallback>{user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.user_metadata?.username || user?.email}</span>
        </div>
      </aside>
    </div>
  )
}