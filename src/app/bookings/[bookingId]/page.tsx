'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingRequests, updateBookingRequest } from '@/lib/bookingStorage';
import type { BookingRequest } from '@/types';
import { getById } from '@/mocks/services';
import { formatDate, getUserDisplayName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const BookingDetailPage: React.FC = () => {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [request, setRequest] = useState<BookingRequest | null>(null);

  useEffect(() => {
    const all = getBookingRequests();
    const found = all.find((req) => req.id === bookingId);
    setRequest(found || null);
  }, [bookingId]);

  if (isLoading) return <p>Loading...</p>;
  if (!user) {
    router.push('/');
    return null;
  }
  if (!request) {
    return <p className="text-red-500">Booking request not found.</p>;
  }

  const listing = getById('listings', request.listingId);
  const isHost = listing?.hostId === user.id;
  const isHelper = request.helperId === user.id;

  if (!isHost && !isHelper) {
    router.push('/');
    return null;
  }

  const helper = getById('users', request.helperId);
  const helperName = helper
    ? getUserDisplayName(helper.name || '', '', helper.name)
    : request.helperId;
  const listingTitle = listing?.title || request.listingId;

  const handleUpdate = (updates: Partial<BookingRequest>) => {
    const updated = updateBookingRequest(request.id, updates);
    if (updated) setRequest(updated);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p>
        <strong>Listing:</strong>{' '}
        <Link href={`/listings/${listing?.id}`}>{listingTitle}</Link>
      </p>
      <p>
        <strong>Helper:</strong> {helperName}
      </p>
      <p>
        <strong>Dates:</strong> {formatDate(new Date(request.startDate))} -{' '}
        {formatDate(new Date(request.endDate))}
      </p>
      <p>
        <strong>Purpose:</strong> {request.purpose}
      </p>
      {request.specialRequirements && (
        <p>
          <strong>Special Requirements:</strong> {request.specialRequirements}
        </p>
      )}
      <p>
        <strong>Status:</strong>{' '}
        <span className="capitalize">{request.status}</span>
      </p>
      {request.checkInAt && (
        <p>
          <strong>Checked In:</strong> {formatDate(new Date(request.checkInAt))}
        </p>
      )}
      {request.checkOutAt && (
        <p>
          <strong>Checked Out:</strong>{' '}
          {formatDate(new Date(request.checkOutAt))}
        </p>
      )}

      {isHost && (
        <div className="mt-4 space-x-2">
          {request.status === 'pending' && (
            <>
              <Button onClick={() => handleUpdate({ status: 'confirmed' })}>
                Confirm
              </Button>
              <Button onClick={() => handleUpdate({ status: 'cancelled' })}>
                Cancel
              </Button>
            </>
          )}
          {request.status === 'confirmed' && !request.checkInAt && (
            <Button
              onClick={() =>
                handleUpdate({ checkInAt: new Date().toISOString() })
              }
            >
              Check In
            </Button>
          )}
          {request.status === 'confirmed' &&
            request.checkInAt &&
            !request.checkOutAt && (
              <Button
                onClick={() =>
                  handleUpdate({
                    checkOutAt: new Date().toISOString(),
                    status: 'completed',
                  })
                }
              >
                Check Out
              </Button>
            )}
        </div>
      )}

      {isHelper && (
        <div className="mt-4">
          <Link
            href={`/messages/${request.id}`}
            className="text-blue-600 underline"
          >
            Message Host
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Button onClick={() => router.back()}>Back</Button>
      </div>
    </div>
  );
};

export default BookingDetailPage;
