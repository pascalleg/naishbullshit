import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/lib/database/types/message";

type MessageWithProfiles = Message & {
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar_url?: string;
  };
};

export function useRealtimeMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    // Initial fetch of messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!sender_id(id, name, avatar_url),
          receiver:profiles!receiver_id(id, name, avatar_url)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender and receiver info
          const { data: newMessage } = await supabase
            .from("messages")
            .select(`
              *,
              sender:profiles!sender_id(id, name, avatar_url),
              receiver:profiles!receiver_id(id, name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (newMessage) {
            setMessages((current) => [...current, newMessage as MessageWithProfiles]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the updated message with sender and receiver info
          const { data: updatedMessage } = await supabase
            .from("messages")
            .select(`
              *,
              sender:profiles!sender_id(id, name, avatar_url),
              receiver:profiles!receiver_id(id, name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (updatedMessage) {
            setMessages((current) =>
              current.map((message) =>
                message.id === updatedMessage.id ? (updatedMessage as MessageWithProfiles) : message
              )
            );
          }
        }
      )
      .subscribe();

    // Subscribe to conversation updates
    const conversationSubscription = supabase
      .channel(`conversations:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          // Handle conversation updates (e.g., last_message_id changes)
          console.log("Conversation updated:", payload);
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      conversationSubscription.unsubscribe();
    };
  }, [conversationId]);

  return messages;
} 