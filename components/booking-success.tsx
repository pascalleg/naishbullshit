"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Download } from "lucide-react"
import Link from "next/link"

interface BookingSuccessProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  venueName: string
}

export function BookingSuccess({ isOpen, onClose, bookingId, venueName }: BookingSuccessProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-ethr-black border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-center">Booking Confirmed!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="rounded-full bg-green-500/20 p-3 mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-center mb-2">Thank you for your booking</h3>
          <p className="text-white/70 text-center mb-6">
            Your booking at {venueName} has been confirmed. We've sent a confirmation email with all the details.
          </p>

          <div className="bg-white/5 w-full p-4 rounded-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70">Booking ID</span>
              <span className="font-mono">{bookingId.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status</span>
              <span className="text-green-500">Confirmed</span>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5" onClick={onClose}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white" asChild>
              <Link href="/dashboard/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
