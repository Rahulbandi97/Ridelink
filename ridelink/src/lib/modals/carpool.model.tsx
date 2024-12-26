import { Schema, model, models } from "mongoose";

const CarpoolSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Matched", "Completed", "Cancelled"],
    default: "Pending",
  },
  rider: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rider", // Supports multiple riders if needed
    },
  ],
  fare: {
    type: Number,
  },
  estimatedStartTime: {
    type: Date,
  },
});

const Carpool = models.Carpool || model("Carpool", CarpoolSchema);
export default Carpool;
