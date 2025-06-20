'use client'

import { useEffect, useRef } from 'react'
import { MessageWithAttachments } from '@/lib/database/types/message'
import { MessageBubble } from './message-bubble'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

interface MessageListProps {
  messages: MessageWithAttachments[]
  currentUserId: string
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export function MessageList({
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
  isLoading
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { ref: loadMoreRef, inView } = useInView()

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <button
              onClick={onLoadMore}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Load more messages
            </button>
          )}
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.sender_id === currentUserId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  )
} 