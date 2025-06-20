"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountType, setAccountType] = useState("artist")
  const [publicProfile, setPublicProfile] = useState(true)
  const [availableForBooking, setAvailableForBooking] = useState(true)

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate error (uncomment to test)
      // throw new Error("Failed to update account settings. Please try again.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
        <p className="text-muted-foreground mb-6">Manage your account details and preferences.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="djsynapse@example.com" className="bg-ethr-black border-muted" />
          <p className="text-xs text-muted-foreground">This is the email used for account notifications and login.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-ethr-black border-muted" />
          <p className="text-xs text-muted-foreground">
            Used for important account notifications and booking confirmations.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Type</h3>
          <RadioGroup value={accountType} onValueChange={setAccountType} className="space-y-3">
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="artist" id="artist" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="artist" className="font-medium">
                  Artist / Performer
                </Label>
                <p className="text-sm text-muted-foreground">
                  You perform at events and are looking to be booked by venues and event organizers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="venue" id="venue" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="venue" className="font-medium">
                  Venue / Event Organizer
                </Label>
                <p className="text-sm text-muted-foreground">
                  You manage a venue or organize events and are looking to book artists.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="production" id="production" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="production" className="font-medium">
                  Production Professional
                </Label>
                <p className="text-sm text-muted-foreground">
                  You provide production services like sound, lighting, or stage management.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow others to view your profile and booking information</p>
            </div>
            <Switch id="public-profile" checked={publicProfile} onCheckedChange={setPublicProfile} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="available-booking">Available for Booking</Label>
              <p className="text-sm text-muted-foreground">Show that you're currently accepting booking requests</p>
            </div>
            <Switch id="available-booking" checked={availableForBooking} onCheckedChange={setAvailableForBooking} />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Language & Region</h3>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language" className="bg-ethr-black border-muted">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="america-los_angeles">
              <SelectTrigger id="timezone" className="bg-ethr-black border-muted">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america-los_angeles">Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="america-new_york">Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="america-chicago">Central Time (US & Canada)</SelectItem>
                <SelectItem value="america-denver">Mountain Time (US & Canada)</SelectItem>
                <SelectItem value="europe-london">London</SelectItem>
                <SelectItem value="europe-paris">Paris</SelectItem>
                <SelectItem value="asia-tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-muted">
        <h3 className="text-lg font-medium text-red-500 mb-4">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Link href="/settings/delete-account">
          <Button variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-400">
            Delete Account
          </Button>
        </Link>
      </div>
    </div>
  )
}
