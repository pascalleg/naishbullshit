import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SearchService } from '@/lib/services/search-service'
import { toast } from 'sonner'

interface CategoryBrowserProps {
  onSearch: (results: any[]) => void
  type: 'venue' | 'professional'
}

const categories = [
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    subcategories: ['Live Music', 'Recording Studio', 'Rehearsal Space']
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: '💃',
    subcategories: ['Dance Studio', 'Performance Space', 'Choreography']
  },
  {
    id: 'theater',
    name: 'Theater',
    icon: '🎭',
    subcategories: ['Theater Space', 'Rehearsal Room', 'Backstage']
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '🎪',
    subcategories: ['Comedy Club', 'Performance Space', 'Open Mic']
  },
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    subcategories: ['Gallery', 'Studio Space', 'Exhibition']
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    subcategories: ['Photo Studio', 'Location', 'Equipment']
  }
]

export function CategoryBrowser({ onSearch, type }: CategoryBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const handleCategorySelect = async (categoryId: string) => {
    try {
      setSelectedCategory(categoryId)
      setSelectedSubcategory(null)

      const searchService = SearchService.getInstance()
      const results = type === 'venue'
        ? await searchService.searchVenues({ categories: [categoryId] })
        : await searchService.searchProfessionals({ categories: [categoryId] })

      onSearch(results)
    } catch (error) {
      console.error('Error searching by category:', error)
      toast.error('Failed to search by category')
    }
  }

  const handleSubcategorySelect = async (subcategory: string) => {
    try {
      setSelectedSubcategory(subcategory)

      const searchService = SearchService.getInstance()
      const results = type === 'venue'
        ? await searchService.searchVenues({ categories: [subcategory] })
        : await searchService.searchProfessionals({ categories: [subcategory] })

      onSearch(results)
    } catch (error) {
      console.error('Error searching by subcategory:', error)
      toast.error('Failed to search by subcategory')
    }
  }

  return (
    <ScrollReveal>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id}>
              <Button
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="w-full h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleCategorySelect(category.id)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </Button>

              {selectedCategory === category.id && (
                <div className="mt-2 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory}
                      variant={selectedSubcategory === subcategory ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleSubcategorySelect(subcategory)}
                    >
                      {subcategory}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </ScrollReveal>
  )
} 