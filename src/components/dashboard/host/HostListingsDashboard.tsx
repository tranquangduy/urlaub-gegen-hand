'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Listing } from '@/types';
import {
  getAll,
  update as updateListing,
  remove as removeListing,
} from '@/mocks/services';
import ListingsTable from './ListingsTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner'; // Assuming sonner for notifications
import StatsCard from '@/components/dashboard/common/StatsCard';
import { List, Eye, EyeOff } from 'lucide-react';

interface HostListingsDashboardProps {
  hostId: string;
}

const HostListingsDashboard: React.FC<HostListingsDashboardProps> = ({
  hostId,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      // Simulate async fetching
      setTimeout(() => {
        const allListings = getAll('listings');
        const hostListings = allListings.filter(
          (listing) => listing.hostId === hostId
        );
        // Ensure status exists, default to 'active' if missing in mock data
        const listingsWithStatus = hostListings.map((l) => ({
          ...l,
          status: l.status || 'active',
        }));
        setListings(listingsWithStatus);
        setLoading(false);
      }, 300); // Shorter delay for dashboard
    } catch (err) {
      console.error('Error fetching host listings:', err);
      setError('Failed to load listings.');
      toast.error('Failed to load listings.');
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleStatusChange = async (
    listingId: string,
    newStatus: 'active' | 'inactive'
  ) => {
    try {
      const updatedListing = updateListing('listings', listingId, {
        status: newStatus,
      });
      if (updatedListing) {
        setListings((prevListings) =>
          prevListings.map((l) =>
            l.id === listingId ? { ...l, status: newStatus } : l
          )
        );
        toast.success(
          `Listing ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
        );
      } else {
        throw new Error('Failed to update listing status.');
      }
    } catch (err) {
      console.error('Error updating listing status:', err);
      toast.error('Failed to update listing status.');
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      const success = removeListing('listings', listingId);
      if (success) {
        setListings((prevListings) =>
          prevListings.filter((l) => l.id !== listingId)
        );
        toast.success('Listing deleted successfully.');
      } else {
        throw new Error('Failed to delete listing.');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing.');
    }
  };

  // Compute dashboard summary stats
  const totalCount = listings.length;
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const inactiveCount = listings.filter((l) => l.status !== 'active').length;
  const activePercent =
    totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const inactivePercent =
    totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0;

  if (loading) {
    // TODO: Add listings table skeleton loader
    return <p>Loading listings...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Listings" value={totalCount} icon={<List />} />
        <StatsCard
          title="Active Listings"
          value={activeCount}
          icon={<Eye />}
          trend="up"
          trendValue={activePercent}
        />
        <StatsCard
          title="Inactive Listings"
          value={inactiveCount}
          icon={<EyeOff />}
          trend="down"
          trendValue={inactivePercent}
        />
      </div>
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/listings/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
          </Link>
        </Button>
      </div>
      <ListingsTable
        listings={listings}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HostListingsDashboard;
