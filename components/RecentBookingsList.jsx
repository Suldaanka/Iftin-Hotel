import React from 'react';

const RecentBookingsList = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <ul className="space-y-4">
        {/* Example booking item */}
        <li className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Booking ID: #12345</p>
          <p>Room Type: Double Room</p>
          <p>Check-in: 2023-10-26</p>
          <p>Check-out: 2023-10-28</p>
          <p>Status: Confirmed</p>
        </li>
        <li className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Booking ID: #12346</p>
          <p>Room Type: Single Room</p>
          <p>Check-in: 2023-11-01</p>
          <p>Check-out: 2023-11-03</p>
          <p>Status: Pending</p>
        </li>
      </ul>
    </div>
  );
};

export default RecentBookingsList;