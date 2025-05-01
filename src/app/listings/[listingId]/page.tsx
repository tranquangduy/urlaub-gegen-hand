'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { getById } from '@/mocks/services';
import { Listing, Profile } from '@/types';
import Link from 'next/link';
// import ListingDetailView from '@/components/listings/ListingDetailView';
// import { Container } from '@/components/ui/container';

// Placeholder for ListingDetailView until it's created
const ListingDetailView = ({
  listing,
  hostProfile,
}: {
  listing: Listing;
  hostProfile: Profile | null;
}) => (
  <div>
    <h1>{listing.title}</h1>
    <p>Details for listing {listing.id} will go here.</p>
    {hostProfile && <p>Hosted by: {hostProfile.firstName}</p>}
  </div>
);

// Placeholder for Container until its location is confirmed
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

const ListingDetailPage = () => {
  const params = useParams();
  const listingId = params.listingId as string;

  const [listing, setListing] = React.useState<Listing | null>(null);
  const [hostProfile, setHostProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (listingId) {
      setLoading(true);
      setError(null);
      try {
        // Simulate async fetching
        setTimeout(() => {
          const fetchedListing = getById('listings', listingId);
          if (fetchedListing) {
            setListing(fetchedListing);
            // Fetch host profile
            const fetchedProfile = getById('profiles', fetchedListing.hostId);
            setHostProfile(fetchedProfile);
          } else {
            setError('Listing not found.');
          }
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details.');
        setLoading(false);
      }
    }
  }, [listingId]);

  if (loading) {
    // TODO: Add a proper loading skeleton component
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="text-red-500">Error: {error}</p>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container>
        <p>Listing not found.</p>
      </Container>
    );
  }

  return (
    <Container>
      <ListingDetailView listing={listing} hostProfile={hostProfile} />
      <div className="mt-4">
        <Link
          href={`/bookings/new?listingId=${listing.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Request Booking
        </Link>
      </div>
    </Container>
  );
};

export default ListingDetailPage;
