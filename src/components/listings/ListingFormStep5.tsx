'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Listing } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface ListingFormStep5Props {
  data: Partial<Listing>;
  updateData: (update: Partial<Listing>) => void;
  errors: { [key: string]: string };
}

export default function ListingFormStep5({
  data,
  updateData,
  errors,
}: ListingFormStep5Props) {
  // Use local state for date components to handle the Date object
  const [startDate, setStartDate] = useState<Date | undefined>(
    data.availabilityStartDate
      ? new Date(data.availabilityStartDate)
      : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    data.availabilityEndDate ? new Date(data.availabilityEndDate) : undefined
  );

  const handleDateChange = (
    field: 'availabilityStartDate' | 'availabilityEndDate',
    date: Date | undefined
  ) => {
    if (field === 'availabilityStartDate') {
      setStartDate(date);
      updateData({ availabilityStartDate: date });
      // If start date is cleared or moved after end date, clear end date
      if (!date || (endDate && date > endDate)) {
        setEndDate(undefined);
        updateData({ availabilityEndDate: undefined });
      }
    } else {
      setEndDate(date);
      updateData({ availabilityEndDate: date });
    }
    // Clear potential errors when date changes
    // TODO: Need a way to clear specific errors from the parent
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Availability</h2>
      <p className="text-sm text-muted-foreground">
        When is your place available for helpers?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date Picker */}
        <div className="space-y-2">
          <Label htmlFor="availabilityStartDate">Available From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, 'PPP')
                ) : (
                  <span>Pick a start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) =>
                  handleDateChange('availabilityStartDate', date)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.availabilityStartDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.availabilityStartDate}
            </p>
          )}
        </div>

        {/* End Date Picker */}
        <div className="space-y-2">
          <Label htmlFor="availabilityEndDate">Available Until</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
                disabled={!startDate} // Disable if start date not set
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, 'PPP')
                ) : (
                  <span>Pick an end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) =>
                  handleDateChange('availabilityEndDate', date)
                }
                disabled={(date) => (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.availabilityEndDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.availabilityEndDate}
            </p>
          )}
        </div>
      </div>

      {/* Optional: Add fields for specific unavailable dates or recurring patterns later */}
    </div>
  );
}
