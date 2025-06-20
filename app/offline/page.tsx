import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
          
          <h1 className="text-2xl font-semibold">
            You're Offline
          </h1>
          
          <p className="text-muted-foreground">
            Please check your internet connection and try again.
          </p>

          <Button
            onClick={handleRetry}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Some features may be limited while offline.</p>
            <p className="mt-1">
              Your data will sync when you're back online.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 