'use client';

import React from 'react';
import { Listing } from '@/types';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from './EmptyState'; // Assuming EmptyState component exists

interface SearchResultsProps {
  listings: Listing[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <EmptyState
        title="No listings found"
        description="Try adjusting your search filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default SearchResults;
