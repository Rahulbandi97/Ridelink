import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  photo: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ["User", "Rider", "Manager"],
    default: "User", // Default role is User
  },
  carpoolRequests: [{ type: Schema.Types.ObjectId, ref: "Carpool" }], // User's carpool requests
  ridesGiven: [{ type: Schema.Types.ObjectId, ref: "Ride" }], // Rides offered as a rider
});

const User = models.User || model("User", UserSchema);
export default User;
