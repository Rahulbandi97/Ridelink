import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div className="bg-black text-white min-h-screen gap-8 flex flex-col justify-between">
      <div className="flex flex-col  md:flex-row items-center justify-between p-8 md:p-16">
        <div className="flex-1 md:pr-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Revolutionizing University Shuttle Services
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Ride when you need, connect with ease.
          </p>
          {userId ? (
            <Link href="/passenger/dashboard">
              <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded shadow transition">
                Get Started
              </button>
            </Link>
          ) : (
            <SignInButton>
              <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded shadow transition">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
        <div className="mt-8 md:mt-0 md:flex-1">
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24043.906684251593!2d-85.098496!3d41.1238644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1733451815628!5m2!1sen!2sus" width="600" height="450" loading="lazy" className="rounded-lg shadow-lg object-cover hover:scale-105 duration-300 w-full"></iframe>
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-white text-black p-8 md:p-16 md:mx-8 items-center gap-10 rounded-lg shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold">
            Quickly Connect with Riders
          </h2>
          <p className="mt-2 text-lg">
            Join Our Community for Affordable Rides That Help Everyone
          </p>
        </div>
        <div className="flex-1 mt-4 md:mt-0">
          <img
            src="ride.jpg"
            alt="ride-img"
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-white text-black p-8 md:p-16 md:mx-8 items-center gap-10 rounded-lg shadow-lg">
        <div className="flex-1 mt-4 md:mt-0">
          <img
            src="/driver.jpg"
            alt="driver-img"
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold">Save on Fuel Costs</h2>
          <p className="mt-2 text-lg">
            Connect with students heading your way in just a few clicks and save
            on gas!
          </p>
        </div>
      </div>
    </div>
  );
}
