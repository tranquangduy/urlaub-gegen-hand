'use client';

import React from 'react';
import BookingRequestForm from '@/components/booking/BookingRequestForm';

const NewBookingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <BookingRequestForm />
    </div>
  );
};

export default NewBookingPage;
