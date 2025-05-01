'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useMessaging } from '@/contexts/MessagingContext';

interface MessageThreadProps {
  conversationId: string;
  userId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversationId,
  userId,
}) => {
  const { messages, loadMessages } = useMessaging();
  const threadRef = useRef<HTMLDivElement>(null);

  // Load messages when conversation changes
  useEffect(() => {
    loadMessages(conversationId);
  }, [conversationId, loadMessages]);

  const msgs: Message[] = messages[conversationId] || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [msgs]);

  return (
    <div
      ref={threadRef}
      className="h-96 overflow-y-auto p-4 space-y-4 bg-background rounded-lg"
    >
      {msgs.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.senderId === userId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[60%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap text-sm
              ${
                msg.senderId === userId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
          >
            {msg.content}
            <div className="text-xs text-right mt-1 italic opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
