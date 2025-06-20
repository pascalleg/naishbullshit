"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MoreHorizontal,
  Music,
  Plus,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [blockDateOpen, setBlockDateOpen] = useState(false)
  const [viewEventOpen, setViewEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Mock data for events
  const events = [
    {
      id: "e1",
      title: "Neon Nights Festival",
      date: new Date(2025, 3, 30), // April 30, 2025
      startTime: "8:00 PM",
      endTime: "10:00 PM",
      location: "Skyline Arena, Los Angeles",
      type: "performance",
      status: "confirmed",
    },
    {
      id: "e2",
      title: "Club Resonance Residency",
      date: new Date(2025, 4, 15), // May 15, 2025
      startTime: "10:00 PM",
      endTime: "2:00 AM",
      location: "Club Resonance, Miami",
      type: "performance",
      status: "pending",
    },
    {
      id: "e3",
      title: "Sunset Beach Party",
      date: new Date(2025, 5, 12), // June 12, 2025
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      location: "Oceanic Sands, San Diego",
      type: "performance",
      status: "confirmed",
    },
    {
      id: "e4",
      title: "Studio Session",
      date: new Date(2025, 3, 20), // April 20, 2025
      startTime: "2:00 PM",
      endTime: "6:00 PM",
      location: "Echo Studios, Los Angeles",
      type: "personal",
      status: "confirmed",
    },
  ]

  // Mock data for blocked dates
  const blockedDates = [
    {
      id: "b1",
      date: new Date(2025, 3, 10), // April 10, 2025
      reason: "Personal",
    },
    {
      id: "b2",
      date: new Date(2025, 3, 11), // April 11, 2025
      reason: "Personal",
    },
    {
      id: "b3",
      date: new Date(2025, 4, 5), // May 5, 2025
      reason: "Travel",
    },
    {
      id: "b4",
      date: new Date(2025, 4, 6), // May 6, 2025
      reason: "Travel",
    },
    {
      id: "b5",
      date: new Date(2025, 4, 7), // May 7, 2025
      reason: "Travel",
    },
  ]

  // Helper functions for calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long" })
  }

  const getYearName = (date: Date) => {
    return date.getFullYear()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isEventDate = (date: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const isBlockedDate = (date: Date) => {
    return blockedDates.some(
      (blockedDate) =>
        blockedDate.date.getDate() === date.getDate() &&
        blockedDate.date.getMonth() === date.getMonth() &&
        blockedDate.date.getFullYear() === date.getFullYear(),
    )
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getBlockedDateInfo = (date: Date) => {
    return blockedDates.find(
      (blockedDate) =>
        blockedDate.date.getDate() === date.getDate() &&
        blockedDate.date.getMonth() === date.getMonth() &&
        blockedDate.date.getFullYear() === date.getFullYear(),
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event)
    setViewEventOpen(true)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-muted bg-ethr-black/30"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isEventDay = isEventDate(date)
      const isBlocked = isBlockedDate(date)

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 border border-muted p-1 relative ${
            isToday(date) ? "bg-ethr-neonblue/10" : "bg-ethr-black/30"
          } ${isEventDay ? "hover:border-ethr-neonblue" : ""} ${
            isBlocked ? "hover:border-red-500" : ""
          } transition-colors cursor-pointer`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${isToday(date) ? "bg-ethr-neonblue text-white px-2 rounded-full" : ""}`}
            >
              {day}
            </span>
            {isBlocked && <Badge className="bg-red-500/20 text-red-500 border-none">Blocked</Badge>}
          </div>
          <div className="mt-1 space-y-1 overflow-hidden max-h-[calc(100%-24px)]">
            {getEventsForDate(date).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${
                  event.type === "performance"
                    ? "bg-ethr-neonblue/20 text-ethr-neonblue"
                    : "bg-purple-500/20 text-purple-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewEvent(event)
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Calendar</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => setBlockDateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Block Dates
          </Button>
          <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-ethr-darkgray border-muted">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {getMonthName(currentMonth)} {getYearName(currentMonth)}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-ethr-darkgray border-muted">
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedDate ? (
                  isBlockedDate(selectedDate) ? (
                    <Badge className="bg-red-500/20 text-red-500 border-none">Blocked Date</Badge>
                  ) : isEventDate(selectedDate) ? (
                    <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">Events Scheduled</Badge>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-500 border-none">Available</Badge>
                  )
                ) : (
                  "Click on a date to view details"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && (
                <div className="space-y-4">
                  {isBlockedDate(selectedDate) && (
                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                      <h3 className="font-medium text-red-500">Blocked Date</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reason: {getBlockedDateInfo(selectedDate)?.reason}
                      </p>
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500/10">
                          Unblock Date
                        </Button>
                      </div>
                    </div>
                  )}

                  {getEventsForDate(selectedDate).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">Events</h3>
                      {getEventsForDate(selectedDate).map((event) => (
                        <div
                          key={event.id}
                          className="bg-ethr-black p-3 rounded-lg border border-muted hover:border-ethr-neonblue/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewEvent(event)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Cancel Event</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4 text-ethr-neonblue" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4 text-ethr-neonblue" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Music className="mr-1 h-4 w-4 text-ethr-neonblue" />
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge
                              className={
                                event.status === "confirmed"
                                  ? "bg-green-500/20 text-green-500 border-none"
                                  : "bg-yellow-500/20 text-yellow-500 border-none"
                              }
                            >
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isBlockedDate(selectedDate) && getEventsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-4">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium">No Events Scheduled</h3>
                      <p className="text-sm text-muted-foreground mt-1">This date is available for bookings</p>
                      <div className="flex justify-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                          onClick={() => setBlockDateOpen(true)}
                        >
                          Block Date
                        </Button>
                        <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
                          Add Event
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!selectedDate && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">No Date Selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">Click on a date to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-ethr-neonblue/20 mr-2"></div>
          <span className="text-sm">Performance Event</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-500/20 mr-2"></div>
          <span className="text-sm">Personal Event</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500/20 mr-2"></div>
          <span className="text-sm">Blocked Date</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500/20 mr-2"></div>
          <span className="text-sm">Available Date</span>
        </div>
      </div>

      {/* Block Date Dialog */}
      <Dialog open={blockDateOpen} onOpenChange={setBlockDateOpen}>
        <DialogContent className="bg-ethr-darkgray">
          <DialogHeader>
            <DialogTitle>Block Date</DialogTitle>
            <DialogDescription>Block dates when you're unavailable to prevent booking requests</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="block-date-start">Start Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="block-date-start"
                  type="date"
                  className="pl-10 bg-ethr-black border-muted"
                  defaultValue={selectedDate?.toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-date-end">End Date (Optional)</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="block-date-end" type="date" className="pl-10 bg-ethr-black border-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-reason">Reason</Label>
              <Select defaultValue="personal">
                <SelectTrigger id="block-reason" className="bg-ethr-black border-muted">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-notes">Notes (Optional)</Label>
              <Input id="block-notes" placeholder="Add notes" className="bg-ethr-black border-muted" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="block-recurring" />
              <Label htmlFor="block-recurring" className="text-sm font-normal">
                Make this a recurring block
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDateOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90">Block Date</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={viewEventOpen} onOpenChange={setViewEventOpen}>
        <DialogContent className="bg-ethr-darkgray">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                  <p className="font-medium">
                    {selectedEvent?.startTime} - {selectedEvent?.endTime}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="font-medium">{selectedEvent?.location}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Event Type</h3>
                  <p className="font-medium">
                    {selectedEvent?.type.charAt(0).toUpperCase() + selectedEvent?.type.slice(1)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge
                    className={
                      selectedEvent?.status === "confirmed"
                        ? "bg-green-500/20 text-green-500 border-none"
                        : "bg-yellow-500/20 text-yellow-500 border-none"
                    }
                  >
                    {selectedEvent?.status.charAt(0).toUpperCase() + selectedEvent?.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Event Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent?.type === "performance"
                      ? "Performance at " +
                        selectedEvent?.title +
                        ". Please arrive 1 hour before the start time for setup and sound check."
                      : "Personal event: " + selectedEvent?.title}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Standard DJ equipment setup</li>
                    <li>Access to power outlets</li>
                    <li>Stable table/booth for equipment</li>
                    <li>Adequate lighting</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="contract" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Contract Status</h3>
                  <Badge className="bg-green-500/20 text-green-500 border-none">Signed</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> View Full Contract
                </Button>
              </TabsContent>
              <TabsContent value="messages" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Messages</h3>
                  <div className="bg-ethr-black p-3 rounded-lg border border-muted">
                    <p className="text-sm">
                      "Looking forward to having you perform at our event. Please confirm your arrival time."
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Alex Rivera - 2 days ago</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Open Message Thread
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="flex-1">
                Edit Event
              </Button>
              <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90 flex-1">
                View Booking Details
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
