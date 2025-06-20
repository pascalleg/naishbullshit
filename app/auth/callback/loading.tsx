import { AuthLayout } from "@/app/(auth)/auth-layout";
import { Loader2 } from "lucide-react";

export default function CallbackLoading() {
  return (
    <AuthLayout
      title="Completing Sign In"
      description="Please wait while we complete your authentication"
    >
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-ethr-neonblue" />
        <p className="text-sm text-muted-foreground text-center">
          Redirecting you to your dashboard...
        </p>
      </div>
    </AuthLayout>
  );
} 