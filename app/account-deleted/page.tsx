import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AccountDeletedPage() {
  return (
    <main className="min-h-screen bg-ethr-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Account Deleted</h1>

        <p className="text-muted-foreground">
          Your ETHR account has been permanently deleted. All your personal data and content have been removed from our
          systems.
        </p>

        <div className="pt-6">
          <p className="text-sm text-muted-foreground mb-6">
            We're sorry to see you go. Thank you for being part of the ETHR community.
          </p>

          <Link href="/">
            <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
