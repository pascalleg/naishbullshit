"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { ProfileSettings } from "./components/profile-settings"
import { AccountSettings } from "./components/account-settings"
import { NotificationSettings } from "./components/notification-settings"
import { SecuritySettings } from "./components/security-settings"
import { BillingSettings } from "./components/billing-settings"
import { ConnectedAccounts } from "./components/connected-accounts"
import { ArrowLeft, Bell, CreditCard, Lock, User, Wallet } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-ethr-darkgray"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        <Card className="bg-ethr-darkgray border-muted overflow-hidden">
          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col md:flex-row min-h-[600px]"
          >
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-muted">
              <TabsList className="h-auto p-0 bg-transparent flex flex-row md:flex-col w-full rounded-none">
                <TabsTrigger
                  value="profile"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <Wallet className="h-5 w-5" />
                  <span className="hidden md:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <Lock className="h-5 w-5" />
                  <span className="hidden md:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <Bell className="h-5 w-5" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="hidden md:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connected"
                  className="flex items-center justify-start gap-2 rounded-none border-b md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-ethr-neonblue data-[state=active]:bg-ethr-neonblue/5 px-4 py-3 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  <span className="hidden md:inline">Connected Accounts</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 p-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileSettings />
              </TabsContent>
              <TabsContent value="account" className="mt-0">
                <AccountSettings />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecuritySettings />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="billing" className="mt-0">
                <BillingSettings />
              </TabsContent>
              <TabsContent value="connected" className="mt-0">
                <ConnectedAccounts />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
