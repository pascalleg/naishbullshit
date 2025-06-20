"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { format, addMonths, isBefore, addDays, isValid, isWithinInterval, differenceInDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { getVenueAvailability, type DayAvailability } from "@/lib/api/venue-api"

interface MultiDayCalendarProps {
  venueId: string
  onDateRangeSelect: (startDate: Date | undefined, endDate: Date | undefined, totalPrice: number) => void
}

export function MultiDayCalendar({ venueId, onDateRangeSelect }: MultiDayCalendarProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for unavailable dates - in a real app, this would come from an API
  const unavailableDates = [
    new Date(2025, 4, 5), // May 5, 2025
    new Date(2025, 4, 6), // May 6, 2025
    new Date(2025, 4, 7), // May 7, 2025
    new Date(2025, 4, 12), // May 12, 2025
    new Date(2025, 4, 13), // May 13, 2025
    new Date(2025, 4, 20), // May 20, 2025
    new Date(2025, 4, 21), // May 21, 2025
    new Date(2025, 5, 1), // June 1, 2025
    new Date(2025, 5, 2), // June 2, 2025
    new Date(2025, 5, 10), // June 10, 2025
    new Date(2025, 5, 11), // June 11, 2025
  ]

  // Mock data for special pricing dates - in a real app, this would come from an API
  const specialPricingDates = [
    { date: new Date(2025, 4, 15), price: 1200 }, // May 15, 2025
    { date: new Date(2025, 4, 16), price: 1200 }, // May 16, 2025
    { date: new Date(2025, 4, 17), price: 1500 }, // May 17, 2025
    { date: new Date(2025, 4, 18), price: 1500 }, // May 18, 2025
    { date: new Date(2025, 5, 5), price: 1200 }, // June 5, 2025
    { date: new Date(2025, 5, 6), price: 1200 }, // June 6, 2025
    { date: new Date(2025, 5, 7), price: 1500 }, // June 7, 2025
    { date: new Date(2025, 5, 8), price: 1500 }, // June 8, 2025
  ]

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true)
      try {
        const data = await getVenueAvailability(venueId)
        setAvailability(data.availability)
      } catch (error) {
        console.error("Error fetching venue availability:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [venueId])

  useEffect(() => {
    const totalPrice = calculateTotalPrice()
    onDateRangeSelect(dateRange.from, dateRange.to, totalPrice)
  }, [dateRange])

  // Function to check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    // Validate date before processing
    if (!date || !isValid(date)) return true

    // Disable past dates
    if (isBefore(date, addDays(new Date(), -1))) {
      return true
    }

    // Check if date is in unavailable dates
    return unavailableDates.some(
      (unavailableDate) => unavailableDate && isValid(unavailableDate) && isSameDay(date, unavailableDate),
    )
  }

  // Function to get price for a date if it has special pricing
  const getDatePrice = (date: Date) => {
    // Validate date before processing
    if (!date || !isValid(date)) return 950

    const specialPricing = specialPricingDates.find(
      (pricing) => pricing.date && isValid(pricing.date) && isSameDay(date, pricing.date),
    )

    return specialPricing ? specialPricing.price : 950
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCalendarMonth((prev) => addMonths(prev, -1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCalendarMonth((prev) => addMonths(prev, 1))
  }

  // Safe format function to handle potential invalid dates
  const safeFormat = (date: Date | undefined, formatString: string, fallback = ""): string => {
    if (!date || !isValid(date)) return fallback
    try {
      return format(date, formatString)
    } catch (error) {
      console.error("Date formatting error:", error)
      return fallback
    }
  }

  // Calculate total nights and price
  const totalNights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0

  const calculateTotalPrice = () => {
    if (!dateRange.from || !dateRange.to) return 0

    let total = 0
    let currentDate = new Date(dateRange.from)

    while (currentDate <= dateRange.to) {
      total += getDatePrice(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    return total
  }

  const totalPrice = calculateTotalPrice()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-light text-white">Select Dates</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-white/10 text-white hover:bg-white/5"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-white/10 text-white hover:bg-white/5"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-center mb-2 text-white/70 font-light">
        {safeFormat(calendarMonth, "MMMM yyyy", "Calendar")}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethr-neonblue"></div>
        </div>
      ) : (
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          numberOfMonths={1}
          className="border-white/10 rounded-md p-3"
          classNames={{
            day_selected:
              "bg-ethr-neonblue text-white hover:bg-ethr-neonblue hover:text-white focus:bg-ethr-neonblue focus:text-white",
            day_today: "bg-white/10 text-white",
            day_disabled: "text-white/30 opacity-50 hover:bg-transparent",
            day_outside: "text-white/30 opacity-30",
            day_range_middle: "bg-ethr-neonblue/20 text-white",
            day_hidden: "invisible",
            day: "text-white hover:bg-white/10 focus:bg-white/10",
            head_cell: "text-white/50 font-light",
            cell: "text-center p-0 relative [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            nav_button: "text-white/70 hover:bg-white/10 hover:text-white",
            table: "border-collapse space-y-1",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            row: "flex w-full mt-2",
          }}
          components={{
            Day: ({ day, ...props }) => {
              // Validate the day prop
              if (!day || !isValid(day)) {
                return <div {...props} className={cn(props.className, "h-9 w-9 p-0 opacity-0")} />
              }

              const isUnavailable = isDateUnavailable(day)
              const price = getDatePrice(day)
              const isSpecialPrice = specialPricingDates.some(
                (pricing) => pricing.date && isValid(pricing.date) && isSameDay(day, pricing.date),
              )
              const isSelected =
                dateRange.from &&
                dateRange.to &&
                isWithinInterval(day, {
                  start: dateRange.from,
                  end: dateRange.to,
                })

              return (
                <div
                  {...props}
                  className={cn(
                    props.className,
                    "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    isUnavailable && "line-through opacity-50 cursor-not-allowed",
                    isSpecialPrice && !isUnavailable && "ring-1 ring-ethr-neonpurple/50",
                    isSelected && "bg-ethr-neonblue/20",
                  )}
                  style={{ pointerEvents: isUnavailable ? "none" : "auto" }}
                >
                  <time
                    dateTime={safeFormat(day, "yyyy-MM-dd", "")}
                    className="flex h-9 w-9 items-center justify-center"
                  >
                    {safeFormat(day, "d", "")}
                  </time>
                  {!isUnavailable && (
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] font-light text-white/70">
                      ${price}
                    </div>
                  )}
                </div>
              )
            },
          }}
          disabled={isDateUnavailable}
          fromDate={new Date()}
          fixedWeeks
        />
      )}

      {(dateRange.from || dateRange.to) && (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-ethr-neonblue" />
              <span className="text-white/70">Date Range</span>
            </div>
            <span className="text-white font-light">
              {dateRange.from && dateRange.to
                ? `${safeFormat(dateRange.from, "MMM d")} - ${safeFormat(dateRange.to, "MMM d, yyyy")}`
                : "Select dates"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Nights</span>
            <span className="text-white font-light">{totalNights}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Price</span>
            <span className="text-white font-medium">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white/10 rounded-full mr-2"></div>
          <span className="text-white/70">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white/30 rounded-full mr-2 line-through"></div>
          <span className="text-white/70">Unavailable</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white/10 rounded-full ring-1 ring-ethr-neonpurple/50 mr-2"></div>
          <span className="text-white/70">Special pricing</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-ethr-neonblue/20 rounded-full mr-2"></div>
          <span className="text-white/70">Selected range</span>
        </div>
      </div>
    </div>
  )
}
