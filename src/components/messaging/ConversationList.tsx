'use client';

import React, { useEffect } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { ConversationItem } from './ConversationItem';
import { useRouter } from 'next/navigation';

export const ConversationList: React.FC = () => {
  const router = useRouter();
  const { conversations, messages, loadConversations } = useMessaging();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelect = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  if (conversations.length === 0) {
    return <p>No conversations available.</p>;
  }

  return (
    <div className="space-y-4">
      {conversations.map((conv) => {
        const msgs = messages[conv.id] || [];
        const lastMessage = msgs[msgs.length - 1];
        const unreadCount = msgs.filter((m) => !m.readAt).length;
        return (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            lastMessage={lastMessage}
            unreadCount={unreadCount}
            onSelect={handleSelect}
          />
        );
      })}
    </div>
  );
};
