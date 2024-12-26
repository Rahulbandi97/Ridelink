// import Ride from "@/lib/modals/ride.model";
// import User from "@/lib/modals/user.model"; // Assuming you have a User model
// import Rider from "@/lib/modals/rider.model"; // Assuming you have a Rider model
// import { connect } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// /**
//  * Create a new ride
//  */
// export const POST = async (request: NextRequest) => {
//   try {
//     const body = await request.json();
//     const {
//       createdBy,
//       rider,
//       passengers,
//       startTime,
//       origin,
//       destination,
//       startLocation,
//       destinationLocation,
//       fare,
//     } = body;

//     // Validate createdBy
//     if (!createdBy || !["rider", "passenger"].includes(createdBy)) {
//       return NextResponse.json(
//         { message: "Invalid or missing createdBy field" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     if (createdBy === "rider") {
//       if (!rider || !origin || !destination) {
//         return NextResponse.json(
//           { message: "Rider-created rides must include rider, origin, and destination" },
//           { status: 400 }
//         );
//       }

//       // Check if the rider exists in the database
//       const riderExists = await Rider.findOne({ clerkId: rider });
//       if (!riderExists) {
//         return NextResponse.json(
//           { message: "Rider does not exist" },
//           { status: 404 }
//         );
//       }

//       // Ensure passengers are not included when created by a rider
//       if (passengers && passengers.length > 0) {
//         return NextResponse.json(
//           { message: "Rider-created rides should not include passengers" },
//           { status: 400 }
//         );
//       }
//     }

//     if (createdBy === "passenger") {
//       if (!passengers || passengers.length === 0) {
//         return NextResponse.json(
//           { message: "Passenger-created rides must include at least one passenger" },
//           { status: 400 }
//         );
//       }

//       // Check if all passengers exist in the User collection
//       for (const passenger of passengers) {
//         const passengerExists = await User.findOne({ clerkId: passenger.clerkId });
//         if (!passengerExists) {
//           return NextResponse.json(
//             { message: `Passenger with clerkId ${passenger.clerkId} does not exist` },
//             { status: 404 }
//           );
//         }
//       }
//     }

//     const newRide = await Ride.create({
//       createdBy,
//       rider,
//       passengers,
//       startTime,
//       origin,
//       destination,
//       startLocation,
//       destinationLocation,
//       fare,
//     });

//     return NextResponse.json(newRide, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

// /**
//  * Fetch rides
//  */
// export const GET = async (request: NextRequest) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const rideId = searchParams.get("rideId");
//     const createdBy = searchParams.get("createdBy");

//     await connect();

//     let rides;
//     if (rideId) {
//       rides = await Ride.findOne({ rideId });
//       if (!rides) {
//         return NextResponse.json({ message: "Ride not found" }, { status: 404 });
//       }
//     } else if (createdBy) {
//       rides = await Ride.find({ createdBy });
//     } else {
//       rides = await Ride.find();
//     }

//     return NextResponse.json(rides, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

// /**
//  * Fetch rides by passenger ID
//  */
// export const GET_BY_PASSENGER = async (request: NextRequest) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const passengerId = searchParams.get("passengerId");

//     if (!passengerId) {
//       return NextResponse.json({ message: "passengerId is required" }, { status: 400 });
//     }

//     await connect();

//     const rides = await Ride.find({ "passengers.clerkId": passengerId });
//     if (!rides || rides.length === 0) {
//       return NextResponse.json({ message: "No rides found for the given passenger" }, { status: 404 });
//     }

//     return NextResponse.json(rides, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

// /**
//  * Fetch rides by rider ID
//  */
// export const GET_BY_RIDER = async (request: NextRequest) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const riderId = searchParams.get("riderId");

//     if (!riderId) {
//       return NextResponse.json({ message: "riderId is required" }, { status: 400 });
//     }

//     await connect();

//     const rides = await Ride.find({ rider: riderId });
//     if (!rides || rides.length === 0) {
//       return NextResponse.json({ message: "No rides found for the given rider" }, { status: 404 });
//     }

//     return NextResponse.json(rides, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

// /**
//  * Update a ride
//  */
// export const PATCH = async (request: NextRequest) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const rideId = searchParams.get("rideId");

//     if (!rideId) {
//       return NextResponse.json({ message: "rideId is required" }, { status: 400 });
//     }

//     const body = await request.json();
//     const {
//       rider,
//       passengers,
//       startTime,
//       origin,
//       destination,
//       startLocation,
//       destinationLocation,
//       fare,
//     } = body;

//     await connect();

//     // Validate rider if provided
//     if (rider) {
//       const riderExists = await Rider.findOne({ clerkId: rider });
//       if (!riderExists) {
//         return NextResponse.json(
//           { message: "Rider does not exist" },
//           { status: 404 }
//         );
//       }
//     }

//     // Validate passengers if provided
//     if (passengers && passengers.length > 0) {
//       for (const passenger of passengers) {
//         const passengerExists = await User.findOne({ clerkId: passenger.clerkId });
//         if (!passengerExists) {
//           return NextResponse.json(
//             { message: `Passenger with clerkId ${passenger.clerkId} does not exist` },
//             { status: 404 }
//           );
//         }
//       }
//     }

//     // Ensure that either startLocation or destinationLocation are geospatial coordinates
//     if (startLocation && !startLocation.coordinates) {
//       return NextResponse.json(
//         { message: "Invalid startLocation: coordinates are required" },
//         { status: 400 }
//       );
//     }
//     if (destinationLocation && !destinationLocation.coordinates) {
//       return NextResponse.json(
//         { message: "Invalid destinationLocation: coordinates are required" },
//         { status: 400 }
//       );
//     }

//     const updatedRide = await Ride.findOneAndUpdate(
//       { rideId },
//       {
//         ...(rider && { rider }),
//         ...(passengers && { passengers }),
//         ...(startTime && { startTime }),
//         ...(origin && { origin }),
//         ...(destination && { destination }),
//         ...(startLocation && { startLocation }),
//         ...(destinationLocation && { destinationLocation }),
//         ...(fare && { fare }),
//       },
//       { new: true }
//     );

//     if (!updatedRide) {
//       return NextResponse.json({ message: "Ride not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedRide, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

// /**
//  * Delete a ride
//  */
// export const DELETE = async (request: NextRequest) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const rideId = searchParams.get("rideId");

//     if (!rideId) {
//       return NextResponse.json({ message: "rideId is required" }, { status: 400 });
//     }

//     await connect();

//     const deletedRide = await Ride.findOneAndDelete({ rideId });

//     if (!deletedRide) {
//       return NextResponse.json({ message: "Ride not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Ride deleted successfully", rideId },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };

import Ride from "@/lib/modals/ride.model";
import User from "@/lib/modals/user.model";
import Rider from "@/lib/modals/rider.model";
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Create a new ride
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      createdBy,
      rider,
      passengers,
      startTime,
      origin,
      destination,
      startLocation,
      destinationLocation,
      fare,
    } = body;

    // Set the default status
    const ride_status = "pending";

    // Validate createdBy
    if (!createdBy || !["rider", "passenger"].includes(createdBy)) {
      return NextResponse.json(
        { message: "Invalid or missing createdBy field" },
        { status: 400 }
      );
    }

    await connect();

    if (createdBy === "rider") {
      if (!rider || !origin || !destination) {
        return NextResponse.json(
          {
            message:
              "Rider-created rides must include rider, origin, and destination",
          },
          { status: 400 }
        );
      }

      const riderExists = await Rider.findOne({ clerkId: rider });
      if (!riderExists) {
        return NextResponse.json(
          { message: "Rider does not exist" },
          { status: 404 }
        );
      }

      if (passengers && passengers.length > 0) {
        return NextResponse.json(
          { message: "Rider-created rides should not include passengers" },
          { status: 400 }
        );
      }
    }

    if (createdBy === "passenger") {
      if (!passengers || passengers.length === 0) {
        return NextResponse.json(
          {
            message:
              "Passenger-created rides must include at least one passenger",
          },
          { status: 400 }
        );
      }

      for (const passenger of passengers) {
        const passengerExists = await User.findOne({
          clerkId: passenger.clerkId,
        });
        if (!passengerExists) {
          return NextResponse.json(
            {
              message: `Passenger with clerkId ${passenger.clerkId} does not exist`,
            },
            { status: 404 }
          );
        }
      }
    }

    // Create the new ride, including the status field
    const newRide = await Ride.create({
      createdBy,
      rider,
      passengers,
      startTime,
      origin,
      destination,
      startLocation,
      destinationLocation,
      fare,
      status: ride_status,
    });

    return NextResponse.json(newRide, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

/**
 * Fetch rides
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");
    const createdBy = searchParams.get("createdBy");
    const passengerId = searchParams.get("passengerId");
    const riderId = searchParams.get("riderId");

    await connect();

    let rides;

    if (rideId) {
      rides = await Ride.findOne({ rideId });
      if (!rides) {
        return NextResponse.json(
          { message: "Ride not found" },
          { status: 404 }
        );
      }
    } else if (createdBy) {
      rides = await Ride.find({ createdBy });
    } else if (passengerId) {
      rides = await Ride.find({ "passengers.clerkId": passengerId });
      if (!rides || rides.length === 0) {
        return NextResponse.json(
          { message: "No rides found for the given passenger" },
          { status: 404 }
        );
      }
    } else if (riderId) {
      rides = await Ride.find({ rider: riderId });
      if (!rides || rides.length === 0) {
        return NextResponse.json(
          { message: "No rides found for the given rider" },
          { status: 404 }
        );
      }
    } else {
      rides = await Ride.find();
    }

    return NextResponse.json(rides, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

/**
 * Update a ride
 */
export const PATCH = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json(
        { message: "rideId is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      rider,
      passengers,
      startTime,
      origin,
      destination,
      startLocation,
      destinationLocation,
      fare,
      status,
    } = body;

    await connect();

    if (rider) {
      const riderExists = await Rider.findOne({ clerkId: rider });
      if (!riderExists) {
        return NextResponse.json(
          { message: "Rider does not exist" },
          { status: 404 }
        );
      }
    }

    if (passengers && passengers.length > 0) {
      for (const passenger of passengers) {
        const passengerExists = await User.findOne({
          clerkId: passenger.clerkId,
        });
        if (!passengerExists) {
          return NextResponse.json(
            {
              message: `Passenger with clerkId ${passenger.clerkId} does not exist`,
            },
            { status: 404 }
          );
        }
      }
    }

    const updatedRide = await Ride.findOneAndUpdate(
      { rideId },
      {
        ...(rider && { rider }),
        ...(passengers && { passengers }),
        ...(startTime && { startTime }),
        ...(origin && { origin }),
        ...(destination && { destination }),
        ...(startLocation && { startLocation }),
        ...(destinationLocation && { destinationLocation }),
        ...(fare && { fare }),
        ...(status && { status }),
      },
      { new: true }
    );

    if (!updatedRide) {
      return NextResponse.json({ message: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRide, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
/**
 * Update a ride by adding/removing a rider or passenger
 */
/**
 * Update a ride by adding/removing a rider or passenger
 */

/**
 * Delete a ride
 */
export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json(
        { message: "rideId is required" },
        { status: 400 }
      );
    }

    await connect();

    const deletedRide = await Ride.findOneAndDelete({ rideId });

    if (!deletedRide) {
      return NextResponse.json({ message: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Ride deleted successfully", rideId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
