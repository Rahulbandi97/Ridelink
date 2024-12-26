import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';

export async function POST(req: Request) {
  // Webhook secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }
  
  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');
  
  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }
  
  // Get payload
  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log('Received webhook payload:', body);
  
  // Verify webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook signature', { status: 400 });
  }
  
  // Type guard to check if the event is a user event
  const isUserEvent = (
    evt.data && 
    typeof evt.data === 'object' && 
    'id' in evt.data && 
    'email_addresses' in evt.data
  );

  if (!isUserEvent) {
    return NextResponse.json({ message: "Not a user event" }, { status: 400 });
  }

  // Now safely destructure with type assertion
  const { 
    id, 
    email_addresses, 
    image_url, 
    first_name, 
    last_name, 
    username 
  } = evt.data as {
    id: string;
    email_addresses: { email_address: string }[];
    image_url: string;
    first_name: string;
    last_name: string;
    username: string;
  };

  const eventType = evt.type;
  
  try {
    if (eventType === "user.created") {
      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };
      console.log('Creating user:', user);
      const newUser = await createUser(user);
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, { publicMetadata: { userId: newUser._id } });
        return NextResponse.json({ message: "New user created", user: newUser }, { status: 201 });
      }
    }
    
    if (eventType === "user.deleted") {
      console.log(`Deleting user with Clerk ID: ${id}`);
      const isDeleted = await deleteUser(id);
      if (isDeleted) {
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'User not found or already deleted' }, { status: 404 });
      }
    }
    
    if (eventType === "user.updated") {
      const userUpdated = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };
      console.log('Updating user:', userUpdated);
      const updatedUser = await updateUser(id, userUpdated);
      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({ 
      message: "Error processing webhook", 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
  
  return new Response('', { status: 200 });
}