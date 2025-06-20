import type React from "react"
import { Logo } from "@/components/logo"
import { OnboardingProgress } from "./components/onboarding-progress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Welcome to ETHR | Complete Your Profile",
  description: "Set up your ETHR profile to connect with the music industry",
}

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-ethr-black flex flex-col">
      <header className="border-b border-ethr-darkgray p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <span className="text-sm text-muted-foreground">Setting up your profile</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full px-4 py-8 flex flex-col flex-1">
          <OnboardingProgress />
          <div className="mt-8 flex-1 flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  )
}
