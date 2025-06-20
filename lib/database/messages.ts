import { supabase } from "@/lib/supabase";
import type { Message, Conversation } from "./types/message";

export class MessageService {
  // Create a new conversation
  static async createConversation(participants: string[], metadata?: Conversation['metadata']) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participants,
        metadata: metadata || { type: 'direct' }
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all conversations for a user
  static async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages:messages(
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          read_at
        )
      `)
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Send a new message
  static async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get messages for a conversation
  static async getConversationMessages(conversationId: string, limit = 50, before?: string) {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, name, avatar_url),
        receiver:profiles!receiver_id(id, name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Mark messages as read
  static async markMessagesAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)
      .is('read_at', null);

    if (error) throw error;
  }

  // Update a message
  static async updateMessage(messageId: string, updates: Partial<Message>) {
    const { data, error } = await supabase
      .from('messages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        metadata: {
          ...updates.metadata,
          edited: true
        }
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a message (soft delete)
  static async deleteMessage(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({
        content: '',
        metadata: {
          deleted: true
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
  }

  // Get unread message count for a user
  static async getUnreadMessageCount(userId: string) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .is('read_at', null);

    if (error) throw error;
    return count || 0;
  }
} 