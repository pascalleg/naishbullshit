"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarPlus, RefreshCw, Check } from "lucide-react"
import {
  type CalendarSyncConfig,
  getCalendarSyncConfigs,
  addCalendarSync,
  updateCalendarSync,
  syncCalendar,
} from "@/lib/api/venue-api"
import { format } from "date-fns"

interface CalendarSyncProps {
  venueId: string
}

export function CalendarSync({ venueId }: CalendarSyncProps) {
  const [syncConfigs, setSyncConfigs] = useState<CalendarSyncConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newConfig, setNewConfig] = useState<{
    provider: "google" | "outlook" | "ical" | "other"
    url?: string
    syncEnabled: boolean
  }>({
    provider: "google",
    url: "",
    syncEnabled: true,
  })

  useEffect(() => {
    const fetchSyncConfigs = async () => {
      setLoading(true)
      try {
        const configs = await getCalendarSyncConfigs(venueId)
        setSyncConfigs(configs)
      } catch (error) {
        console.error("Error fetching calendar sync configs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSyncConfigs()
  }, [venueId])

  const handleAddSync = async () => {
    try {
      const config = await addCalendarSync({
        venueId,
        provider: newConfig.provider,
        url: newConfig.url,
        syncEnabled: newConfig.syncEnabled,
      })

      setSyncConfigs([...syncConfigs, config])
      setShowAddForm(false)
      setNewConfig({
        provider: "google",
        url: "",
        syncEnabled: true,
      })
    } catch (error) {
      console.error("Error adding calendar sync:", error)
    }
  }

  const handleToggleSync = async (index: number) => {
    const config = { ...syncConfigs[index], syncEnabled: !syncConfigs[index].syncEnabled }

    try {
      await updateCalendarSync(config)

      const updatedConfigs = [...syncConfigs]
      updatedConfigs[index] = config
      setSyncConfigs(updatedConfigs)
    } catch (error) {
      console.error("Error updating calendar sync:", error)
    }
  }

  const handleSync = async (provider: "google" | "outlook" | "ical" | "other") => {
    setSyncing(provider)
    try {
      await syncCalendar(venueId, provider)

      // Update the lastSynced timestamp in the UI
      const updatedConfigs = syncConfigs.map((config) => {
        if (config.provider === provider) {
          return { ...config, lastSynced: new Date().toISOString() }
        }
        return config
      })

      setSyncConfigs(updatedConfigs)
    } catch (error) {
      console.error("Error syncing calendar:", error)
    } finally {
      setSyncing(null)
    }
  }

  const formatLastSynced = (lastSynced: string | null) => {
    if (!lastSynced) return "Never"

    try {
      return format(new Date(lastSynced), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-light">Calendar Sync</CardTitle>
        <CardDescription className="text-white/70">
          Sync your venue's availability with external calendars to avoid double bookings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethr-neonblue"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {syncConfigs.length > 0 ? (
              syncConfigs.map((config, index) => (
                <div key={index} className="bg-white/5 rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium capitalize">{config.provider} Calendar</h4>
                      {config.url && <p className="text-sm text-white/70 truncate max-w-[250px]">{config.url}</p>}
                    </div>
                    <Switch checked={config.syncEnabled} onCheckedChange={() => handleToggleSync(index)} />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Last synced: {formatLastSynced(config.lastSynced)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                      onClick={() => handleSync(config.provider)}
                      disabled={!config.syncEnabled || syncing === config.provider}
                    >
                      {syncing === config.provider ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Syncing...
                        </div>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <p>No calendar syncs configured yet.</p>
              </div>
            )}

            {showAddForm ? (
              <div className="bg-white/5 rounded-md p-4 mt-4">
                <h4 className="font-medium mb-4">Add New Calendar Sync</h4>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="provider">Calendar Provider</Label>
                    <select
                      id="provider"
                      className="bg-white/5 border border-white/10 rounded-md p-2 text-white w-full"
                      value={newConfig.provider}
                      onChange={(e) => setNewConfig({ ...newConfig, provider: e.target.value as any })}
                    >
                      <option value="google">Google Calendar</option>
                      <option value="outlook">Outlook Calendar</option>
                      <option value="ical">iCal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="url">Calendar URL or ID</Label>
                    <Input
                      id="url"
                      value={newConfig.url || ""}
                      onChange={(e) => setNewConfig({ ...newConfig, url: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter calendar URL or ID"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enabled" className="cursor-pointer">
                      Enable Sync
                    </Label>
                    <Switch
                      id="enabled"
                      checked={newConfig.syncEnabled}
                      onCheckedChange={(checked) => setNewConfig({ ...newConfig, syncEnabled: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white"
                    onClick={handleAddSync}
                    disabled={!newConfig.url}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Add Calendar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                onClick={() => setShowAddForm(true)}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Calendar Sync
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start border-t border-white/10 pt-4">
        <h4 className="font-medium mb-2">Supported Calendar Services</h4>
        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
          <li>Google Calendar</li>
          <li>Microsoft Outlook</li>
          <li>Apple iCal</li>
          <li>Any calendar service that supports iCal format</li>
        </ul>
      </CardFooter>
    </Card>
  )
}
