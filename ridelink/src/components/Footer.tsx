import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="w-full mt-8 h-[1px] bg-yellow-500"></div>

      <div className="row-start-3 flex flex-col items-center p-6 sm:p-12 md:px-16 md:py-8 bg-black text-white md:flex-row md:justify-between">
        <div className="flex flex-row items-center gap-32 mb-4 md:mb-0 md:items-start">
          <a href="/passenger/dashboard" className="text-lg hover:underline">
            Book a Ride
          </a>
          <a href="/drivers/dashboard" className="text-lg hover:underline">
            Give a Ride
          </a>
        </div>

        <div className="flex items-center">
          <Link href="/" passHref>
            <img
              src="/ridelink-logo-black.webp"
              alt="RideLink logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
        </div>
      </div>
      <p className="bg-black p-4 text-center text-yellow-500">
        &copy; {new Date().getFullYear()} RideLink. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
