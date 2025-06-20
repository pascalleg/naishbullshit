"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange as DayPickerDateRange } from "react-day-picker"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  loading?: boolean
}

function MetricCard({ title, value, change, icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card className="bg-ethr-darkgray border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-ethr-darkgray border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center pt-1">
          {change > 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm ${
              change > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {Math.abs(change)}% from last month
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

interface ActivityItem {
  id: string;
  type: "booking" | "message" | "payment";
  title: string;
  description: string;
  time: string;
  userData?: {
    name: string;
    avatar?: string;
  };
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  venueData: {
    name: string;
    location: string;
  };
  teamMembers: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    revenue: 0,
    activeClients: 0,
    pendingContracts: 0,
    changes: {
      bookings: 0,
      revenue: 0,
      clients: 0,
      contracts: 0,
    },
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>(undefined)
  const [activityFilter, setActivityFilter] = useState<"all" | "booking" | "message" | "payment">("all")
  const [eventSort, setEventSort] = useState<"date" | "status">("date")
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Fetch metrics with date range
        const { data: metricsData, error: metricsError } = await supabase
          .from("dashboard_metrics")
          .select("*")
          .single()

        if (metricsError) throw metricsError
        setMetrics(metricsData)

        // Fetch recent activity with filter
        const query = supabase
          .from("recent_activity")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (activityFilter !== "all") {
          query.eq("type", activityFilter)
        }

        const { data: activityData, error: activityError } = await query
        if (activityError) throw activityError
        
        // Transform the data to match our ActivityItem interface
        const transformedActivity = activityData.map((activity: any) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: activity.time,
          userData: activity.user_data,
          created_at: activity.created_at,
        }))
        
        setRecentActivity(transformedActivity)

        // Fetch upcoming events with sorting
        const { data: eventsData, error: eventsError } = await supabase
          .from("upcoming_events")
          .select("*")
          .order(eventSort === "date" ? "date" : "status", { ascending: true })
          .limit(5)

        if (eventsError) throw eventsError
        setUpcomingEvents(eventsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up real-time subscriptions
    const metricsSubscription = supabase
      .channel("dashboard_metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_metrics" },
        (payload) => {
          setMetrics(payload.new as typeof metrics)
        }
      )
      .subscribe()

    const activitySubscription = supabase
      .channel("recent_activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recent_activity" },
        (payload) => {
          setRecentActivity((current) => [payload.new as ActivityItem, ...current].slice(0, 5))
        }
      )
      .subscribe()

    const eventsSubscription = supabase
      .channel("upcoming_events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "upcoming_events" },
        (payload) => {
          setUpcomingEvents((current) => {
            const newEvents = [...current]
            const index = newEvents.findIndex((e) => e.id === payload.new.id)
            if (index >= 0) {
              newEvents[index] = payload.new as Event
            } else {
              newEvents.push(payload.new as Event)
            }
            return newEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5)
          })
        }
      )
      .subscribe()

    return () => {
      metricsSubscription.unsubscribe()
      activitySubscription.unsubscribe()
      eventsSubscription.unsubscribe()
    }
  }, [supabase, dateRange, activityFilter, eventSort])

  const filteredActivity = recentActivity.filter(
    (activity) => activityFilter === "all" || activity.type === activityFilter
  )

  const sortedEvents = [...upcomingEvents].sort((a, b) => {
    if (eventSort === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    return a.status.localeCompare(b.status)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "border-muted justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange?.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookings.toString()}
          change={metrics.changes.bookings}
          icon={<Calendar className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          change={metrics.changes.revenue}
          icon={<TrendingUp className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Active Clients"
          value={metrics.activeClients.toString()}
          change={metrics.changes.clients}
          icon={<Users className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Pending Contracts"
          value={metrics.pendingContracts.toString()}
          change={metrics.changes.contracts}
          icon={<FileText className="h-4 w-4" />}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-ethr-darkgray border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <Select
              value={activityFilter}
              onValueChange={(value: typeof activityFilter) => setActivityFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 rounded-lg border border-muted p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border border-muted p-4"
                    >
                      {activity.userData && (
                        <Avatar>
                          <AvatarImage src={activity.userData.avatar} />
                          <AvatarFallback>
                            {activity.userData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {activity.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              activity.type === "booking"
                                ? "border-green-500 text-green-500"
                                : activity.type === "message"
                                ? "border-blue-500 text-blue-500"
                                : "border-purple-500 text-purple-500"
                            }
                          >
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-ethr-darkgray border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
            <Select
              value={eventSort}
              onValueChange={(value: typeof eventSort) => setEventSort(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 rounded-lg border border-muted p-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 rounded-lg border border-muted p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {event.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="border-ethr-neonblue text-ethr-neonblue"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {event.teamMembers.length} team members assigned
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}