"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "../../../components/Types/RideType";
import RideCard from "../../../components/RideCard";
import { useAuth } from "@clerk/nextjs";
import SearchBar from "../../../components/SearchBar";

const ridesApiUrl = "/api/rides";

const AllRidesPage: React.FC = () => {
  const { userId } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all rides when the component mounts
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(ridesApiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }
        const data = await response.json();

        // Filter rides with status "pending"
        const pendingRides = data.filter((ride) => ride.status === "pending");

        setRides(data); // All rides
        setFilteredRides(pendingRides); // Only rides with status "pending"
      } catch (err) {
        setError("Error fetching rides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Show loading state or error if necessary
  if (loading) {
    return <p>Loading rides...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const clerkID = userId; // This is the Clerk User ID (clerkID)

  // Filter rides based on search term
  const handleSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setFilteredRides(rides);
    } else {
      const filtered = rides.filter(
        (ride) =>
          ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRides(filtered);
    }
  };

  const handleAddToRide = async (rideId: string) => {
    try {
      // Find the ride with the given ID
      const rideToUpdate = rides.find((ride) => ride.rideId === rideId);
      if (!rideToUpdate) {
        console.error(`Ride with ID ${rideId} not found`);
        return;
      }

      const updatedRide = {
        passengers: [...rideToUpdate.passengers, { clerkId: clerkID }],
        origin: rideToUpdate.origin,
        destination: rideToUpdate.destination,
      };

      const response = await fetch(`${ridesApiUrl}?rideId=${rideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRide),
      });

      if (!response.ok) {
        throw new Error("Failed to add to ride");
      }

      console.log("Successfully added user to ride");
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.rideId === rideId
            ? { ...ride, passengers: updatedRide.passengers }
            : ride
        )
      );
      alert("You are added to ride successfully");
      router.push("/passenger/dashboard");
    } catch (err) {
      console.error("Error adding user to ride:", err);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/passenger/dashboard");
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <button
        onClick={handleBackToDashboard}
        className="text-yellow-500 hover:text-yellow-600 hover:border place-self-center p-2 rounded-md mb-4"
      >
        Return to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Available Rides
      </h1>

      <div className="flex justify-center w-full mb-8">
        <div className="w-full max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <ul className="space-y-6 mt-8">
        {filteredRides.map((ride) => {
          const {
            destinationLocation,
            origin,
            destination,
            startTime,
            rideId,
            passengers,
          } = ride;

          // Ensure the destinationLocation and coordinates are valid
          if (!destinationLocation || !destinationLocation.coordinates) {
            console.warn(`Invalid destination data for ride ${rideId}`);
            return <p key={rideId}>Error: Invalid ride data</p>;
          }

          // Check if the current user is in the passengers list and the passenger count is less than 3
          const isValidForAdd =
            passengers.length < 3 &&
            !passengers.some((passenger) => passenger.clerkId === clerkID);

          if (!isValidForAdd) {
            return null; // Skip this ride if it doesn't meet the condition
          }

          return (
            <RideCard
              key={ride.rideId}
              ride={ride}
              handleAddToRide={handleAddToRide}
              addToRide={true}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AllRidesPage;
