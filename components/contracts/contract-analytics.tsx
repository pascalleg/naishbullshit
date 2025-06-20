import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, Eye, FileEdit, FileText, Share2, Printer, FileDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ContractAnalyticsProps {
  contractId: string
}

interface AnalyticsData {
  total_views: number
  total_downloads: number
  total_signs: number
  total_edits: number
  total_shares: number
  total_prints: number
  total_exports: number
  action_timeline: Array<{
    date: string
    views: number
    downloads: number
    signs: number
    edits: number
    shares: number
    prints: number
    exports: number
  }>
}

export function ContractAnalytics({ contractId }: ContractAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  })

  useEffect(() => {
    fetchAnalytics()
  }, [contractId, dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (dateRange.from) {
        params.append('startDate', dateRange.from.toISOString())
      }
      if (dateRange.to) {
        params.append('endDate', dateRange.to.toISOString())
      }

      const response = await fetch(
        `/api/contracts/${contractId}/analytics?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const trackAction = async (action: string) => {
    try {
      await fetch(`/api/contracts/${contractId}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
    } catch (err) {
      console.error('Failed to track action:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p>{error}</p>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const metrics = [
    {
      title: 'Total Views',
      value: analytics.total_views,
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'Downloads',
      value: analytics.total_downloads,
      icon: Download,
      color: 'text-green-500'
    },
    {
      title: 'Signatures',
      value: analytics.total_signs,
      icon: FileText,
      color: 'text-purple-500'
    },
    {
      title: 'Edits',
      value: analytics.total_edits,
      icon: FileEdit,
      color: 'text-orange-500'
    },
    {
      title: 'Shares',
      value: analytics.total_shares,
      icon: Share2,
      color: 'text-pink-500'
    },
    {
      title: 'Prints',
      value: analytics.total_prints,
      icon: Printer,
      color: 'text-yellow-500'
    },
    {
      title: 'Exports',
      value: analytics.total_exports,
      icon: FileDown,
      color: 'text-indigo-500'
    }
  ]

  const chartData = analytics.action_timeline.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    views: item.views,
    downloads: item.downloads,
    signs: item.signs,
    edits: item.edits,
    shares: item.shares,
    prints: item.prints,
    exports: item.exports
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Contract Analytics</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range: DateRange | undefined) =>
                setDateRange(range || { from: undefined, to: undefined })
              }
              numberOfMonths={2}
              required={false}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={cn('h-4 w-4', metric.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#22c55e"
                  name="Downloads"
                />
                <Line
                  type="monotone"
                  dataKey="signs"
                  stroke="#a855f7"
                  name="Signatures"
                />
                <Line
                  type="monotone"
                  dataKey="edits"
                  stroke="#f97316"
                  name="Edits"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#ec4899"
                  name="Shares"
                />
                <Line
                  type="monotone"
                  dataKey="prints"
                  stroke="#eab308"
                  name="Prints"
                />
                <Line
                  type="monotone"
                  dataKey="exports"
                  stroke="#6366f1"
                  name="Exports"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 