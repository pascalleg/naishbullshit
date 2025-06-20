"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/main-nav"
import { Calendar, Check, CreditCard, FileText, MapPin } from "lucide-react"
import Image from "next/image"

export default function BookingPage() {
  const [step, setStep] = useState(1)

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Book Your Event</h1>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            {[
              { step: 1, label: "Post Need" },
              { step: 2, label: "Get Matched" },
              { step: 3, label: "Review Contract" },
              { step: 4, label: "Confirm & Pay" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= item.step ? "bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple" : "bg-ethr-darkgray"
                  }`}
                >
                  <span className={step >= item.step ? "text-ethr-black font-bold" : "text-muted-foreground"}>
                    {item.step}
                  </span>
                </div>
                <span className={`text-sm mt-2 ${step >= item.step ? "text-white" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-ethr-darkgray rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple transition-all duration-300"
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Post Need */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-ethr-darkgray border-muted">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Tell us about your event and requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="e.g. Summer Beach Party"
                      className="bg-ethr-black border-muted"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <div className="relative">
                        <Input id="event-date" type="date" className="bg-ethr-black border-muted" />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-time">Start Time</Label>
                      <Input id="event-time" type="time" className="bg-ethr-black border-muted" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-duration">Event Duration</Label>
                    <Select defaultValue="2">
                      <SelectTrigger className="bg-ethr-black border-muted">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-location">Event Location</Label>
                    <div className="relative">
                      <Input
                        id="event-location"
                        placeholder="Enter address"
                        className="bg-ethr-black border-muted pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select defaultValue="club">
                      <SelectTrigger className="bg-ethr-black border-muted">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club">Club Night</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="private">Private Party</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-description">Event Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Describe your event, vibe, and specific requirements..."
                      className="bg-ethr-black border-muted min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Music Genres (Select all that apply)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "House",
                        "Techno",
                        "EDM",
                        "Hip Hop",
                        "R&B",
                        "Pop",
                        "Rock",
                        "Latin",
                        "Reggaeton",
                        "Disco",
                        "Funk",
                        "Soul",
                      ].map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`genre-${genre}`}
                            className="h-4 w-4 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
                          />
                          <Label htmlFor={`genre-${genre}`} className="text-sm font-normal">
                            {genre}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                  >
                    Continue to Matching
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-ethr-darkgray border-muted sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-ethr-neonblue/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <Calendar className="h-4 w-4 text-ethr-neonblue" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Book in Advance</h3>
                      <p className="text-xs text-muted-foreground">
                        Most artists require at least 2-4 weeks notice for bookings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-ethr-neonblue/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <FileText className="h-4 w-4 text-ethr-neonblue" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Be Specific</h3>
                      <p className="text-xs text-muted-foreground">
                        The more details you provide, the better matches you'll receive.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-ethr-neonblue/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <CreditCard className="h-4 w-4 text-ethr-neonblue" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Budget Expectations</h3>
                      <p className="text-xs text-muted-foreground">
                        Be upfront about your budget to find the right match for your event.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Get Matched */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-ethr-darkgray border-muted mb-8">
                <CardHeader>
                  <CardTitle>Matched Artists</CardTitle>
                  <CardDescription>Select an artist for your event</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="option-1" className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className={`flex border ${item === 1 ? "border-ethr-neonblue" : "border-muted"} rounded-lg p-4`}
                      >
                        <RadioGroupItem value={`option-${item}`} id={`option-${item}`} className="mt-1" />
                        <div className="ml-3 flex flex-1 items-start">
                          <Image
                            src={`/placeholder.svg?height=80&width=80`}
                            alt="Artist"
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">DJ Synapse</h3>
                                <p className="text-sm text-muted-foreground">Electronic / House DJ</p>
                                <div className="flex items-center mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm ml-1">4.9</span>
                                  <span className="text-xs text-muted-foreground ml-1">(124 reviews)</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-lg">$800</p>
                                <p className="text-xs text-muted-foreground">for 2 hours</p>
                              </div>
                            </div>
                            <p className="text-sm mt-2">
                              Specializes in high-energy house and techno sets. Has performed at major clubs and
                              festivals across North America.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="border-muted text-muted-foreground hover:bg-ethr-black hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                  >
                    Continue to Contract
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-ethr-darkgray border-muted sticky top-24">
                <CardHeader>
                  <CardTitle>Event Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Event Name</p>
                    <p className="font-medium">Summer Beach Party</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">July 15, 2025 • 8:00 PM</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">2 hours</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">Oceanic Beach Club, Los Angeles</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    <p className="font-medium">Private Party</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Genres</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs bg-ethr-neonblue/20 text-ethr-neonblue px-2 py-1 rounded-full">
                        House
                      </span>
                      <span className="text-xs bg-ethr-neonblue/20 text-ethr-neonblue px-2 py-1 rounded-full">
                        Techno
                      </span>
                      <span className="text-xs bg-ethr-neonblue/20 text-ethr-neonblue px-2 py-1 rounded-full">
                        Disco
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Review Contract */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-ethr-darkgray border-muted mb-8">
                <CardHeader>
                  <CardTitle>Review Contract</CardTitle>
                  <CardDescription>Review and finalize the terms of your booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-ethr-black rounded-lg p-6 border border-muted">
                    <h3 className="text-lg font-semibold mb-4">Performance Agreement</h3>
                    <div className="space-y-4 text-sm">
                      <p>This Performance Agreement ("Agreement") is entered into between:</p>
                      <p>
                        <strong>Client:</strong> [Your Name]
                      </p>
                      <p>
                        <strong>Artist:</strong> DJ Synapse
                      </p>

                      <p className="mt-4">
                        This Agreement outlines the terms and conditions for the performance of DJ Synapse at the Summer
                        Beach Party event on July 15, 2025.
                      </p>

                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">1. Performance Details</h4>
                        <p>The Artist agrees to perform at the Event for a duration of 2 hours, starting at 8:00 PM.</p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">2. Compensation</h4>
                        <p>The Client agrees to pay the Artist a total fee of $800 for the performance.</p>
                        <p>
                          Payment terms: 50% deposit due upon signing this Agreement, with the remaining balance due on
                          the day of the Event.
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">3. Equipment</h4>
                        <p>The Artist will provide their own DJ equipment, including controllers and headphones.</p>
                        <p>
                          The Client will provide a suitable sound system, power outlets, and a stable table/booth for
                          the Artist's equipment.
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">4. Cancellation Policy</h4>
                        <p>
                          Cancellation by Client: If the Client cancels the booking less than 14 days before the Event,
                          the deposit is non-refundable.
                        </p>
                        <p>
                          Cancellation by Artist: If the Artist cancels the booking, they will refund any deposits paid
                          and assist in finding a replacement of similar quality.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-requests">Special Requests or Requirements</Label>
                    <Textarea
                      id="special-requests"
                      placeholder="Any additional requests or requirements for the artist..."
                      className="bg-ethr-black border-muted min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 mt-1 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I have read and agree to the terms and conditions outlined in this contract.
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="border-muted text-muted-foreground hover:bg-ethr-black hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                  >
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-ethr-darkgray border-muted sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="DJ Synapse"
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">DJ Synapse</h3>
                      <p className="text-sm text-muted-foreground">Electronic / House DJ</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance Fee</span>
                      <span>$800.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>$40.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-muted">
                      <span>Total</span>
                      <span>$840.00</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted">
                    <h3 className="text-sm font-medium mb-2">Payment Schedule</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-ethr-neonblue mr-2" />
                          <span className="text-sm">Deposit (50%)</span>
                        </div>
                        <span className="text-sm">$420.00</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-sm pl-6">Balance (50%)</span>
                        <span className="text-sm">$420.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Confirm & Pay */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-ethr-darkgray border-muted mb-8">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Complete your booking by making a deposit payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="John Smith" className="bg-ethr-black border-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="bg-ethr-black border-muted pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="bg-ethr-black border-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" className="bg-ethr-black border-muted" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Billing Address</Label>
                    <Input id="billing-address" placeholder="Street Address" className="bg-ethr-black border-muted" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" className="bg-ethr-black border-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="ZIP" className="bg-ethr-black border-muted" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="save-card"
                        className="h-4 w-4 mt-1 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
                      />
                      <Label htmlFor="save-card" className="text-sm font-normal">
                        Save this card for future bookings
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="border-muted text-muted-foreground hover:bg-ethr-black hover:text-white"
                  >
                    Back
                  </Button>
                  <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
                    Pay Deposit ($420.00)
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-ethr-darkgray border-muted sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="DJ Synapse"
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">DJ Synapse</h3>
                      <p className="text-sm text-muted-foreground">Electronic / House DJ</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Event</p>
                    <p className="font-medium">Summer Beach Party</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">July 15, 2025 • 8:00 PM</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">2 hours</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">Oceanic Beach Club, Los Angeles</p>
                  </div>

                  <div className="pt-4 border-t border-muted space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance Fee</span>
                      <span>$800.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>$40.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-muted">
                      <span>Total</span>
                      <span>$840.00</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted">
                    <h3 className="text-sm font-medium mb-2">Payment Schedule</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-ethr-neonblue">Deposit (Due Now)</span>
                        </div>
                        <span className="text-sm font-medium">$420.00</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-sm">Balance (Due July 15)</span>
                        <span className="text-sm">$420.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
