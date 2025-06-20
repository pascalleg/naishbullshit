"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Calendar, Clock, Users, CreditCard } from "lucide-react"
import { createBooking } from "@/lib/api/venue-api"

interface BookingConfirmationProps {
  isOpen: boolean
  onClose: () => void
  venueId: string
  venueName: string
  startDate: Date | undefined
  endDate: Date | undefined
  startTime?: string
  endTime?: string
  totalPrice: number
  guestCount: number
  onBookingComplete: (bookingId: string) => void
}

export function BookingConfirmation({
  isOpen,
  onClose,
  venueId,
  venueName,
  startDate,
  endDate,
  startTime,
  endTime,
  totalPrice,
  guestCount,
  onBookingComplete,
}: BookingConfirmationProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2)
      return
    }

    if (!startDate || !endDate) return

    setLoading(true)
    try {
      // In a real app, you would validate the form data here
      const booking = await createBooking({
        venueId,
        userId: "user-123", // In a real app, this would be the logged-in user's ID
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime,
        endTime,
        totalPrice,
        status: "confirmed",
        paymentStatus: "paid",
        guestCount,
      })

      onBookingComplete(booking.id)
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "MMMM d, yyyy")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-ethr-black border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-center">
            {step === 1 ? "Booking Details" : "Payment Information"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">{venueName}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">Date</p>
                  <p className="font-light">
                    {startDate && endDate
                      ? startDate.toDateString() === endDate.toDateString()
                        ? formatDate(startDate)
                        : `${formatDate(startDate)} - ${formatDate(endDate)}`
                      : "No date selected"}
                  </p>
                </div>
              </div>

              {startTime && endTime && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/70 text-sm">Time</p>
                    <p className="font-light">
                      {startTime} - {endTime}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-ethr-neonblue shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">Guests</p>
                  <p className="font-light">{guestCount} people</p>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10 my-4" />

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>

            <Separator className="bg-white/10 my-4" />

            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-white/10 my-4" />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Booking Amount</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Service Fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-md text-sm text-white/70">
              <p>By clicking "Complete Booking", you agree to the venue's booking terms and cancellation policy.</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white"
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Continue to Payment
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-white/10 text-white hover:bg-white/5"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white"
                disabled={loading || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Booking
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
