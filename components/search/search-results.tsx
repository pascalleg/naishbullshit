// components/search/search-results.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SearchService } from '@/lib/services/search-service'
import { toast } from 'sonner'
import { MapPin, Star, DollarSign } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SearchResultsProps {
  query?: string
  type: 'venue' | 'professional'
  filters: {
    location?: {
      lat: number
      lng: number
      radius?: number
    }
    categories?: string[]
    priceRange?: {
      min: number
      max: number
    }
    minRating?: number
    amenities?: string[]
  }
  page: number // Initial page from URL searchParams
}

export function SearchResults({
  query,
  type,
  filters,
  page: initialPage, // Rename page prop to initialPage to avoid conflict with internal state
}: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(initialPage) // Internal page state
  const [hasMore, setHasMore] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    // Reset page to initialPage when query, type, or filters change
    setPage(initialPage)
    setResults([]) // Clear results on new search
    setHasMore(true) // Reset hasMore
  }, [query, type, filters, initialPage])

  useEffect(() => {
    loadResults()
  }, [page]) // Only trigger loadResults when internal page state changes

  const loadResults = async () => {
    try {
      setIsLoading(true)
      const searchService = SearchService.getInstance()

      const pageSize = 10 // Define page size locally

      // Correctly destructure `items` and `total` from the SearchService response
      const { items, total } = type === 'venue'
        ? await searchService.searchVenues(filters, page, pageSize)
        : await searchService.searchProfessionals(filters, page, pageSize)

      if (page === initialPage) { // If it's the initial load or a new search
        setResults(items)
      } else {
        setResults(prev => [...prev, ...items])
      }

      setTotalResults(total)
      setTotalPages(Math.ceil(total / pageSize))
      setHasMore(items.length === pageSize) // Check if there are more results based on pageSize
    } catch (error) {
      console.error('Error loading results:', error)
      toast.error('Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  if (isLoading && page === initialPage) { // Check initialPage for initial load skeleton
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0 && !isLoading) { // Show no results if no results and not loading
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No results found</p>
      </Card>
    )
  }

  return (
    <ScrollReveal>
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={result.images[0] || '/placeholder.png'}
                  alt={result.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <Link
                  href={`/${type}s/${result.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {result.name}
                </Link>

                <p className="text-sm text-muted-foreground mt-1">
                  {result.description}
                </p>

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {result.location.address}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {result.rating}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${result.price}/hour
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {result.categories.map((category: string) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs bg-muted rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}