// Component for booking a ride

// src/app/findRide/RideBooking.tsx

import React, { useState } from 'react';

const RideBooking = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleBooking = () => {
        alert(`Ride booked from ${pickupLocation} to ${dropoffLocation} on ${date} at ${time}`);
    };

    return (
        <div>
            <h2>Book Your Ride</h2>
            <input
                type="text"
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="Drop-off Location"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
            <button onClick={handleBooking}>Book Ride</button>
        </div>
    );
};

export default RideBooking;

