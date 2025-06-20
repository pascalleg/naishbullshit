"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MainNav } from "@/components/main-nav"
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { DeleteAccountSteps } from "./components/delete-account-steps"

export default function DeleteAccountPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false,
    content: false,
  })
  const [password, setPassword] = useState("")

  const allConfirmed = Object.values(confirmations).every(Boolean)
  const canProceed = currentStep === 1 ? reason !== "" : currentStep === 2 ? allConfirmed : password.length >= 6

  const handleConfirmationChange = (key: keyof typeof confirmations) => {
    setConfirmations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleNextStep = () => {
    if (currentStep < 3 && canProceed) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    } else {
      router.push("/settings")
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would call your API to delete the account
      // await deleteAccount(password, reason, feedback)

      // Redirect to a confirmation page
      router.push("/account-deleted")
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handlePrevStep} className="rounded-full hover:bg-ethr-darkgray">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <h1 className="text-3xl font-bold">Delete Account</h1>
        </div>

        <DeleteAccountSteps currentStep={currentStep} />

        <Card className="bg-ethr-darkgray border-muted mt-8">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Why are you leaving?</CardTitle>
                <CardDescription>
                  We're sorry to see you go. Your feedback helps us improve ETHR for everyone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={reason} onValueChange={setReason} className="space-y-3">
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="not-using" id="not-using" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="not-using" className="font-medium">
                        I'm not using ETHR enough
                      </Label>
                      <p className="text-sm text-muted-foreground">I don't find myself using the platform regularly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="found-alternative" id="found-alternative" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="found-alternative" className="font-medium">
                        I found an alternative service
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I'm using another platform that better meets my needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="too-complicated" id="too-complicated" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="too-complicated" className="font-medium">
                        ETHR is too complicated
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I find the platform difficult to use or understand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="missing-features" id="missing-features" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="missing-features" className="font-medium">
                        Missing features or functionality
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        ETHR doesn't have features that are important to me
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="privacy-concerns" id="privacy-concerns" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="privacy-concerns" className="font-medium">
                        Privacy concerns
                      </Label>
                      <p className="text-sm text-muted-foreground">I'm concerned about how my data is being used</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                    <RadioGroupItem value="other" id="other" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="other" className="font-medium">
                        Other reason
                      </Label>
                      <p className="text-sm text-muted-foreground">I have another reason not listed here</p>
                    </div>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Additional feedback (optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us more about your experience and why you're leaving..."
                    className="bg-ethr-black border-muted min-h-[100px]"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Understand what happens next</CardTitle>
                <CardDescription>
                  Please review the following information about deleting your ETHR account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>This action cannot be undone</AlertTitle>
                  <AlertDescription>
                    Once you delete your account, all your data will be permanently removed from our systems.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 p-4 border border-muted rounded-md bg-ethr-black">
                  <h3 className="font-semibold">When you delete your account:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-sm">
                        Your profile, photos, posts, videos, and all other content will be permanently deleted
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-sm">You won't be able to recover anything that you've added</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-sm">
                        You will lose access to your ETHR account and all associated services
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-sm">
                        Any active bookings or contracts will need to be resolved before deletion
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-sm">Your username may become available for someone else to use</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="understand"
                      checked={confirmations.understand}
                      onCheckedChange={() => handleConfirmationChange("understand")}
                    />
                    <Label htmlFor="understand" className="text-sm font-normal">
                      I understand that I'm about to delete my ETHR account and all associated data
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="permanent"
                      checked={confirmations.permanent}
                      onCheckedChange={() => handleConfirmationChange("permanent")}
                    />
                    <Label htmlFor="permanent" className="text-sm font-normal">
                      I understand that this action is permanent and cannot be undone
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="content"
                      checked={confirmations.content}
                      onCheckedChange={() => handleConfirmationChange("content")}
                    />
                    <Label htmlFor="content" className="text-sm font-normal">
                      I understand that all my content, including profile, bookings, and messages will be deleted
                    </Label>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>Final verification</CardTitle>
                <CardDescription>For security, please enter your password to confirm account deletion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Final warning</AlertTitle>
                  <AlertDescription>
                    You are about to permanently delete your ETHR account. This action cannot be reversed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="password">Enter your password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your current password"
                    className="bg-ethr-black border-muted"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="border-muted text-muted-foreground hover:bg-ethr-black hover:text-white"
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                disabled={!canProceed}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!canProceed || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting Account...
                  </>
                ) : (
                  "Permanently Delete Account"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
