'use client';

import React from 'react';
import { MessagingProvider } from '@/contexts/MessagingContext';
import { ConversationList } from '@/components/messaging/ConversationList';

export default function MessagesPage() {
  return (
    <MessagingProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <ConversationList />
      </div>
    </MessagingProvider>
  );
}
