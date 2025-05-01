'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import MessageInput from '@/components/messaging/MessageInput';

export default function ConversationPage() {
  const params = useParams();
  const rawId = params.conversationId;
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { user } = useAuth();
  if (!conversationId || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r h-full overflow-y-auto p-4">
        <ConversationList />
      </div>
      <div className="flex flex-1 flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          <MessageThread conversationId={conversationId} userId={user.id} />
        </div>
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
