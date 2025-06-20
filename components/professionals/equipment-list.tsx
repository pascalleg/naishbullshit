import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { ProfessionalService } from '@/lib/services/professional-service'
import { Plus, Trash2, Edit2, Save, X, Search, Music, Mic, Guitar, Piano } from 'lucide-react'

interface EquipmentListProps {
  professionalId: string
}

interface Equipment {
  id: string
  professional_id: string // Added professional_id to the interface
  name: string
  description: string
  category: 'instrument' | 'audio' | 'lighting' | 'other'
  rental_price?: number // Made rental_price optional
}

export function EquipmentList({ professionalId }: EquipmentListProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id'>>({ // Changed type to Omit<Equipment, 'id'>
    professional_id: professionalId, // Initialize with professionalId
    name: '',
    description: '',
    category: 'instrument',
  })

  useEffect(() => {
    loadEquipment()
  }, [professionalId])

  const loadEquipment = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      const data = await professionalService.getEquipment(professionalId)
      setEquipment(data)
    } catch (error) {
      console.error('Error loading equipment:', error)
      toast.error('Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEquipment = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      // Ensure all required fields are present before calling addEquipment
      if (!newEquipment.name || !newEquipment.description || !newEquipment.category) {
        toast.error('Please fill all required fields for new equipment.')
        return;
      }
      await professionalService.addEquipment(newEquipment) // Pass the complete newEquipment object
      toast.success('Equipment added successfully')
      setShowAddForm(false)
      setNewEquipment({ // Reset newEquipment state
        professional_id: professionalId,
        name: '',
        description: '',
        category: 'instrument'
      })
      loadEquipment()
    } catch (error) {
      console.error('Error adding equipment:', error)
      toast.error('Failed to add equipment')
    }
  }

  const handleUpdateEquipment = async (id: string, updates: Partial<Omit<Equipment, 'id' | 'professional_id'>>) => {
    try {
      const professionalService = ProfessionalService.getInstance()
      // Find the existing item to merge updates
      const existingItem = equipment.find(item => item.id === id);
      if (!existingItem) {
        toast.error('Equipment not found for update.');
        return;
      }

      const updatedItem: Equipment = {
        ...existingItem,
        ...updates,
        id, // Ensure id is always present
        professional_id: professionalId, // Ensure professional_id is always present
      };

      await professionalService.updateEquipment(updatedItem) // Pass the complete updatedItem object
      toast.success('Equipment updated successfully')
      setEditingId(null)
      loadEquipment()
    } catch (error) {
      console.error('Error updating equipment:', error)
      toast.error('Failed to update equipment')
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    try {
      const professionalService = ProfessionalService.getInstance()
      await professionalService.deleteEquipment(id)
      toast.success('Equipment deleted successfully')
      loadEquipment()
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast.error('Failed to delete equipment')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'instrument':
        return <Guitar className="w-4 h-4" />
      case 'audio':
        return <Mic className="w-4 h-4" />
      case 'lighting':
        return <Music className="w-4 h-4" />
      default:
        return <Piano className="w-4 h-4" />
    }
  }

  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return equipment

    const query = searchQuery.toLowerCase().trim()
    return equipment.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }, [equipment, searchQuery])

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Equipment</CardTitle>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-ethr-neonblue hover:bg-ethr-neonblue/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search equipment by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-ethr-black border-muted"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredEquipment.length} {filteredEquipment.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-ethr-black rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Equipment</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid gap-4">
              <Input
                placeholder="Equipment Name"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                required // Added required
              />
              <Textarea
                placeholder="Description"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                required // Added required
              />
              <select
                value={newEquipment.category}
                onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value as Equipment['category'] })}
                className="bg-ethr-black border rounded-md p-2"
                required // Added required
              >
                <option value="">Select Category</option> {/* Added default option */}
                <option value="instrument">Instrument</option>
                <option value="audio">Audio Equipment</option>
                <option value="lighting">Lighting</option>
                <option value="other">Other</option>
              </select>
              <Button onClick={handleAddEquipment}>
                <Save className="w-4 h-4 mr-2" />
                Save Equipment
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading equipment...</div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No equipment found matching your search' : 'No equipment added yet'}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEquipment.map((item) => (
              <ScrollReveal key={item.id}>
                <div className="p-4 bg-ethr-black rounded-lg">
                  {editingId === item.id ? (
                    <div className="grid gap-4">
                      <Input
                        value={item.name}
                        onChange={(e) => handleUpdateEquipment(item.id, { name: e.target.value })}
                        required
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => handleUpdateEquipment(item.id, { description: e.target.value })}
                        required
                      />
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateEquipment(item.id, { category: e.target.value as Equipment['category'] })}
                        className="bg-ethr-black border rounded-md p-2"
                        required
                      >
                        <option value="">Select Category</option> {/* Added default option */}
                        <option value="instrument">Instrument</option>
                        <option value="audio">Audio Equipment</option>
                        <option value="lighting">Lighting</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)} // This button saves the changes, so remove setEditingId(null)
                          className="bg-ethr-neonblue hover:bg-ethr-neonblue/90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <h3 className="text-lg font-medium">{item.name}</h3>
                        </div>
                        <p className="text-muted-foreground mt-1">{item.description}</p>
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">Category:</span> {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(item.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}