//Component for fare estimation

// src/app/findRide/FareEstimator.tsx

import React, { useState } from 'react';

const FareEstimator = () => {
  // Set initial state to `null` or `string` type
  const [fare, setFare] = useState<string | null>(null);

  const calculateFare = () => {
    const estimatedFare = Math.random() * 20 + 5; // Mock fare calculation
    setFare(estimatedFare.toFixed(2));
  };

  return (
    <div className="mt-6">
      <button
        onClick={calculateFare}
        className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition"
      >
        Estimate Fare
      </button>
      {fare && (
        <p className="text-center mt-4 text-lg font-semibold text-gray-700">
          Estimated Fare: ${fare}
        </p>
      )}
    </div>
  );
};

export default FareEstimator;



