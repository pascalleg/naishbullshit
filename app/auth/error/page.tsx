"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AuthLayout } from "@/app/(auth)/auth-layout";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message") || "An error occurred during authentication";

  return (
    <AuthLayout
      title="Authentication Error"
      description="There was a problem with your authentication request"
    >
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>

      <div className="flex flex-col space-y-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Try Again</Link>
        </Button>
        <Button asChild className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </AuthLayout>
  );
} 