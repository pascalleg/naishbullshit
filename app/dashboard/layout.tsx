"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Bell,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Inbox,
  LogOut,
  MessageSquare,
  Music,
  Search,
  Settings,
  Users,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const dashboardLinks = [
    { icon: Inbox, label: "Bookings", href: "/dashboard/bookings", badge: "3" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: "5" },
    { icon: FileText, label: "Contracts", href: "/dashboard/contracts" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
    { icon: Music, label: "My Portfolio", href: "/dashboard/portfolio" },
    { icon: Users, label: "Network", href: "/dashboard/network" },
  ]

  return (
    <div className="flex min-h-screen bg-ethr-black">
      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-72"
        } bg-ethr-darkgray/80 backdrop-blur-lg border-r border-muted/20 transition-all duration-500 flex flex-col fixed h-full z-30`}
      >
        <div className="p-6 flex items-center justify-between border-b border-muted/20">
          {!collapsed && <Logo />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-ethr-neonblue"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-90" : "rotate-270"}`}
            />
          </Button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="space-y-1 px-3">
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                pathname === "/dashboard"
                  ? "bg-gradient-to-r from-ethr-neonblue/10 to-ethr-neonpurple/10 text-white"
                  : "text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
              }`}
            >
              <Home
                className={`${collapsed ? "mr-0" : "mr-4"} h-5 w-5 ${
                  pathname === "/dashboard" ? "text-ethr-neonblue" : ""
                }`}
              />
              {!collapsed && <span className="flex-1">Home</span>}
            </Link>

            <div className={!collapsed ? "border-t border-muted/20 my-4" : "my-4"} />

            {dashboardLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  item.href === pathname
                    ? "bg-gradient-to-r from-ethr-neonblue/10 to-ethr-neonpurple/10 text-white"
                    : "text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
                }`}
              >
                <item.icon
                  className={`${collapsed ? "mr-0" : "mr-4"} h-5 w-5 ${
                    item.href === pathname ? "text-ethr-neonblue" : ""
                  }`}
                />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.badge && (
                  <Badge
                    variant="outline"
                    className="ml-auto bg-ethr-neonblue/10 text-ethr-neonblue border-ethr-neonblue/20"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-muted/20">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 ring-2 ring-ethr-neonblue/20">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>DJ</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">DJ Synapse</p>
                <p className="text-xs text-muted-foreground">Artist</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? "ml-20" : "ml-72"} transition-all duration-500`}>
        {/* Header */}
        <header className="bg-ethr-darkgray/80 backdrop-blur-lg border-b border-muted/20 sticky top-0 z-20">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Suspense>
                <h1 className="text-xl font-semibold capitalize">
                  {pathname === "/dashboard" ? "Dashboard" : pathname.split("/").pop()?.replace(/-/g, " ")}
                </h1>
              </Suspense>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-12 bg-ethr-black/50 border-transparent focus:border-ethr-neonblue rounded-full w-64"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-ethr-neonblue"></span>
              </Button>

              <Link href="/">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
