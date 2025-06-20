"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, Loader2, Shield, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSavePassword = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      setSuccess("Password updated successfully")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    // Simple password strength calculation
    let strength = 0
    if (newPassword.length > 0) strength += 20
    if (newPassword.length >= 8) strength += 20
    if (/[A-Z]/.test(newPassword)) strength += 20
    if (/[0-9]/.test(newPassword)) strength += 20
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 20

    setPasswordStrength(strength)
  }

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true)
    } else {
      setShowQRCode(false)
    }
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
        <p className="text-muted-foreground mb-6">Manage your account security and authentication methods.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-500/10">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••"
              className="bg-ethr-black border-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              className="bg-ethr-black border-muted"
            />

            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Password strength</span>
                  <span>{passwordStrength >= 80 ? "Strong" : passwordStrength >= 40 ? "Medium" : "Weak"}</span>
                </div>
                <Progress
                  value={passwordStrength}
                  className="h-1"
                  indicatorClassName={`${
                    passwordStrength >= 80 ? "bg-green-500" : passwordStrength >= 40 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />

                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    {password.length >= 8 ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    {/[A-Z]/.test(password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    {/[0-9]/.test(password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    {/[^A-Za-z0-9]/.test(password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="bg-ethr-black border-muted"
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSavePassword}
              className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
          </div>

          {showQRCode && (
            <div className="mt-4 p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex flex-col items-center space-y-4">
                <Shield className="h-12 w-12 text-ethr-neonblue" />
                <h4 className="font-medium">Set up Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with your authenticator app (like Google Authenticator or Authy)
                </p>
                <div className="bg-white p-4 rounded-md">
                  <Image src="/placeholder.svg?height=200&width=200" alt="2FA QR Code" width={200} height={200} />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="verification-code">Enter verification code</Label>
                  <Input id="verification-code" placeholder="123456" className="bg-ethr-black border-muted" />
                </div>
                <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
                  Verify and Enable
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Sessions</h3>

          <div className="space-y-4">
            <div className="p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">Current Session</span>
                    <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Los Angeles, CA, USA • Chrome on macOS</p>
                  <p className="text-xs text-muted-foreground mt-1">Started April 29, 2025 at 11:25 AM</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-muted text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
                >
                  This Device
                </Button>
              </div>
            </div>

            <div className="p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">Mobile App</span>
                    <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Los Angeles, CA, USA • ETHR App on iOS</p>
                  <p className="text-xs text-muted-foreground mt-1">Last active April 28, 2025 at 8:15 PM</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  Log Out
                </Button>
              </div>
            </div>

            <div className="p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">Unknown Device</span>
                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">New York, NY, USA • Firefox on Windows</p>
                  <p className="text-xs text-muted-foreground mt-1">Last active April 25, 2025 at 3:42 PM</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500">
              Log Out of All Other Devices
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
