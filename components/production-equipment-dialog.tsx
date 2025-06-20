"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Equipment } from "@/lib/database/services/production"

interface ProductionEquipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment?: Equipment
  onSave: (equipment: Omit<Equipment, "id" | "created_at" | "professional_id">) => void
}

export function ProductionEquipmentDialog({
  open,
  onOpenChange,
  equipment,
  onSave,
}: ProductionEquipmentDialogProps) {
  const [name, setName] = useState(equipment?.name ?? "")
  const [category, setCategory] = useState(equipment?.category ?? "sound")
  const [quantity, setQuantity] = useState(equipment?.quantity.toString() ?? "1")
  const [condition, setCondition] = useState<Equipment["condition"]>(equipment?.condition ?? "excellent")
  const [lastMaintenance, setLastMaintenance] = useState(equipment?.last_maintenance ?? new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState(equipment?.notes ?? "")

  useEffect(() => {
    if (equipment) {
      setName(equipment.name)
      setCategory(equipment.category)
      setQuantity(equipment.quantity.toString())
      setCondition(equipment.condition)
      setLastMaintenance(equipment.last_maintenance)
      setNotes(equipment.notes ?? "")
    } else {
      setName("")
      setCategory("sound")
      setQuantity("1")
      setCondition("excellent")
      setLastMaintenance(new Date().toISOString().split("T")[0])
      setNotes("")
    }
  }, [equipment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      category,
      quantity: parseInt(quantity),
      condition,
      last_maintenance: lastMaintenance,
      notes: notes || null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{equipment ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          <DialogDescription className="text-white/70">
            {equipment
              ? "Update the equipment details below."
              : "Fill in the details to add new equipment to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/70">
              Equipment Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/70">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-black/20 border-white/10 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                <SelectItem value="sound">Sound</SelectItem>
                <SelectItem value="lighting">Lighting</SelectItem>
                <SelectItem value="stage">Stage</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-white/70">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-black/20 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition" className="text-white/70">
              Condition
            </Label>
            <Select value={condition} onValueChange={(value: Equipment["condition"]) => setCondition(value)}>
              <SelectTrigger className="bg-black/20 border-white/10 text-white">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenance" className="text-white/70">
              Last Maintenance
            </Label>
            <Input
              id="lastMaintenance"
              type="date"
              value={lastMaintenance}
              onChange={(e) => setLastMaintenance(e.target.value)}
              className="bg-black/20 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/70">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-black/20 border-white/10 text-white min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white border-none"
            >
              {equipment ? "Update" : "Add"} Equipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 