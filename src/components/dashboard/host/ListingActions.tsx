'use client';

import React from 'react';
import { Listing } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

interface ListingActionsProps {
  listing: Listing;
  onStatusChange: (listingId: string, newStatus: 'active' | 'inactive') => void;
  onDelete: (listingId: string) => void;
}

const ListingActions: React.FC<ListingActionsProps> = ({
  listing,
  onStatusChange,
  onDelete,
}) => {
  const { id, status } = listing;
  const isChecked = status === 'active';

  const handleToggle = () => {
    const newStatus = isChecked ? 'inactive' : 'active';
    onStatusChange(id, newStatus);
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {/* Status Toggle with Confirmation */}
      <div className="flex items-center space-x-2">
        <Switch
          id={`status-switch-${id}`}
          checked={isChecked}
          onCheckedChange={handleToggle} // Direct toggle for simplicity, confirm on delete
          aria-label={isChecked ? 'Deactivate Listing' : 'Activate Listing'}
        />
        <Label
          htmlFor={`status-switch-${id}`}
          className="text-xs text-muted-foreground"
        >
          {isChecked ? 'Active' : 'Inactive'}
        </Label>
      </div>

      {/* View Button */}
      <Button variant="outline" size="icon" asChild>
        <Link href={`/listings/${id}`} title="View Listing">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      {/* Edit Button */}
      <Button variant="outline" size="icon" asChild>
        {/* TODO: Update href when edit route/logic is finalized */}
        <Link href={`/listings/edit/${id}`} title="Edit Listing">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      {/* Delete Button with Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" title="Delete Listing">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              listing &quot;{listing.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingActions;
