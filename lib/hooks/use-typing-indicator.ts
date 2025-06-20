import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useTypingIndicator(conversationId: string | undefined, userId: string | undefined) {
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!conversationId || !userId) return;

    // Subscribe to typing events
    const typingSubscription = supabase
      .channel(`typing:${conversationId}`)
      .on(
        "broadcast",
        { event: "typing" },
        ({ payload }) => {
          if (payload.userId !== userId) {
            setIsTyping((prev) => ({
              ...prev,
              [payload.userId]: payload.isTyping,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      typingSubscription.unsubscribe();
    };
  }, [conversationId, userId]);

  const setTypingStatus = (isTyping: boolean) => {
    if (!conversationId || !userId) return;

    supabase
      .channel(`typing:${conversationId}`)
      .send({
        type: "broadcast",
        event: "typing",
        payload: { userId, isTyping },
      });
  };

  return {
    isTyping,
    setTypingStatus,
  };
} 