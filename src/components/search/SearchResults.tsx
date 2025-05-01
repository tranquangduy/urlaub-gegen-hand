'use client';

import React from 'react';
import { Listing } from '@/types';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from './EmptyState'; // Assuming EmptyState component exists
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

interface SearchResultsProps {
  listings: Listing[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  listings,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (listings.length === 0) {
    return (
      <EmptyState
        title="No listings found"
        description="Try adjusting your search filters."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default SearchResults;
