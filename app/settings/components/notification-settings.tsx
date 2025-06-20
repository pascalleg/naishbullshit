"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailFrequency, setEmailFrequency] = useState("immediate")
  const [notifications, setNotifications] = useState({
    bookingRequests: true,
    bookingUpdates: true,
    messages: true,
    paymentUpdates: true,
    newReviews: true,
    promotions: false,
    newsletter: true,
    appUpdates: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
        <p className="text-muted-foreground mb-6">Control how and when you receive notifications from ETHR.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="booking-requests-email">Booking Requests</Label>
                <p className="text-sm text-muted-foreground">Receive emails when someone requests to book you</p>
              </div>
              <Switch
                id="booking-requests-email"
                checked={notifications.bookingRequests}
                onCheckedChange={() => handleToggle("bookingRequests")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="booking-updates-email">Booking Updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails when there are updates to your bookings</p>
              </div>
              <Switch
                id="booking-updates-email"
                checked={notifications.bookingUpdates}
                onCheckedChange={() => handleToggle("bookingUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="messages-email">Messages</Label>
                <p className="text-sm text-muted-foreground">Receive emails when you get new messages</p>
              </div>
              <Switch
                id="messages-email"
                checked={notifications.messages}
                onCheckedChange={() => handleToggle("messages")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-updates-email">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails about payment confirmations and updates</p>
              </div>
              <Switch
                id="payment-updates-email"
                checked={notifications.paymentUpdates}
                onCheckedChange={() => handleToggle("paymentUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-reviews-email">New Reviews</Label>
                <p className="text-sm text-muted-foreground">Receive emails when you get new reviews</p>
              </div>
              <Switch
                id="new-reviews-email"
                checked={notifications.newReviews}
                onCheckedChange={() => handleToggle("newReviews")}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Marketing Emails</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotions-email">Promotions and Offers</Label>
                <p className="text-sm text-muted-foreground">Receive emails about special offers and promotions</p>
              </div>
              <Switch
                id="promotions-email"
                checked={notifications.promotions}
                onCheckedChange={() => handleToggle("promotions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter-email">Newsletter</Label>
                <p className="text-sm text-muted-foreground">Receive our monthly newsletter with industry updates</p>
              </div>
              <Switch
                id="newsletter-email"
                checked={notifications.newsletter}
                onCheckedChange={() => handleToggle("newsletter")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-updates-email">App Updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
              </div>
              <Switch
                id="app-updates-email"
                checked={notifications.appUpdates}
                onCheckedChange={() => handleToggle("appUpdates")}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Frequency</h3>

          <RadioGroup value={emailFrequency} onValueChange={setEmailFrequency} className="space-y-3">
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="immediate" id="immediate" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="immediate" className="font-medium">
                  Immediate
                </Label>
                <p className="text-sm text-muted-foreground">Receive emails as events happen</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="daily" id="daily" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="daily" className="font-medium">
                  Daily Digest
                </Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of all notifications</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
              <RadioGroupItem value="weekly" id="weekly" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="weekly" className="font-medium">
                  Weekly Digest
                </Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of all notifications</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>

          <div className="p-4 border border-muted rounded-md bg-ethr-black">
            <p className="text-sm text-muted-foreground">
              Push notification settings can be managed in the ETHR mobile app. Download our app to manage these
              settings.
            </p>
            <Button className="mt-4 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
              Download Mobile App
            </Button>
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
    </div>
  )
}
