"use client";

import HomeButton from "./HomeButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center p-2 w-full h-12 gap-2">
      <HomeButton />
      <Link href="/" className="text-primary text-2xl font-bold mb-1">Here.</Link>
      <div className="ml-auto flex gap-4">
        <Link href="/trip-propositions" className="text-sm text-gray-600 hover:text-primary whitespace-nowrap">
          Propozycje
        </Link>
        <Link href="/active-trips" className="text-sm text-gray-600 hover:text-primary whitespace-nowrap">
          Aktywne
        </Link>
        <Link href="/trip-history" className="text-sm text-gray-600 hover:text-primary whitespace-nowrap">
          Historia
        </Link>
      </div>
      </div>
  );
}
