import { Conversation } from "@/lib/database/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: (Conversation & {
    messages: {
      id: string;
      content: string;
      created_at: string;
      sender_id: string;
      receiver_id: string;
      read_at: string | null;
    }[];
  })[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[0];
        const otherParticipant = conversation.participants.find(
          (p) => p.id !== currentUserId
        );
        const unreadCount = conversation.messages.filter(
          (m) => m.receiver_id === currentUserId && !m.read_at
        ).length;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-ethr-black/50",
              selectedConversationId === conversation.id && "bg-ethr-black"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={otherParticipant?.avatar_url}
                alt={otherParticipant?.name || "User"}
              />
              <AvatarFallback>
                {otherParticipant?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium truncate">
                  {otherParticipant?.name || "Unknown User"}
                </h4>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lastMessage.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground truncate">
                {lastMessage?.content || "No messages yet"}
              </p>

              {unreadCount > 0 && (
                <Badge className="mt-1 bg-ethr-neonblue text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}