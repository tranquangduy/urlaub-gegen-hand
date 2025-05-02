'use client';

import React from 'react';
import { Listing } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ListingActions from './ListingActions'; // Component for action buttons/toggles

interface ListingsTableProps {
  listings: Listing[];
  onStatusChange: (listingId: string, newStatus: 'active' | 'inactive') => void;
  onDelete: (listingId: string) => void;
  // onEdit will likely be handled by a button within ListingActions linking to the edit page
}

const ListingsTable: React.FC<ListingsTableProps> = ({
  listings,
  onStatusChange,
  onDelete,
}) => {
  if (listings.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        You haven&apos;t created any listings yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            {/* <TableHead>Views</TableHead> */}{' '}
            {/* Placeholder for future analytics */}
            {/* <TableHead>Applications</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    listing.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {listing.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(listing.createdAt), 'PP')}</TableCell>
              {/* <TableCell>0</TableCell> */}
              {/* <TableCell>0</TableCell> */}
              <TableCell className="text-right">
                <ListingActions
                  listing={listing}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListingsTable;
