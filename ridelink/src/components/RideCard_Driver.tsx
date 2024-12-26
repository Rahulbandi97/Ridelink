"use client";

import React from "react";
import { Ride } from "./Types/RideType";

// API key for GeoAPI
const apiKey = "5312629079c24b608f9ca2bcaa5fce0b";

interface RideCardProps {
  ride: Ride;
  handleAddToRide?: (rideId: string) => void;
  addToRide?: Boolean;
  onUpdateRide?: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  handleAddToRide,
  addToRide,
  onUpdateRide,
}) => {
  const { startLocation, destinationLocation, rideId, status } = ride;

  if (
    !startLocation ||
    !startLocation.coordinates ||
    !destinationLocation ||
    !destinationLocation.coordinates
  ) {
    return <p>Error: Invalid ride data</p>;
  }

  const [originLongitude, originLatitude] = startLocation.coordinates;
  const [destinationLongitude, destinationLatitude] =
    destinationLocation.coordinates;

  // Calculate the bounding box (bbox) for origin and destination
  const minLongitude = Math.min(originLongitude, destinationLongitude);
  const minLatitude = Math.min(originLatitude, destinationLatitude);
  const maxLongitude = Math.max(originLongitude, destinationLongitude);
  const maxLatitude = Math.max(originLatitude, destinationLatitude);

  // Construct Geoapify URL with bbox
  const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&bbox=${minLongitude},${minLatitude},${maxLongitude},${maxLatitude}&apiKey=${apiKey}&path=color:blue|weight:3|opacity:0.8|${originLongitude},${originLatitude}|${destinationLongitude},${destinationLatitude}&marker=lonlat:${originLongitude},${originLatitude};type:awesome;color:green|lonlat:${destinationLongitude},${destinationLatitude};type:awesome;color:red`;

  return (
    <li className="p-6 border border-gray-700 rounded-lg bg-gray-900 shadow-lg flex flex-col md:flex-row gap-6 transition-transform transform hover:scale-105 duration-300">
      {/* Map on the left side */}
      <div className="w-full md:w-1/2 relative">
        <img
          src={geoApiUrl}
          alt="Ride Location Map"
          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-md shadow-md">
          Map Preview
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div>
          <p className="text-yellow-500 text-sm font-bold uppercase">
            Ride Details
          </p>
          <p className="mt-2 text-white text-base md:text-lg">
            <strong className="text-gray-400">Origin:</strong> {ride.origin}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Destination:</strong>{" "}
            {ride.destination}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Start Time:</strong>{" "}
            {new Date(ride.startTime).toLocaleString()}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Passengers:</strong>{" "}
            {ride.passengers ? ride.passengers.length : 0}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Fare:</strong> $
            {ride.fare ? ride.fare : 0}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-sm font-bold ${
                status === "pending"
                  ? "bg-yellow-500 text-black"
                  : status === "active"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>
        </div>

        <div className="flex space-x-4 mt-4">
          {addToRide && (
            <button
              onClick={() => handleAddToRide(rideId)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex-1"
            >
              Add me to Ride
            </button>
          )}

          {onUpdateRide && (
            <button
              onClick={() => {
                const now = new Date();
                const rideStartTime = new Date(ride.startTime);

                if (rideStartTime > now) {
                  alert("You cannot update rides scheduled for the future.");
                  return;
                }

                onUpdateRide(rideId);
              }}
              disabled={status === "completed"} // Disable if the status is completed
              className={`${
                status === "completed" || new Date(ride.startTime) > new Date()
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform ${
                status !== "completed" && new Date(ride.startTime) <= new Date()
                  ? "hover:scale-105"
                  : ""
              } flex-1`}
            >
              Update Ride
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default RideCard;
