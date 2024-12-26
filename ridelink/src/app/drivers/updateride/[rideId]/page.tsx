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

  const [ride, setRide] = useState<Ride | null>(null);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/rides?rideId=${rideId}`);
        const rideData = response.data;

        if (rideData.rider !== userId) {
          setError("You are not authorized to update this ride.");
          return;
        }

        setRide(rideData);
        setOrigin(rideData.origin);
        setDestination(rideData.destination);
        setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16));
        setStatus(rideData.status || "pending");
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

  const handleUpdateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedRideData = {
        ...ride,
        origin,
        destination,
        startTime: new Date(startTime).toISOString(),
        status,
      };

      await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);
      setSuccessMessage("Ride updated successfully!");

      setTimeout(() => {
        router.push("/drivers/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to update ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/drivers/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl font-bold">Loading ride details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <button
          onClick={handleBackToDashboard}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <button
        onClick={handleBackToDashboard}
        className="text-yellow-500 hover:text-yellow-600 hover:border px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105 w-1/4"
      >
        Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Update Ride</h2>
      <div className="w-full max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleUpdateRide} className="space-y-6">
          <div>
            <label htmlFor="origin" className="block text-gray-300 mb-2">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-gray-300 mb-2">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-gray-300 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Update Ride
            </button>
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="hover:text-red-700 text-white px-4 py-2 rounded shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRidePage;
