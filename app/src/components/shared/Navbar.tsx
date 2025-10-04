"use client";

import HomeButton from "./HomeButton";

export default function Navbar() {
  return (
    <div className="flex items-center p-2 w-full h-12">
      <HomeButton />
      <p className="text-primary text-2xl font-bold mb-1">Here.</p>
    </div>
  );
}
