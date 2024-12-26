import Ride from "@/lib/modals/ride.model";
import Rider from "@/lib/modals/rider.model";
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handle rider cancellation (removing the rider from the ride)
 */
export const PATCH = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json({ message: "rideId is required" }, { status: 400 });
    }

    const body = await request.json();
    const { cancelRide } = body;

    await connect();

    if (cancelRide) {
      const currentRide = await Ride.findOne({ rideId });

      if (!currentRide) {
        return NextResponse.json({ message: "Ride not found" }, { status: 404 });
      }

      // Remove the rider if they are canceling
      if (currentRide.rider) {
        await Ride.findOneAndUpdate(
          { rideId },
          { rider: null },
          { new: true }
        );
        return NextResponse.json({ message: "Rider has canceled the ride" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "No rider assigned to this ride" }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
