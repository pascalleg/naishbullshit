"use client"

import { useGigForm } from "./gig-form-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export function GigBudget() {
  const { formData, updateFormData } = useGigForm()

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Budget Information</h2>

        <div>
          <Label className="text-white mb-4 block">Payment Type</Label>
          <RadioGroup
            value={formData.paymentType}
            onValueChange={(value) => updateFormData({ paymentType: value })}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
              <div className="space-y-2 w-full">
                <Label htmlFor="fixed" className="text-white cursor-pointer">
                  Fixed Amount
                </Label>
                {formData.paymentType === "fixed" && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter amount"
                      value={formData.fixedAmount || ""}
                      onChange={(e) => updateFormData({ fixedAmount: Number(e.target.value) })}
                      className="pl-8 bg-ethr-black/50 border-white/10 text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="range" id="range" className="mt-1" />
              <div className="space-y-2 w-full">
                <Label htmlFor="range" className="text-white cursor-pointer">
                  Budget Range
                </Label>
                {formData.paymentType === "range" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Minimum"
                        value={formData.minBudget || ""}
                        onChange={(e) => updateFormData({ minBudget: Number(e.target.value) })}
                        className="pl-8 bg-ethr-black/50 border-white/10 text-white"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Maximum"
                        value={formData.maxBudget || ""}
                        onChange={(e) => updateFormData({ maxBudget: Number(e.target.value) })}
                        className="pl-8 bg-ethr-black/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="negotiable" id="negotiable" className="mt-1" />
              <Label htmlFor="negotiable" className="text-white cursor-pointer">
                Negotiable (To be discussed with artist)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-light text-white">Deposit</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-white/50" />
                </TooltipTrigger>
                <TooltipContent className="bg-ethr-darkgray text-white border-white/10">
                  <p>A deposit secures the booking and shows commitment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.depositRequired}
              onCheckedChange={(checked) => updateFormData({ depositRequired: checked })}
              id="deposit-required"
            />
            <Label htmlFor="deposit-required" className="text-white cursor-pointer">
              Deposit Required
            </Label>
          </div>
        </div>

        {formData.depositRequired && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
            <Input
              type="number"
              min="0"
              placeholder="Deposit amount"
              value={formData.depositAmount || ""}
              onChange={(e) => updateFormData({ depositAmount: Number(e.target.value) })}
              className="pl-8 bg-ethr-black/50 border-white/10 text-white"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="paymentTerms" className="text-white">
          Payment Terms
        </Label>
        <Textarea
          id="paymentTerms"
          placeholder="Describe your payment schedule, cancellation policy, etc."
          value={formData.paymentTerms}
          onChange={(e) => updateFormData({ paymentTerms: e.target.value })}
          className="bg-ethr-black/50 border-white/10 text-white h-32 mt-2"
        />
      </div>

      <div className="bg-ethr-neonblue/10 border border-ethr-neonblue/20 rounded-lg p-4">
        <p className="text-white/80">
          <strong>Note:</strong> All payments on ETHR are protected by our secure payment system. Funds are only
          released to the artist after the event is completed successfully.
        </p>
      </div>
    </div>
  )
}
