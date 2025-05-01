'use client';

import React from 'react';
import { Conversation, Message } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConversationItemProps {
  conversation: Conversation;
  lastMessage?: Message;
  unreadCount?: number;
  onSelect: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  lastMessage,
  unreadCount = 0,
  onSelect,
}) => {
  return (
    <Card
      onClick={() => onSelect(conversation.id)}
      className="cursor-pointer hover:bg-accent/20 transition-colors"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Conversation {conversation.id}</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {lastMessage?.content.slice(0, 50) || 'No messages yet'}
        </p>
      </CardContent>
    </Card>
  );
};
