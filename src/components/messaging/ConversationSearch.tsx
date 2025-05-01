'use client';

import React, { useState, useEffect } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationSearchProps {
  onResultsChange: (hasResults: boolean) => void;
}

export const ConversationSearch: React.FC<ConversationSearchProps> = ({
  onResultsChange,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { searchConversations } = useMessaging();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search and notify parent of results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      onResultsChange(false);
      return;
    }

    const results = searchConversations(debouncedQuery);
    onResultsChange(results.length > 0);
  }, [debouncedQuery, onResultsChange, searchConversations]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations..."
          className="pl-8 pr-8"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {debouncedQuery && (
        <div className="mt-1 text-xs text-muted-foreground">
          {searchConversations(debouncedQuery).length} results found
        </div>
      )}
    </div>
  );
};
