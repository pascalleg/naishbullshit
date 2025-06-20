"use client"

import { useState } from "react"
import { usePerformance } from "@/contexts/performance-context"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings } from "lucide-react"

export function PerformanceSettings() {
  const { performanceLevel, setPerformanceLevel, devicePerformance } = usePerformance()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-ethr-darkgray/80 backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Animation Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Animation Performance Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Adjust animation settings based on your device performance. Your device was detected as{" "}
            <strong>{devicePerformance} performance</strong>.
          </p>

          <RadioGroup
            value={performanceLevel}
            onValueChange={(value) => setPerformanceLevel(value as "high" | "medium" | "low" | "off")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High Quality (All animations)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium Quality (Most animations)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low Quality (Essential animations only)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="off" id="off" />
              <Label htmlFor="off">Disabled (No animations)</Label>
            </div>
          </RadioGroup>

          <p className="text-xs text-muted-foreground mt-4">
            Lower settings can improve performance on older devices or save battery life.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
