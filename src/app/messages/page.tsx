'use client';

import React from 'react';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <ConversationList />
      </div>

      <div className="hidden md:flex md:flex-1 md:items-center md:justify-center border-l">
        <div className="text-center p-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Messages</h2>
          <p className="text-muted-foreground max-w-md">
            Select a conversation from the list to view messages or start a new
            conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
