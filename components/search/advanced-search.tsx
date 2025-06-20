import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollReveal } from '@/components/scroll-reveal'
import { MapPin, Search, Filter, X } from 'lucide-react'
import { toast } from 'sonner'
import { SearchService } from '@/lib/services/search-service'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface AdvancedSearchProps {
  onSearch: (results: any[]) => void
  type: 'venue' | 'professional'
}

export function AdvancedSearch({ onSearch, type }: AdvancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(50)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch()
    }
  }, [debouncedSearchTerm])

  const performSearch = async () => {
    try {
      setIsLoading(true)
      const searchService = SearchService.getInstance()

      const filters = {
        location: location ? { ...location, radius } : undefined,
        priceRange: {
          min: priceRange[0],
          max: priceRange[1]
        },
        categories: selectedCategories.length ? selectedCategories : undefined,
        features: selectedFeatures.length ? selectedFeatures : undefined
      }

      const results = type === 'venue'
        ? await searchService.searchVenues(filters)
        : await searchService.searchProfessionals(filters)

      onSearch(results)
    } catch (error) {
      console.error('Error performing search:', error)
      toast.error('Failed to perform search')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSearch = async () => {
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          performSearch()
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Failed to get your location')
        }
      )
    } catch (error) {
      console.error('Error handling location search:', error)
      toast.error('Failed to handle location search')
    }
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocation(null)
    setRadius(50)
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setSelectedFeatures([])
    performSearch()
  }

  return (
    <ScrollReveal>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${type}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleLocationSearch}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Use Location
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {location && (
              <div>
                <h3 className="font-semibold mb-2">Distance</h3>
                <Slider
                  value={[radius]}
                  onValueChange={([value]) => setRadius(value)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground mt-2">
                  Within {radius} km
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Music', 'Dance', 'Theater', 'Comedy', 'Art', 'Photography'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Parking', 'Wheelchair Access', 'Catering', 'Sound System', 'Lighting', 'Stage'].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <label
                      htmlFor={feature}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </Card>
    </ScrollReveal>
  )
} 