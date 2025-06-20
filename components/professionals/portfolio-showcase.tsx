import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { ProfessionalService } from '@/lib/services/professional-service'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Image, Music, Video, Plus, Trash2 } from 'lucide-react'

interface PortfolioShowcaseProps {
  professionalId: string
}

export function PortfolioShowcase({ professionalId }: PortfolioShowcaseProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video' | 'audio',
  })

  useEffect(() => {
    loadPortfolioItems()
  }, [professionalId])

  const loadPortfolioItems = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      const data = await professionalService.getPortfolioItems(professionalId)
      setItems(data)
    } catch (error) {
      console.error('Error loading portfolio items:', error)
      toast.error('Failed to load portfolio items')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const professionalService = ProfessionalService.getInstance()
      await professionalService.addPortfolioItem({
        professional_id: professionalId,
        ...newItem,
      })
      setShowAddDialog(false)
      setNewItem({
        title: '',
        description: '',
        media_url: '',
        media_type: 'image',
      })
      toast.success('Portfolio item added successfully')
      loadPortfolioItems()
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      toast.error('Failed to add portfolio item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const professionalService = ProfessionalService.getInstance()
      await professionalService.deletePortfolioItem(itemId)
      toast.success('Portfolio item deleted successfully')
      loadPortfolioItems()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      toast.error('Failed to delete portfolio item')
    }
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      case 'audio':
        return <Music className="w-6 h-6" />
      default:
        return <Image className="w-6 h-6" />
    }
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio Showcase</CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Portfolio Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Media Type</label>
                <select
                  value={newItem.media_type}
                  onChange={e => setNewItem({ ...newItem, media_type: e.target.value as any })}
                  className="w-full p-2 rounded-md bg-background border"
                  required
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Media URL</label>
                <Input
                  value={newItem.media_url}
                  onChange={e => setNewItem({ ...newItem, media_url: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading portfolio items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No portfolio items yet
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <ScrollReveal key={item.id} animation="fade">
                <Card className="bg-ethr-black border-muted">
                  <CardContent className="p-4">
                    <div className="aspect-video relative bg-muted rounded-md mb-4">
                      {item.media_type === 'image' ? (
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : item.media_type === 'video' ? (
                        <video
                          src={item.media_url}
                          controls
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getMediaIcon(item.media_type)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 