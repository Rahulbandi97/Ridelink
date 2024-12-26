"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Ride } from "@/components/Types/RideType";

const UpdateRidePage = () => {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const rideId = params.rideId as string;

  // State for ride details
  const [ride, setRide] = useState<Ride | null>(null);

  // State for form inputs
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");

  // State for latitude and longitude of origin and destination
  const [originCoordinates, setOriginCoordinates] = useState<
    [number, number] | null
  >(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<
    [number, number] | null
  >(null);

  // State for form handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for autocomplete suggestions
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/rides?rideId=${rideId}`);
        const rideData = response.data;

        // Ensure the user is authorized to update the ride
        if (
          !rideData.passengers.some((passenger) => passenger.clerkId === userId)
        ) {
          setError("You are not authorized to update this ride.");
          return;
        }

        setRide(rideData);

        setOrigin(rideData.origin);
        setDestination(rideData.destination);
        setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16));

        setOriginCoordinates(rideData.startLocation.coordinates);
        setDestinationCoordinates(rideData.destinationLocation.coordinates);
      } catch (err) {
        setError("Failed to fetch ride details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (rideId && userId) {
      fetchRideDetails();
    }
  }, [rideId, userId]);

  const handleCancelRide = async () => {
    try {
      if (ride?.status !== "pending") {
        alert("You can only cancel rides with a pending status.");
        return;
      }

      const now = new Date();
      const rideStartTime = new Date(ride?.startTime);

      if (rideStartTime <= now) {
        alert("You can only cancel rides scheduled for future dates.");
        return;
      }

      setLoading(true);
      setError(null);

      const updatedPassengers =
        ride?.passengers.filter((passenger) => passenger.clerkId !== userId) ||
        [];
      await axios.patch(`/api/rides?rideId=${rideId}`, {
        ...ride,
        passengers: updatedPassengers,
      });

      setSuccessMessage("You have been removed from the ride successfully!");
      setTimeout(() => router.push("/passenger/dashboard"), 2000);
    } catch (err) {
      setError("Failed to cancel ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const selectedStartTime = new Date(startTime);

    if (selectedStartTime <= now) {
      alert("You can only set the start time to a future date.");
      return;
    }

    try {
      setLoading(true);

      const updatedRideData = { ...ride };
      if (origin !== ride?.origin) updatedRideData.origin = origin;
      if (destination !== ride?.destination)
        updatedRideData.destination = destination;
      if (startTime !== new Date(ride?.startTime).toISOString().slice(0, 16)) {
        updatedRideData.startTime = selectedStartTime.toISOString();
      }

      if (
        originCoordinates &&
        (ride?.startLocation.coordinates[0] !== originCoordinates[0] ||
          ride?.startLocation.coordinates[1] !== originCoordinates[1])
      ) {
        updatedRideData.startLocation = {
          type: "Point",
          coordinates: originCoordinates,
        };
      }

      if (
        destinationCoordinates &&
        (ride?.destinationLocation.coordinates[0] !==
          destinationCoordinates[0] ||
          ride?.destinationLocation.coordinates[1] !==
            destinationCoordinates[1])
      ) {
        updatedRideData.destinationLocation = {
          type: "Point",
          coordinates: destinationCoordinates,
        };
      }

      await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);

      setSuccessMessage("Ride updated successfully!");
      setTimeout(() => router.push("/passenger/dashboard"), 2000);
    } catch (err) {
      setError("Failed to update ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">Loading Ride Details...</h2>
        <p>Please wait while we fetch the ride information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push("/passenger/dashboard")}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  const handleBackToDashboard = () => {
    router.push("/passenger/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={handleBackToDashboard}
        className="text-yellow-500 hover:text-yellow-600 hover:border px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105 w-1/4"
      >
        Return to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Update Ride</h2>

      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleUpdateRide}
        className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <p className="text-yellow-500 font-semibold text-center mb-4">
          Current Status:{" "}
          <span
            className={`px-3 py-1 rounded text-sm font-bold capitalize ${
              ride?.status === "pending"
                ? "bg-yellow-500 text-black"
                : ride?.status === "active"
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {ride?.status}
          </span>
        </p>

        <div className="mb-4">
          <label htmlFor="origin" className="block text-gray-400 mb-2">
            Origin
          </label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-400 mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="startTime" className="block text-gray-400 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow"
          >
            Update Ride
          </button>
          <button
            type="button"
            onClick={handleCancelRide}
            className="hover:text-red-700 text-white px-4 py-2 rounded shadow"
          >
            Cancel Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRidePage;
