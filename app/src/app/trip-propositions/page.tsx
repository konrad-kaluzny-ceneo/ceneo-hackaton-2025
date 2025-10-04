"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/infrastructure/FrontendUserAccessor";
import TripBox from "@/components/trip/TripBox";
import { Destination, TripSet } from "@/types/trip-set";
import CreatedByOthers from "@/components/custom-trips/CreatedByOthers";

async function getTripPropositions() {
    const userId = useUser();
    const res = await fetch('/api/trips?userId=' + userId.id);
    return await res.json();
//   const filePath = path.join(
//     process.cwd(),
//     "src",
//     "local-data",
//     "trip-propositions.json"
//   );
//   const fileContents = fs.readFileSync(filePath, "utf-8");
//   return JSON.parse(fileContents);
}

export default function TripPropositionsPage() {
  const [trips, setTrips] = useState<TripSet[]>([]);

  useEffect(() => {
    async function fetchTrips() {
      const data: TripSet[] = await getTripPropositions();
      setTrips(data);
    }
    fetchTrips();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-primary text-4xl mb-2 font-bold">Here.</h1>
      <p className="text-lg mb-8 text-gray-600">Specjalnie dla Ciebie</p>

      <div className="flex flex-col gap-8">
        {trips.map((trip: TripSet) => {
          // Get the first accommodation image from the trip
          const firstAccommodation = trip.destinations.find(
            (dest: Destination) => dest.accommodation
          )?.accommodation;
          const tripImage =
            firstAccommodation?.images?.[0] ||
            "/images/af6a75af62687873e61b92e6eb76db3517d4a3a8.png";

          return (
            <TripBox trip={trip} />
          );
        })}
        <CreatedByOthers />
      </div>
    </main>
  );
}
