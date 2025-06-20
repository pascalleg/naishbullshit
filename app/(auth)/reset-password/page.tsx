"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "../auth-layout"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Basic validation
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      // In a real app, you would call your password reset API here
      // const response = await resetPassword(email)

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" description="Enter your email to receive a password reset link">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="space-y-6">
          <Alert className="border-ethr-neonblue bg-ethr-neonblue/10">
            <CheckCircle2 className="h-4 w-4 text-ethr-neonblue" />
            <AlertDescription>Password reset link sent! Check your email for instructions.</AlertDescription>
          </Alert>

          <div className="text-center">
            <Link href="/login">
              <Button variant="outline" className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-ethr-darkgray border-muted"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>

          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-ethr-neonblue hover:text-ethr-neonblue/90">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
