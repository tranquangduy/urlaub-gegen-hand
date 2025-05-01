'use client';

import React, { useEffect, useState } from 'react';
import { getBookingRequests, BookingRequest } from '@/lib/bookingStorage';
import { getById } from '@/mocks/services';
import { getUserDisplayName } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import StatsCard from '@/components/dashboard/common/StatsCard';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface HostRequestsDashboardProps {
  hostId: string;
}

const HostRequestsDashboard: React.FC<HostRequestsDashboardProps> = ({
  hostId,
}) => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute dashboard summary stats
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const confirmedCount = requests.filter(
    (r) => r.status === 'confirmed'
  ).length;
  const cancelledCount = requests.filter(
    (r) => r.status === 'cancelled'
  ).length;

  useEffect(() => {
    const all = getBookingRequests();
    const hostReqs = all.filter((req) => {
      const listing = getById('listings', req.listingId);
      return listing?.hostId === hostId;
    });
    setRequests(hostReqs);
  }, [hostId]);

  const filtered = requests.filter(
    (req) => statusFilter === 'all' || req.status === statusFilter
  );

  if (!requests.length) {
    return <p>No booking requests at this time.</p>;
  }

  return (
    <>
      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Requests" value={totalCount} icon={<Users />} />
        <StatsCard
          title="Pending Requests"
          value={pendingCount}
          icon={<Clock />}
        />
        <StatsCard
          title="Confirmed Requests"
          value={confirmedCount}
          icon={<CheckCircle />}
        />
        <StatsCard
          title="Cancelled Requests"
          value={cancelledCount}
          icon={<XCircle />}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Booking Requests</h2>
          <div>
            <label className="mr-2">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="issue_reported">Issue Reported</option>
            </select>
          </div>
        </div>
        <table className="min-w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Helper</th>
              <th className="px-4 py-2 text-left">Listing</th>
              <th className="px-4 py-2 text-left">Dates</th>
              <th className="px-4 py-2 text-left">Purpose</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => {
              const helper = getById('users', req.helperId);
              const listing = getById('listings', req.listingId);
              const helperName = helper
                ? getUserDisplayName(helper.name || '', '', helper.name)
                : req.helperId;
              const listingTitle = listing?.title || req.listingId;
              return (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">{helperName}</td>
                  <td className="px-4 py-2">
                    <Link href={`/listings/${req.listingId}`}>
                      {listingTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(new Date(req.startDate))} -{' '}
                    {formatDate(new Date(req.endDate))}
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate">{req.purpose}</td>
                  <td className="px-4 py-2 capitalize">{req.status}</td>
                  <td className="px-4 py-2">
                    {req.status === 'completed' ? (
                      <Link
                        href={`/bookings/${req.id}/review`}
                        className="text-blue-600 underline"
                      >
                        Leave Review
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HostRequestsDashboard;
