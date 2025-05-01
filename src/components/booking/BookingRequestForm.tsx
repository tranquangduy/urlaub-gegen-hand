import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookingRequest, saveBookingRequest } from '@/lib/bookingStorage';
import { Button } from '@/components/ui/button';

const BookingRequestForm: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const listingId = params.get('listingId');
  const { user, isLoading } = useAuth();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [error, setError] = useState('');

  if (isLoading) return <p>Loading...</p>;
  if (!user || !user.roles.includes('helper')) {
    router.push('/');
    return null;
  }
  if (!listingId) {
    return (
      <p className="text-red-500">No listing selected for booking request.</p>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !purpose) {
      setError('Please fill in all required fields.');
      return;
    }
    const now = new Date().toISOString();
    const request: BookingRequest = {
      id: crypto.randomUUID(),
      listingId,
      helperId: user.id,
      startDate,
      endDate,
      purpose,
      specialRequirements: specialRequirements || undefined,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    saveBookingRequest(request);
    router.push(`/listings/${listingId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Booking</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block font-medium">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block font-medium">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block font-medium">
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="specialRequirements" className="block font-medium">
            Special Requirements
          </label>
          <textarea
            id="specialRequirements"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows={3}
          />
        </div>
        <Button type="submit">Submit Request</Button>
      </form>
    </div>
  );
};

export default BookingRequestForm;
