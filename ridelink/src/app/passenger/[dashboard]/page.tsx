"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import RideCard from "@/components/RideCard_Rider";
import { Ride } from "@/components/Types/RideType";

const PassengerDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const fetchRides = async () => {
    if (!userId) {
      router.push("/sign-in"); // Redirecting to the login page
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/rides?passengerId=${userId}`);

      if (Array.isArray(response.data) && response.data.length === 0) {
        setError("No rides found for this passenger.");
        setRides([]);
      } else {
        setRides(response.data);
        setError(null);
      }
    } catch (error) {
      setError("Error fetching rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [userId]);

  const handleFindRides = () => {
    router.push("/rides/findrides"); // Navigate to the find rides page
  };

  const handleRequestRide = () => {
    router.push("/rides/requestride"); // Navigate to the request ride page
  };

  if (loading) {
    return (
      <div className="p-6 bg-black text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Passenger Dashboard</h2>
        <p className="text-lg">Loading rides...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col gap-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Passenger Dashboard
      </h2>
      {rides.length === 0 ? (
        <div className="text-center text-lg mt-8">
          <p>
            Didn't book a ride with{" "}
            <span className="text-yellow-500 font-bold">RideLink</span> yet? You
            can do it now!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
            {["Find Rides", "Request Ride"].map((label, index) => (
              <button
                key={label}
                onClick={index === 0 ? handleFindRides : handleRequestRide}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
            {["Find Rides", "Request Ride"].map((label, index) => (
              <button
                key={label}
                onClick={index === 0 ? handleFindRides : handleRequestRide}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105"
              >
                {label}
              </button>
            ))}
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-center">
            Your Rides
          </h2>
          <ul className="space-y-6">
            {rides.map((ride) => (
              <RideCard key={ride.rideId} ride={ride} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PassengerDashboard;
