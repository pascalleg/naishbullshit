"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPortfolioAnalytics } from "../actions"
import { Loader2, TrendingUp, Globe, Share2, Eye } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnalyticsData {
  totalViews: number
  averageDailyViews: number
  viewsData: { date: string; views: number }[]
  engagementData: { date: string; likes: number; shares: number; saves: number }[]
  geoData: { country: string; views: number }[]
  referrerData: { source: string; count: number }[]
  mediaPerformance: { title: string; type: string; views: number }[]
}

export function PortfolioAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const data = await getPortfolioAnalytics()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <Card className="bg-ethr-darkgray border-muted">
        <CardHeader>
          <CardTitle>Portfolio Analytics</CardTitle>
          <CardDescription>Loading your portfolio performance data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ethr-neonblue" />
        </CardContent>
      </Card>
    )
  }

  if (!analyticsData) {
    return (
      <Card className="bg-ethr-darkgray border-muted">
        <CardHeader>
          <CardTitle>Portfolio Analytics</CardTitle>
          <CardDescription>Failed to load analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There was an error loading your analytics data. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ]

  return (
    <Card className="bg-ethr-darkgray border-muted">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Portfolio Analytics</CardTitle>
          <CardDescription>Track your portfolio performance and engagement</CardDescription>
        </div>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-ethr-black">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-ethr-black p-4 rounded-lg border border-muted">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold mt-1">{analyticsData.totalViews.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center">
                <Eye className="h-5 w-5 text-ethr-neonblue" />
              </div>
            </div>
          </div>

          <div className="bg-ethr-black p-4 rounded-lg border border-muted">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <h3 className="text-2xl font-bold mt-1">{analyticsData.averageDailyViews.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-ethr-neonblue" />
              </div>
            </div>
          </div>

          <div className="bg-ethr-black p-4 rounded-lg border border-muted">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <h3 className="text-2xl font-bold mt-1">
                  {analyticsData.engagementData
                    .reduce((sum, day) => sum + day.likes + day.shares + day.saves, 0)
                    .toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-ethr-neonblue" />
              </div>
            </div>
          </div>

          <div className="bg-ethr-black p-4 rounded-lg border border-muted">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Countries Reached</p>
                <h3 className="text-2xl font-bold mt-1">{analyticsData.geoData.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-ethr-neonblue" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="views" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="media">Media Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="space-y-4">
            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <h3 className="text-lg font-medium mb-4">Daily Views</h3>
              <div className="h-80">
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.viewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#888" }}
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      />
                      <YAxis tick={{ fill: "#888" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="var(--color-views)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <h3 className="text-lg font-medium mb-4">Traffic Sources</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.referrerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="source"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.referrerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} views`, "Traffic"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <h3 className="text-lg font-medium mb-4">Engagement Metrics</h3>
              <div className="h-80">
                <ChartContainer
                  config={{
                    likes: {
                      label: "Likes",
                      color: "hsl(var(--chart-1))",
                    },
                    shares: {
                      label: "Shares",
                      color: "hsl(var(--chart-2))",
                    },
                    saves: {
                      label: "Saves",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#888" }}
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      />
                      <YAxis tick={{ fill: "#888" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} />
                      <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" strokeWidth={2} />
                      <Line type="monotone" dataKey="saves" stroke="var(--color-saves)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-4">
            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.geoData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" tick={{ fill: "#888" }} />
                    <YAxis dataKey="country" type="category" tick={{ fill: "#888" }} width={80} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" radius={[0, 4, 4, 0]}>
                      {analyticsData.geoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="bg-ethr-black p-4 rounded-lg border border-muted">
              <h3 className="text-lg font-medium mb-4">Media Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.mediaPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="title" tick={{ fill: "#888" }} angle={-45} textAnchor="end" height={70} />
                    <YAxis tick={{ fill: "#888" }} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {analyticsData.mediaPerformance.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.type === "image" ? "#8884d8" : entry.type === "audio" ? "#82ca9d" : "#ffc658"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-2"></div>
                  <span className="text-sm">Images</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#82ca9d] rounded-full mr-2"></div>
                  <span className="text-sm">Audio</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#ffc658] rounded-full mr-2"></div>
                  <span className="text-sm">Videos</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
