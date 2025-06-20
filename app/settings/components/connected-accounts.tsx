"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export function ConnectedAccounts() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    apple: false,
    facebook: false,
    twitter: false,
    spotify: true,
    soundcloud: true,
    instagram: true,
  })

  const handleConnect = async (account: keyof typeof connectedAccounts) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setConnectedAccounts((prev) => ({
      ...prev,
      [account]: !prev[account],
    }))
    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Connected Accounts</h2>
        <p className="text-muted-foreground mb-6">
          Connect your ETHR account with other services for easier login and enhanced features.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Accounts</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Google</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.google ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.google
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("google")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.google ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.5 3.51 7.7 8.42 7.45c1.54-.08 2.58.74 3.47.74 1.15 0 1.67-.75 3.44-.75 2.02.05 3.25 1.16 3.96 2.42-3.89 2.25-3.24 7.27.76 8.67-.76 1.58-1.74 3.15-3 3.75ZM12.15 4.18c.76-.91.55-2.93-.84-3.93-.72 1.09-.5 2.85.84 3.93Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Apple</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.apple ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.apple
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("apple")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.apple ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Facebook</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.facebook ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.facebook
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("facebook")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.facebook ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Twitter</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.twitter ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.twitter
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("twitter")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.twitter ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Music Platforms</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Spotify</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.spotify ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.spotify
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("spotify")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.spotify ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FF5500] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19.7 8.8c-.4 0-.8.4-.8.8s.3.8.8.8.8-.3.8-.8-.4-.8-.8-.8zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-6.3 12.4c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7zm3.5-.7c0 1.9-1.5 3.4-3.5 3.4v-1.4c1.2 0 2.1-.9 2.1-2.1 0-1.2-.9-2.1-2.1-2.1v-1.4c2 .1 3.5 1.6 3.5 3.6zm3.5 0c0 3.9-3.1 7-7 7v-1.4c3.1 0 5.6-2.5 5.6-5.6 0-3.1-2.5-5.6-5.6-5.6V6.7c3.9 0 7 3.1 7 7zm3.5 0c0 5.8-4.7 10.5-10.5 10.5V22c4.6 0 8.4-3.8 8.4-8.4 0-4.6-3.8-8.4-8.4-8.4V3.9c5.8.1 10.5 4.7 10.5 10.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">SoundCloud</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.soundcloud ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.soundcloud
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("soundcloud")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.soundcloud ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-muted rounded-md bg-ethr-black">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#E4405F] flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.082c1.602 0 1.792.006 2.425.035 1.627.074 2.385.845 2.46 2.459.028.633.034.822.034 2.424s-.006 1.792-.034 2.424c-.075 1.613-.832 2.386-2.46 2.46-.633.028-.822.035-2.425.035-1.602 0-1.792-.006-2.424-.035-1.63-.075-2.385-.849-2.46-2.46-.028-.632-.035-.822-.035-2.424s.007-1.792.035-2.424c.074-1.615.832-2.386 2.46-2.46.632-.029.822-.034 2.424-.034zm0-1.082c-1.63 0-1.833.007-2.474.037-2.18.1-3.39 1.309-3.49 3.489-.029.641-.036.845-.036 2.474 0 1.63.007 1.834.036 2.474.1 2.179 1.31 3.39 3.49 3.49.641.029.844.036 2.474.036 1.63 0 1.834-.007 2.475-.036 2.176-.1 3.391-1.309 3.489-3.49.029-.64.036-.844.036-2.474 0-1.629-.007-1.833-.036-2.474-.098-2.177-1.309-3.39-3.489-3.489-.641-.03-.845-.037-2.475-.037zm0 2.919c-1.701 0-3.081 1.379-3.081 3.081s1.38 3.081 3.081 3.081 3.081-1.379 3.081-3.081c0-1.701-1.38-3.081-3.081-3.081zm0 5.081c-1.105 0-2-.895-2-2 0-1.104.895-2 2-2 1.104 0 2.001.895 2.001 2 0 1.105-.897 2-2.001 2zm3.202-5.922c-.397 0-.72.322-.72.72 0 .397.322.72.72.72.398 0 .721-.322.721-.72 0-.398-.322-.72-.721-.72z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Instagram</h4>
                  <p className="text-sm text-muted-foreground">
                    {connectedAccounts.instagram ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className={
                  connectedAccounts.instagram
                    ? "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    : "border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                }
                onClick={() => handleConnect("instagram")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectedAccounts.instagram ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
