"use server";

import User from "../modals/user.model";
import { connect } from "@/lib/db";

// CREATE a new user
export async function createUser(user: any) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
}

// READ a user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    await connect();
    const user = await User.findOne({ clerkId });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User retrieval failed");
  }
}

// UPDATE user data
export async function updateUser(clerkId: string, updates: Partial<any>) {
  try {
    await connect();
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: updates },
      { new: true } // Return the updated document
    );
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("User update failed");
  }
}

// DELETE a user by Clerk ID
export async function deleteUser(clerkId: string) {
  try {
    await connect();
    const result = await User.deleteOne({ clerkId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("User deletion failed");
  }
}

// GET all users (optional - for managers or admin)
export async function getAllUsers() {
  try {
    await connect();
    const users = await User.find({});
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
}
