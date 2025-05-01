'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Message } from '@/types';
import { useMessaging } from '@/contexts/MessagingContext';
import { Check, CheckCheck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageThreadProps {
  conversationId: string;
  userId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversationId,
  userId,
}) => {
  const { messages, loadMessages, markMessagesAsRead } = useMessaging();
  const threadRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Load messages when conversation changes
  useEffect(() => {
    loadMessages(conversationId);
  }, [conversationId, loadMessages]);

  const msgs: Message[] = messages[conversationId] || [];

  // Handle scroll events
  const handleScroll = () => {
    if (!threadRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = threadRef.current;
    const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };

  // Scroll to bottom on new messages if already at bottom
  useEffect(() => {
    if (isAtBottom && threadRef.current) {
      scrollToBottom();
    } else if (!isAtBottom && msgs.length > 0) {
      setShowScrollButton(true);
    }
  }, [msgs, isAtBottom]);

  // Group messages by date
  const groupedMessages = msgs.reduce<Record<string, Message[]>>(
    (groups, message) => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);
      return groups;
    },
    {}
  );

  // Mark messages as read when they're viewed
  useEffect(() => {
    if (msgs.length > 0) {
      const unreadMessageIds = msgs
        .filter((msg) => msg.receiverId === userId && !msg.readAt)
        .map((msg) => msg.id);

      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(conversationId, unreadMessageIds);
      }
    }
  }, [msgs, conversationId, userId, markMessagesAsRead]);

  return (
    <div className="relative h-full">
      <div
        ref={threadRef}
        className="h-full overflow-y-auto p-4 space-y-6 bg-background rounded-lg"
        onScroll={handleScroll}
      >
        {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
          <div key={dateKey} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
              </div>
            </div>

            {dayMessages.map((msg) => {
              const isSentByMe = msg.senderId === userId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isSentByMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={cn(
                      'max-w-[75%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap text-sm',
                      isSentByMe
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-muted-foreground rounded-bl-none'
                    )}
                  >
                    {msg.content}
                    <div className="flex items-center justify-end gap-1 text-xs mt-1 opacity-70">
                      <span>{format(new Date(msg.createdAt), 'h:mm a')}</span>
                      {isSentByMe &&
                        (msg.readAt ? (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Check className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {msgs.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
      </div>

      {showScrollButton && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
