'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import MessageInput from '@/components/messaging/MessageInput';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.conversationId;
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { user } = useAuth();
  const { conversations } = useMessaging();

  if (!conversationId || !user) {
    return <div>Loading...</div>;
  }

  const conversation = conversations.find((c) => c.id === conversationId);
  const conversationTitle = conversation
    ? `Conversation ${conversation.id.slice(0, 8)}`
    : 'Loading...';

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 border-r h-full">
        <ConversationList activeConversationId={conversationId} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col h-full">
        {/* Conversation header */}
        <div className="border-b p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => router.push('/messages')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold">{conversationTitle}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation?.participantIds.length} participants
            </p>
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-hidden">
          <MessageThread conversationId={conversationId} userId={user.id} />
        </div>

        {/* Message input */}
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
