import { Schema, model, models } from "mongoose";

const RiderSchema = new Schema({
  clerkId: {
    type: String,
    ref: "User",
    required: true,
    index: true, // Optional: for fast lookups
  },
  vehicleDetails: {
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    licensePlate: { type: String },
  },
  availability: {
    type: [String], // Example: ['Monday', 'Wednesday']
  },
  ratings: {
    type: [Number], // Array to store ratings (e.g., [5, 4, 4])
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Trip"], // Added "On Trip" option
    default: "Inactive",
  },
  verified: {
    type: Boolean, // Changed to Boolean type
    default: false,
  },
});

const Rider = models.Rider || model("Rider", RiderSchema);
export default Rider;
