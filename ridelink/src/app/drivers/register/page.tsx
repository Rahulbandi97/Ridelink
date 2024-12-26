"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterRider = () => {
  const { userId } = useAuth();
  const router = useRouter();

  // Form state
  const [vehicleDetails, setVehicleDetails] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
  });
  const [availability, setAvailability] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicleDetails({ ...vehicleDetails, [name]: value });
  };

  const handleCheckboxChange = (day: string) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter((d) => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }
    
    if (!vehicleDetails.make || !vehicleDetails.model || !vehicleDetails.year || !vehicleDetails.licensePlate) {
      setError("All vehicle details are required.");
      return;
    }
    
    if (availability.length === 0) {
      setError("Please select at least one day of availability.");
      return;
    }
  
    // Calculate average rating from the ratings array
    const ratings = [5, 4, 4]; // You may want to dynamically set this based on user input
    const averageRating = ratings.length ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 0;
  
    const requestData = {
      clerkId: userId,
      vehicleDetails,
      availability,
      ratings, // Include the ratings array
      averageRating, // Add the calculated average rating
      status: "Active", // You can hardcode this if it's not allowed to be set by the user
      verified: true, // Also hardcoded as per your requirement
    };
    
    console.log("Request Data:", requestData); // Log the request being sent
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/rider", requestData);
    
      console.log("Response:", response); // Log the response from the API
    
      if (response.status === 201) {
        router.push("/drivers/dashboard"); // Redirect to dashboard upon success
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err); // Log the error
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register as Rider</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Vehicle Details */}
          <div className="mb-4">
            <label className="block text-gray-700">Make</label>
            <input
              type="text"
              name="make"
              value={vehicleDetails.make}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Toyota"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={vehicleDetails.model}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Corolla"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={vehicleDetails.year}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 2021"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">License Plate</label>
            <input
              type="text"
              name="licensePlate"
              value={vehicleDetails.licensePlate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., XYZ123"
              required
            />
          </div>

          {/* Availability */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Availability</label>
            <div className="flex flex-wrap gap-2">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={availability.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterRider;
