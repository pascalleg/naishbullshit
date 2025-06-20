import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { MessageService } from "@/lib/database/messages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";

interface NewConversationDialogProps {
  onConversationCreated: () => void;
}

export function NewConversationDialog({
  onConversationCreated,
}: NewConversationDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !email.trim()) return;

    setIsLoading(true);
    try {
      // First, get the user's profile by email
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim())
        .single();

      if (!profile) {
        throw new Error("User not found");
      }

      // Create a new conversation
      await MessageService.createConversation([user.id, profile.id]);

      toast({
        title: "Success",
        description: "Conversation created successfully",
      });

      setIsOpen(false);
      onConversationCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
          <User className="mr-2 h-4 w-4" /> New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Start a new conversation by entering the email address of the person you want to message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!email.trim() || isLoading}
              className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            >
              Start Conversation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 