"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        <div className="flex items-center gap-6 w-full justify-between">
          <Link href="/" passHref>
            <img
              src="/ridelink-logo-black.webp"
              alt="RideLink logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
          <nav
            className={`md:flex ${
              isOpen ? "block" : "hidden"
            } fixed md:relative bg-black w-full md:w-auto top-16 md:top-0 left-0 z-10 h-full`}
          >
            <ul className="flex flex-col md:flex-row gap-6 list-none p-4 md:p-0">
              <Link href="/passenger/dashboard" passHref>
                <li className="hover:underline cursor-pointer">Ride</li>
              </Link>
              <Link href="/drivers/dashboard" passHref>
                <li className="hover:underline cursor-pointer">Drive</li>
              </Link>
              {!isSignedIn ? (
                <>
                  <Link href="/sign-in">
                    <li className="hover:underline cursor-pointer">Login</li>
                  </Link>
                  <Link href="/sign-up">
                    <li className="hover:underline cursor-pointer">Sign Up</li>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile">
                    <li className="hover:underline cursor-pointer">Profile</li>
                  </Link>
                  <li>
                    <SignOutButton>
                      <button className="hover:underline cursor-pointer">
                        Sign out
                      </button>
                    </SignOutButton>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
