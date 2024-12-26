// import { Schema, model, models } from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const RideSchema = new Schema({
//   rideId: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     required: true,
//   },
//   createdBy: {
//     type: String,
//     enum: ["rider", "passenger"],
//     required: true,
//   },
//   rider: {
//     type: String, // Changed from nested object to simple string
//     ref: "Rider",
//     required: function() {
//       return this.createdBy === "rider";
//     },
//   },
//   passengers: [
//     {
//       clerkId: {
//         type: String,
//         ref: "User",
//         required: true,
//       },
//       fare: {
//         type: Number,
//         default: 0,
//       },
//       pickupLocation: {
//         type: String,
//         required: true,
//       },
//       dropoffLocation: {
//         type: String,
//         required: true,
//       },
//       pickupCoordinates: {
//         type: [Number],
//         required: true,
//         validate: [arrayOfLatLon, "Invalid latitude or longitude"], // Custom validation (see below)
//       },
//       dropoffCoordinates: {
//         type: [Number],
//         required: true,
//         validate: [arrayOfLatLon, "Invalid latitude or longitude"],
//       },
//     },
//   ],
//   startTime: {
//     type: Date,
//     required: true,
//   },
//   endTime: Date,
//   origin: {
//     type: String,
//     required: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//   },
//   fare: {
//     type: Number,
//     default: 0,
//   },
//   startLocation: {
//     type: { type: String, enum: ["Point"], required: true },
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//   },
//   destinationLocation: {
//     type: { type: String, enum: ["Point"], required: true },
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//   },
// });

// // GeoJSON Validation Function
// function arrayOfLatLon(val) {
//   return (
//     Array.isArray(val) &&
//     val.length === 2 &&
//     val[0] >= -180 && val[0] <= 180 && // Longitude
//     val[1] >= -90 && val[1] <= 90 // Latitude
//   );
// }

// RideSchema.index({ startLocation: "2dsphere" });
// RideSchema.index({ destinationLocation: "2dsphere" });

// const Ride = models.Ride || model("Ride", RideSchema);
// export default Ride;

import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Ride Document interface to include createdBy and other fields
interface RideDocument extends Document {
  createdBy: string;
  rider: string;
}

const RideSchema = new Schema({
  rideId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  createdBy: {
    type: String,
    enum: ["rider", "passenger"],
    required: true,
  },
  rider: {
    type: String,
    ref: "Rider",
    validate: {
      validator: function (v: string | null) {
        // Explicitly tell TypeScript that `this` refers to a RideDocument
        const document = this as RideDocument;
        // This checks if createdBy is "rider" and rider is required
        return document.createdBy === "rider" ? v != null && v !== "" : true;
      },
      message: "Rider is required if createdBy is 'rider'.",
    },
  },
  passengers: [
    {
      clerkId: {
        type: String,
        ref: "User",
        required: true,
      },
      fare: {
        type: Number,
        default: 0,
      },
      pickupLocation: {
        type: String,
        required: true,
      },
      dropoffLocation: {
        type: String,
        required: true,
      },
      pickupCoordinates: {
        type: [Number],
        required: true,
        validate: [arrayOfLatLon, "Invalid latitude or longitude"], // Custom validation (see below)
      },
      dropoffCoordinates: {
        type: [Number],
        required: true,
        validate: [arrayOfLatLon, "Invalid latitude or longitude"],
      },
    },
  ],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    default: 0,
  },
  startLocation: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  destinationLocation: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
    required: true,
  },
});

// GeoJSON Validation Function
function arrayOfLatLon(val: any) {
  return (
    Array.isArray(val) &&
    val.length === 2 &&
    val[0] >= -180 &&
    val[0] <= 180 && // Longitude
    val[1] >= -90 &&
    val[1] <= 90 // Latitude
  );
}

RideSchema.index({ startLocation: "2dsphere" });
RideSchema.index({ destinationLocation: "2dsphere" });

const Ride = models.Ride || model<RideDocument>("Ride", RideSchema);
export default Ride;
