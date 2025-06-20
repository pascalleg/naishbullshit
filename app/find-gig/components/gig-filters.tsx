"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Calendar, DollarSign } from "lucide-react"
import { useState } from "react"

export function GigFilters() {
  const [priceRange, setPriceRange] = useState([0, 10000])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-light text-white mb-4">GIG TYPE</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="venue" />
            <Label htmlFor="venue" className="text-white/80">
              VENUE BOOKINGS
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="artist" />
            <Label htmlFor="artist" className="text-white/80">
              ARTIST OPPORTUNITIES
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sound" />
            <Label htmlFor="sound" className="text-white/80">
              SOUND PRODUCTION
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="lighting" />
            <Label htmlFor="lighting" className="text-white/80">
              LIGHTING PRODUCTION
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="stage" />
            <Label htmlFor="stage" className="text-white/80">
              STAGE PRODUCTION
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="technical" />
            <Label htmlFor="technical" className="text-white/80">
              TECHNICAL SUPPORT
            </Label>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-light text-white mb-4">BUDGET</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className="pl-8 bg-white/5 border-white/10"
              />
            </div>
            <span className="text-white/50">to</span>
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className="pl-8 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-light text-white mb-4">DATE RANGE</h3>
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input type="date" placeholder="From" className="pl-8 bg-white/5 border-white/10" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input type="date" placeholder="To" className="pl-8 bg-white/5 border-white/10" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-light text-white mb-4">DURATION</h3>
        <RadioGroup defaultValue="any">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any" />
            <Label htmlFor="any" className="text-white/80">
              ANY DURATION
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oneday" id="oneday" />
            <Label htmlFor="oneday" className="text-white/80">
              ONE DAY
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekend" id="weekend" />
            <Label htmlFor="weekend" className="text-white/80">
              WEEKEND
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week" className="text-white/80">
              ONE WEEK
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="longer" id="longer" />
            <Label htmlFor="longer" className="text-white/80">
              LONGER
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-light text-white mb-4">LOCATION</h3>
        <Input placeholder="CITY, STATE, OR COUNTRY" className="bg-white/5 border-white/10 mb-3" />
        <div className="flex items-center space-x-2">
          <Checkbox id="remote" />
          <Label htmlFor="remote" className="text-white/80">
            INCLUDE REMOTE OPPORTUNITIES
          </Label>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button className="w-full bg-ethr-neonblue hover:bg-ethr-neonblue/90">APPLY FILTERS</Button>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
          RESET
        </Button>
      </div>
    </div>
  )
}
