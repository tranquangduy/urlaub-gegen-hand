'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ReviewForm from '@/components/review/ReviewForm';
import { getBookingRequests } from '@/lib/bookingStorage';
import { getById } from '@/mocks/services';

const BookingReviewPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  if (isLoading) return <p>Loading...</p>;
  if (!user) {
    router.push('/');
    return null;
  }

  const request = getBookingRequests().find((r) => r.id === bookingId);
  if (!request) return <p className="text-red-500">Booking not found.</p>;

  const listing = getById('listings', request.listingId);
  if (!listing) return <p className="text-red-500">Listing not found.</p>;

  const isHelper = request.helperId === user.id;
  const isHost = listing.hostId === user.id;
  if (!isHelper && !isHost) {
    router.push('/');
    return null;
  }

  // Determine who is being reviewed
  const revieweeId = isHelper ? listing.hostId : request.helperId;

  return (
    <div className="container mx-auto p-4">
      <ReviewForm bookingId={bookingId} revieweeId={revieweeId} />
    </div>
  );
};

export default BookingReviewPage;
