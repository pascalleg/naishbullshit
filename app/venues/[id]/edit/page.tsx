"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { VenueService } from "@/lib/database/venue-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import type { VenueType, VenueStatus } from "@/lib/database/types/venue"
import { LocationAutocomplete } from "@/components/venues/location-autocomplete"
import { VenueAvailabilityCalendar } from "@/components/venues/venue-availability-calendar"

interface EditVenuePageProps {
  params: {
    id: string
  }
}

export default function EditVenuePage({ params }: EditVenuePageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "" as VenueType,
    status: "active" as VenueStatus,
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    capacity: "",
    min_booking_hours: "",
    base_price: "",
    currency: "USD",
    images: [] as string[],
    amenities: [] as string[],
    rules: [] as string[],
  })

  useEffect(() => {
    const loadVenue = async () => {
      if (!user) return

      try {
        const venue = await VenueService.getVenueById(params.id)
        if (!venue) {
          toast({
            title: "Error",
            description: "Venue not found",
            variant: "destructive",
          })
          router.push("/venues")
          return
        }

        // Check if user is the venue owner
        if (venue.owner_id !== user.id) {
          toast({
            title: "Error",
            description: "You don't have permission to edit this venue",
            variant: "destructive",
          })
          router.push(`/venues/${params.id}`)
          return
        }

        setFormData({
          name: venue.name,
          description: venue.description,
          type: venue.type,
          status: venue.status,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          country: venue.country,
          postal_code: venue.postal_code,
          latitude: venue.latitude.toString(),
          longitude: venue.longitude.toString(),
          capacity: venue.capacity.toString(),
          min_booking_hours: venue.min_booking_hours.toString(),
          base_price: venue.base_price.toString(),
          currency: venue.currency,
          images: venue.images,
          amenities: venue.amenities,
          rules: venue.rules,
        })
      } catch (error) {
        console.error("Error loading venue:", error)
        toast({
          title: "Error",
          description: "Failed to load venue details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVenue()
  }, [params.id, user, router, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Venue name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.type) {
      newErrors.type = "Venue type is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required"
    } else if (isNaN(parseInt(formData.capacity)) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number"
    }

    if (!formData.min_booking_hours.trim()) {
      newErrors.min_booking_hours = "Minimum booking hours is required"
    } else if (isNaN(parseInt(formData.min_booking_hours)) || parseInt(formData.min_booking_hours) <= 0) {
      newErrors.min_booking_hours = "Minimum booking hours must be a positive number"
    }

    if (!formData.base_price.trim()) {
      newErrors.base_price = "Base price is required"
    } else if (isNaN(parseFloat(formData.base_price)) || parseFloat(formData.base_price) <= 0) {
      newErrors.base_price = "Base price must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validateForm()) return

    setIsSaving(true)
    try {
      await VenueService.updateVenue(params.id, {
        ...formData,
        capacity: parseInt(formData.capacity),
        min_booking_hours: parseInt(formData.min_booking_hours),
        base_price: parseFloat(formData.base_price),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      })

      toast({
        title: "Success",
        description: "Venue updated successfully",
      })

      router.push(`/venues/${params.id}`)
    } catch (error) {
      console.error("Error updating venue:", error)
      toast({
        title: "Error",
        description: "Failed to update venue",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationSelect = (location: {
    address: string
    city: string
    state: string
    country: string
    postal_code: string
    latitude: number
    longitude: number
  }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      postal_code: location.postal_code,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-white/70">Loading venue details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Venue</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Venue Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter venue name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your venue"
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Venue Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concert_hall">Concert Hall</SelectItem>
                    <SelectItem value="club">Club</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="outdoor">Outdoor Space</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <LocationAutocomplete
                onLocationSelect={handleLocationSelect}
                initialValue={formData.address}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <Input
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  placeholder="Enter capacity"
                  className={errors.capacity ? "border-red-500" : ""}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Minimum Booking Hours</label>
                <Input
                  name="min_booking_hours"
                  type="number"
                  value={formData.min_booking_hours}
                  onChange={handleChange}
                  required
                  placeholder="Enter minimum hours"
                  className={errors.min_booking_hours ? "border-red-500" : ""}
                />
                {errors.min_booking_hours && (
                  <p className="mt-1 text-sm text-red-500">{errors.min_booking_hours}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Base Price</label>
                <Input
                  name="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={handleChange}
                  required
                  placeholder="Enter base price"
                  className={errors.base_price ? "border-red-500" : ""}
                />
                {errors.base_price && (
                  <p className="mt-1 text-sm text-red-500">{errors.base_price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        <div className="mt-12">
          <VenueAvailabilityCalendar venueId={params.id} />
        </div>
      </div>
    </div>
  )
}