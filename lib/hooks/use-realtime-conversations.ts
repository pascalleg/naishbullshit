import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Conversation } from "@/lib/database/types/message";

export type ConversationWithDetails = Conversation & {
  messages: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    read_at: string | null;
  }[];
  participants: {
    id: string;
    name: string;
    avatar_url?: string;
  }[];
};

export function useRealtimeConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch of conversations
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          messages:messages(
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            read_at
          ),
          participants:profiles!conversations_participants_fkey(
            id,
            name,
            avatar_url
          )
        `)
        .contains("participants", [userId])
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      setConversations(data || []);
    };

    fetchConversations();

    // Subscribe to new conversations
    const conversationsSubscription = supabase
      .channel(`user_conversations:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `participants=cs.{${userId}}`,
        },
        async (payload) => {
          // Fetch the complete conversation with messages and participants
          const { data: newConversation } = await supabase
            .from("conversations")
            .select(`
              *,
              messages:messages(
                id,
                content,
                created_at,
                sender_id,
                receiver_id,
                read_at
              ),
              participants:profiles!conversations_participants_fkey(
                id,
                name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (newConversation) {
            setConversations((current) => [
              newConversation as ConversationWithDetails,
              ...current,
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `participants=cs.{${userId}}`,
        },
        async (payload) => {
          // Fetch the updated conversation with messages and participants
          const { data: updatedConversation } = await supabase
            .from("conversations")
            .select(`
              *,
              messages:messages(
                id,
                content,
                created_at,
                sender_id,
                receiver_id,
                read_at
              ),
              participants:profiles!conversations_participants_fkey(
                id,
                name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (updatedConversation) {
            setConversations((current) =>
              current.map((conversation) =>
                conversation.id === updatedConversation.id
                  ? (updatedConversation as ConversationWithDetails)
                  : conversation
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
    };
  }, [userId]);

  return conversations;
} 