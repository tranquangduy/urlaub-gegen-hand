'use client';

import React from 'react';
import HostRequestsDashboard from '@/components/dashboard/host/HostRequestsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Placeholder container layout
const TempContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

const HostRequestsPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!user || !user.roles.includes('host'))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <TempContainer>
        <p>Loading dashboard...</p>
      </TempContainer>
    );
  }

  if (!user || !user.roles.includes('host')) {
    return (
      <TempContainer>
        <p>Access Denied. Redirecting...</p>
      </TempContainer>
    );
  }

  return (
    <TempContainer>
      <h1 className="text-3xl font-bold mb-6">Manage Booking Requests</h1>
      {user && <HostRequestsDashboard hostId={user.id} />}
    </TempContainer>
  );
};

export default HostRequestsPage;
