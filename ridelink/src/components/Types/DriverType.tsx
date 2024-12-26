interface VehicleDetails {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  }
  
  interface Driver {
    vehicleDetails: VehicleDetails;
    _id: string; // The unique identifier for the driver
    clerkId: string; // The clerk ID associated with the driver
    availability: string[]; // List of days the driver is available (e.g., "Monday", "Wednesday")
    ratings: number[]; // Array of ratings the driver has received
    averageRating: number; // Calculated average rating
    status: string; // Driver's status (e.g., "Active", "Inactive")
    verified: boolean; // Whether the driver's account is verified
    __v: number; // Version key (from MongoDB)
  }
  
  export default Driver;
  