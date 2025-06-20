"use client"

import { useState } from "react"
import { StepNavigation } from "../components/step-navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Check } from "lucide-react"

export default function OnboardingConnections() {
  const [searchQuery, setSearchQuery] = useState("")
  const [connected, setConnected] = useState<number[]>([])

  // Mock suggested connections
  const suggestedConnections = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Venue Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Jamie Chen",
      role: "Event Promoter",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Sam Taylor",
      role: "Sound Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Jordan Lee",
      role: "DJ / Producer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Casey Morgan",
      role: "Lighting Designer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const toggleConnection = (id: number) => {
    if (connected.includes(id)) {
      setConnected(connected.filter((connId) => connId !== id))
    } else {
      setConnected([...connected, id])
    }
  }

  const filteredConnections = searchQuery
    ? suggestedConnections.filter(
        (conn) =>
          conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conn.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : suggestedConnections

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Grow your network</h1>
        <p className="text-muted-foreground">Connect with industry professionals to expand your opportunities</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for people by name or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-ethr-black border-muted"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Suggested connections</h2>

          {filteredConnections.length > 0 ? (
            <div className="space-y-3">
              {filteredConnections.map((connection) => {
                const isConnected = connected.includes(connection.id)

                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-ethr-black/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                        <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="font-medium">{connection.name}</p>
                        <p className="text-sm text-muted-foreground">{connection.role}</p>
                      </div>
                    </div>

                    <Button
                      variant={isConnected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleConnection(connection.id)}
                      className={
                        isConnected
                          ? "bg-ethr-neonblue hover:bg-ethr-neonblue/90"
                          : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                      }
                    >
                      {isConnected ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Connected
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" /> Connect
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <StepNavigation prevStep="portfolio" nextStep="complete" />
    </div>
  )
}
