'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { ConversationItem } from './ConversationItem';
import { ConversationSearch } from './ConversationSearch';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationListProps {
  activeConversationId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  activeConversationId,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    conversations,
    messages,
    unreadCounts,
    loadConversations,
    searchConversations,
    isLoading,
  } = useMessaging();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearchResults, setHasSearchResults] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelect = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return searchConversations(searchQuery);
  }, [searchQuery, conversations, searchConversations]);

  // Group conversations by unread status
  const unreadConversations = useMemo(() => {
    return filteredConversations.filter(
      (conv) => (unreadCounts[conv.id] || 0) > 0
    );
  }, [filteredConversations, unreadCounts]);

  const renderConversationList = (convs: Conversation[]) => {
    if (convs.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-4">
          No conversations found.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {convs.map((conv) => {
          const msgs = messages[conv.id] || [];
          const lastMessage = msgs[msgs.length - 1];
          const unreadCount = unreadCounts[conv.id] || 0;

          return (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              lastMessage={lastMessage}
              unreadCount={unreadCount}
              onSelect={handleSelect}
              isActive={conv.id === activeConversationId}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <p className="text-center py-4">Loading conversations...</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <ConversationSearch
          onResultsChange={(hasResults) => {
            setHasSearchResults(hasResults);
            if (hasResults) {
              setSearchQuery(searchQuery);
            }
          }}
        />
      </div>

      {hasSearchResults ? (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="font-medium mb-3">Search Results</h3>
          {renderConversationList(filteredConversations)}
        </div>
      ) : (
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <div className="px-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="flex-1"
                disabled={unreadConversations.length === 0}
              >
                Unread{' '}
                {unreadConversations.length > 0 &&
                  `(${unreadConversations.length})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="all"
            className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
          >
            {renderConversationList(conversations)}
          </TabsContent>

          <TabsContent
            value="unread"
            className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
          >
            {renderConversationList(unreadConversations)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
