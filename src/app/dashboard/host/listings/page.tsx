'use client';

import React from 'react';
import HostListingsDashboard from '@/components/dashboard/host/HostListingsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Placeholder for Container if not defined elsewhere
const TempContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

const HostListingsPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Redirect if not loading and user is not a host
    if (!isLoading && (!user || !user.roles.includes('host'))) {
      // Redirect to login or home page
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    // TODO: Add dashboard skeleton loader
    return (
      <TempContainer>
        <p>Loading dashboard...</p>
      </TempContainer>
    );
  }

  if (!user || !user.roles.includes('host')) {
    // Should be redirected, but show message just in case
    return (
      <TempContainer>
        <p>Access Denied. Redirecting...</p>
      </TempContainer>
    );
  }

  return (
    <TempContainer>
      <h1 className="text-3xl font-bold mb-6">Manage Your Listings</h1>
      {user && <HostListingsDashboard hostId={user.id} />}
    </TempContainer>
  );
};

export default HostListingsPage;
