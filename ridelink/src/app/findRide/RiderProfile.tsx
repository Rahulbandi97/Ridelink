//Component for displaying rider profile details

// src/app/findRide/RiderProfile.tsx

import React from 'react';

// Define a custom type for the user prop based on the fields being used
interface User {
  username?: string;
  email?: string;
  publicMetadata?: {
    role?: string;
  };
}

// Define the props for RiderProfile
interface RiderProfileProps {
  user: User | null;
}

const RiderProfile: React.FC<RiderProfileProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="rider-profile">
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.publicMetadata?.role || "Rider"}</p>
    </div>
  );
};

export default RiderProfile;

