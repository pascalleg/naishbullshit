"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl, { MapMouseEvent } from 'mapbox-gl' // Import MapMouseEvent
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchService } from '@/lib/services/search-service'
import { toast } from 'sonner'
import { MapPin, Navigation } from 'lucide-react'

interface SearchMapProps {
  initialLocation?: {
    lat: number
    lng: number
  }
  radius?: number
  type: 'venue' | 'professional'
}

export function SearchMap({ initialLocation, radius, type }: SearchMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation
        ? [initialLocation.lng, initialLocation.lat]
        : [-74.5, 40], // Default to New York area
      zoom: initialLocation ? 12 : 9
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add click handler
    map.current.on('click', (e: MapMouseEvent) => { // Explicitly type 'e'
      const { lng, lat } = e.lngLat
      searchNearby(lat, lng)
    })

    // Initial search if location provided
    if (initialLocation) {
      searchNearby(initialLocation.lat, initialLocation.lng)
    }

    return () => {
      map.current?.remove()
    }
  }, [])

  const searchNearby = async (lat: number, lng: number) => {
    try {
      setIsLoading(true)
      clearMarkers()

      const searchService = SearchService.getInstance()
      const filters = {
        location: {
          lat,
          lng,
          radius: radius || 50
        }
      }

      const results = type === 'venue'
        ? await searchService.searchVenues(filters)
        : await searchService.searchProfessionals(filters)

      setResults(results)

      // Add markers for each result
      results.forEach((result) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([result.location.lng, result.location.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${result.name}</h3>
                <p class="text-sm text-gray-600">${result.description}</p>
                <p class="text-sm text-gray-600">Rating: ${result.rating}/5</p>
                <p class="text-sm text-gray-600">Price: $${result.price}/hour</p>
              </div>
            `)
          )
          .addTo(map.current!)

        markers.current.push(marker)
      })

      // Fit map to markers
      if (results.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        results.forEach((result) => {
          bounds.extend([result.location.lng, result.location.lat])
        })
        map.current?.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        })
      }
    } catch (error) {
      console.error('Error searching nearby:', error)
      toast.error('Failed to search nearby locations')
    } finally {
      setIsLoading(false)
    }
  }

  const clearMarkers = () => {
    markers.current.forEach((marker) => marker.remove())
    markers.current = []
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        searchNearby(latitude, longitude)
      },
      (error) => {
        console.error('Error getting location:', error)
        toast.error('Failed to get your location')
      }
    )
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {/* Results Count */}
      <Card className="absolute bottom-4 left-4 z-10 p-2">
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {results.length} {type}s found
        </div>
      </Card>
    </div>
  )
}