import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const UpcomingStaysCalendar: React.FC = () => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Upcoming Stays</h2>
      <DayPicker
        mode="single"
        captionLayout="dropdown"
        // TODO: highlight booked dates
      />
    </div>
  );
};

export default UpcomingStaysCalendar;
