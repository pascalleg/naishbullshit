import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueService } from '@/lib/services/venue-service'
import { Search, MapPin, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface VenueSearchProps {
  onVenueSelect?: (venue: any) => void
}

export function VenueSearch({ onVenueSelect }: VenueSearchProps) {
  const [loading, setLoading] = useState(false)
  const [venues, setVenues] = useState<any[]>([])
  const [totalVenues, setTotalVenues] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    query: '',
    city: '',
    minCapacity: '',
    maxPrice: '',
    amenities: [] as string[],
  })

  useEffect(() => {
    searchVenues()
  }, [page, filters])

  const searchVenues = async () => {
    setLoading(true)
    try {
      const venueService = VenueService.getInstance()
      const { venues: newVenues, total } = await venueService.searchVenues({
        query: filters.query,
        city: filters.city,
        minCapacity: filters.minCapacity ? parseInt(filters.minCapacity) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        amenities: filters.amenities,
        page,
        limit: 10,
      })
      setVenues(newVenues)
      setTotalVenues(total)
    } catch (error) {
      console.error('Error searching venues:', error)
      toast.error('Failed to search venues')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
    setPage(1)
  }

  return (
    <div className="space-y-8">
      <ScrollReveal animation="fade">
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={filters.query}
                  onChange={e => handleFilterChange('query', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="City"
                  value={filters.city}
                  onChange={e => handleFilterChange('city', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Min Capacity"
                  value={filters.minCapacity}
                  onChange={e => handleFilterChange('minCapacity', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Max Price/Hour"
                  value={filters.maxPrice}
                  onChange={e => handleFilterChange('maxPrice', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Parking',
                  'WiFi',
                  'Bar',
                  'Stage',
                  'Sound System',
                  'Lighting',
                ].map(amenity => (
                  <Button
                    key={amenity}
                    variant={filters.amenities.includes(amenity) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={100}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-ethr-darkgray/50 border-muted animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : venues.length > 0 ? (
            venues.map(venue => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                onClick={() => onVenueSelect?.(venue)}
              >
                <Card className="bg-ethr-darkgray/50 border-muted hover:border-ethr-neonblue/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                      <img
                        src={venue.images[0] || '/placeholder-venue.jpg'}
                        alt={venue.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="font-medium text-lg mb-2">{venue.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {venue.city}, {venue.state}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{venue.capacity} capacity</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">${venue.price_per_hour}/hr</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No venues found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {totalVenues > 10 && (
        <ScrollReveal animation="fade" delay={200}>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * 10 >= totalVenues}
            >
              Load More Venues
            </Button>
          </div>
        </ScrollReveal>
      )}
    </div>
  )
} 