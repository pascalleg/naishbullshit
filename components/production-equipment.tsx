"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedElementOptimized } from "./animated-element-optimized"
import { Plus, Search, Settings, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductionEquipmentDialog } from "./production-equipment-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ProductionService, Equipment } from "@/lib/database/services/production"
import { useAuth } from "@/lib/hooks/use-auth"

export function ProductionEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | undefined>()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const categories = ["all", "sound", "lighting", "stage", "technical"]

  useEffect(() => {
    if (user?.id) {
      loadEquipment()
    }
  }, [user?.id])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      const data = await ProductionService.getEquipment(user!.id)
      setEquipment(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load equipment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getConditionColor = (condition: Equipment["condition"]) => {
    switch (condition) {
      case "excellent":
        return "bg-green-500/20 text-green-500"
      case "good":
        return "bg-blue-500/20 text-blue-500"
      case "fair":
        return "bg-yellow-500/20 text-yellow-500"
      case "poor":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const handleAddEquipment = () => {
    setSelectedEquipment(undefined)
    setDialogOpen(true)
  }

  const handleEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setDialogOpen(true)
  }

  const handleSaveEquipment = async (equipmentData: Omit<Equipment, "id" | "created_at" | "professional_id">) => {
    try {
      if (selectedEquipment) {
        await ProductionService.updateEquipment(selectedEquipment.id, equipmentData)
        toast({
          title: "Equipment Updated",
          description: "The equipment has been successfully updated.",
        })
      } else {
        await ProductionService.addEquipment({
          ...equipmentData,
          professional_id: user!.id,
        })
        toast({
          title: "Equipment Added",
          description: "New equipment has been added to your inventory.",
        })
      }
      loadEquipment()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save equipment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    try {
      await ProductionService.deleteEquipment(id)
      toast({
        title: "Equipment Deleted",
        description: "The equipment has been removed from your inventory.",
      })
      loadEquipment()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethr-neonblue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search equipment..."
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-ethr-neonblue text-white border-none"
                  : "border-white/10 text-white/70 hover:text-white hover:bg-white/10"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <Button
          className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white border-none"
          onClick={handleAddEquipment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment Table */}
      <AnimatedElementOptimized animation="slide-up" duration={0.5} delay={0.1}>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white">Equipment Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Category</TableHead>
                  <TableHead className="text-white/70">Quantity</TableHead>
                  <TableHead className="text-white/70">Condition</TableHead>
                  <TableHead className="text-white/70">Last Maintenance</TableHead>
                  <TableHead className="text-white/70">Notes</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id} className="border-white/10">
                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-white/10 text-white/70 border-white/10">
                        {item.category.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">{item.last_maintenance}</TableCell>
                    <TableCell className="text-white/70 max-w-xs truncate">{item.notes}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleEditEquipment(item)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteEquipment(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEquipment.length === 0 && (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={7} className="text-center text-white/70 py-8">
                      No equipment found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedElementOptimized>

      <ProductionEquipmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        equipment={selectedEquipment}
        onSave={handleSaveEquipment}
      />
    </div>
  )
} 