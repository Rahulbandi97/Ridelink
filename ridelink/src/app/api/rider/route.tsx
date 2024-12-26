import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Rider from "@/lib/modals/rider.model";
import User from "@/lib/modals/user.model"; // Assuming your User model is here

// GET handler to fetch Rider by clerkId
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing clerkId" }),
        { status: 400 }
      );
    }

    await connect();

    const rider = await Rider.findOne({ clerkId });

    if (!rider) {
      return new NextResponse(
        JSON.stringify({ message: "Rider not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(rider), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
};

// POST handler to create a new Rider
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { clerkId, vehicleDetails, availability, ratings, status, verified } = body;

    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    await connect();

    // Check if the User exists
    const userExists = await User.findOne({ clerkId });
    if (!userExists) {
      return NextResponse.json(
        { message: "User with given clerkId does not exist" },
        { status: 404 }
      );
    }

    // Check if the Rider already exists
    const existingRider = await Rider.findOne({ clerkId });
    if (existingRider) {
      return NextResponse.json(
        { message: "Rider already exists" },
        { status: 400 }
      );
    }


    // Calculate average rating if ratings are provided
    const averageRating = ratings && ratings.length > 0
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : 0;

    const newRider = await Rider.create({
      clerkId,
      vehicleDetails,
      availability,
      ratings,
      averageRating,
      status: status || "Inactive", // Default to Inactive if not provided
      verified: verified || false,   // Default to false if not provided
    });

    return NextResponse.json(newRider, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

// PATCH handler to update an existing Rider
export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { clerkId, vehicleDetails, availability, ratings, status, verified } = body;

    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    await connect();

    const existingRider = await Rider.findOne({ clerkId });
    if (!existingRider) {
      return NextResponse.json(
        { message: "Rider not found" },
        { status: 404 }
      );
    }

    // Calculate new average rating if ratings are provided
    const newAverageRating = ratings && ratings.length > 0
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : existingRider.averageRating;

    const updatedRider = await Rider.findOneAndUpdate(
      { clerkId },
      {
        vehicleDetails,
        availability,
        ratings,
        averageRating: newAverageRating, // Update the average rating
        status,
        verified, // Update the verified field
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedRider, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

// DELETE handler to delete an existing Rider by clerkId
export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    await connect();

    const existingRider = await Rider.findOne({ clerkId });
    if (!existingRider) {
      return NextResponse.json(
        { message: "Rider not found" },
        { status: 404 }
      );
    }

    await Rider.deleteOne({ clerkId });

    return NextResponse.json(
      { message: "Rider deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
