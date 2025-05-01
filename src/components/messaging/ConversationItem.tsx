'use client';

import React from 'react';
import { Conversation, Message } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItemProps {
  conversation: Conversation;
  lastMessage?: Message;
  unreadCount: number;
  onSelect: (id: string) => void;
  isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  lastMessage,
  unreadCount,
  onSelect,
  isActive = false,
}) => {
  // Format the conversation title (in a real app, this would use participant names)
  const conversationTitle = `Conversation ${conversation.id.slice(0, 8)}`;

  // Format the timestamp
  const timestamp = lastMessage?.createdAt
    ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
    : '';

  return (
    <Card
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'cursor-pointer transition-colors border-l-4',
        isActive
          ? 'bg-accent/30 border-l-primary'
          : 'hover:bg-accent/20 border-l-transparent',
        unreadCount > 0 && 'bg-accent/10'
      )}
    >
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="truncate">{conversationTitle}</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <p
          className={cn(
            'text-sm line-clamp-2',
            unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'
          )}
        >
          {lastMessage?.content || 'No messages yet'}
        </p>
      </CardContent>
      {timestamp && (
        <CardFooter className="py-2 text-xs text-muted-foreground">
          {timestamp}
        </CardFooter>
      )}
    </Card>
  );
};
