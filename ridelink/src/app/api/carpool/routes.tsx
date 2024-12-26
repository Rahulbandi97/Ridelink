import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Carpool from "@/lib/modals/carpool.model";

// GET handler to fetch Carpool requests
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const carpoolId = searchParams.get("carpoolId");

    await connect();

    let carpool;
    if (carpoolId) {
      // Fetch a specific Carpool request
      carpool = await Carpool.findById(carpoolId).populate("rider requestedBy");
    } else {
      // Fetch all Carpool requests
      carpool = await Carpool.find().populate("rider requestedBy");
    }

    if (!carpool) {
      return new NextResponse(
        JSON.stringify({ message: "No carpool request(s) found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(carpool), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
};

// POST handler to create a new Carpool request
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { requestedBy, destination, pickupLocation, status, rider } = body;

    if (!requestedBy || !destination || !pickupLocation) {
      return NextResponse.json(
        { message: "Missing required fields: requestedBy, destination, or pickupLocation" },
        { status: 400 }
      );
    }

    await connect();

    const newCarpool = await Carpool.create({
      requestedBy,
      destination,
      pickupLocation,
      status: status || "Pending",
      rider: rider || null,
    });

    return NextResponse.json(newCarpool, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

// PATCH handler to update an existing Carpool request
export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { carpoolId, destination, pickupLocation, status, rider } = body;

    if (!carpoolId) {
      return NextResponse.json(
        { message: "Carpool ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const updatedCarpool = await Carpool.findByIdAndUpdate(
      carpoolId,
      { destination, pickupLocation, status, rider },
      { new: true, runValidators: true }
    );

    if (!updatedCarpool) {
      return NextResponse.json(
        { message: "Carpool request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCarpool, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

// DELETE handler to delete a Carpool request
export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const carpoolId = searchParams.get("carpoolId");

    if (!carpoolId) {
      return NextResponse.json(
        { message: "Carpool ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const deletedCarpool = await Carpool.findByIdAndDelete(carpoolId);

    if (!deletedCarpool) {
      return NextResponse.json(
        { message: "Carpool request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Carpool request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
