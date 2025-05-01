'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react'; // Or another relevant icon

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing found',
  description = "We couldn't find anything matching your criteria.", // Fixed apostrophe
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
};

export default EmptyState;
