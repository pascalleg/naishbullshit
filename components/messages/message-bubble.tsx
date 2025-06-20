import { useState } from "react";
import { format } from "date-fns";
import { Trash2, MoreVertical } from "lucide-react";
import type { Message } from "@/lib/database/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onDelete?: () => void;
}

export function MessageBubble({ message, isOwnMessage, onDelete }: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (message.deleted_at) {
    return (
      <div
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div className="text-sm text-gray-500 italic">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div className="relative group">
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {message.attachments?.map((attachment) => (
            <div key={attachment.id} className="mb-2">
              {attachment.type === "image" ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="max-w-full rounded-lg"
                />
              ) : (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
                >
                  <span className="truncate">{attachment.name}</span>
                  <span className="text-xs">
                    ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                </a>
              )}
            </div>
          ))}
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
            <span>
              {format(new Date(message.created_at), "h:mm a")}
            </span>
            {isOwnMessage && (
              <span>
                {message.read_at ? "Read" : "Sent"}
              </span>
            )}
          </div>
        </div>
        {isOwnMessage && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
        {showMenu && isOwnMessage && (
          <div className="absolute top-8 right-2 bg-gray-800 rounded-lg shadow-lg py-1">
            <button
              onClick={() => {
                onDelete?.();
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 