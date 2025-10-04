"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/infrastructure/FrontendUserAccessor";

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
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function fetchTrips() {
      const data = await getTripPropositions();
      setTrips(data);
    }
    fetchTrips();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-primary text-4xl mb-2 font-bold">Here.</h1>
      <p className="text-lg mb-8 text-gray-600">Specjalnie dla Ciebie</p>

      <div className="flex flex-col gap-8">
        {trips.map((trip: any) => {
          // Get the first accommodation image from the trip
          const firstAccommodation = trip.destinations.find(
            (dest: any) => dest.accommodation
          )?.accommodation;
          const tripImage =
            firstAccommodation?.images?.[0] ||
            "/images/af6a75af62687873e61b92e6eb76db3517d4a3a8.png";

          return (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden max-w-[800px] flex gap-6"
            >
              <img
                src={tripImage}
                alt={trip.name}
                className="w-[200px] h-[200px] object-cover flex-shrink-0"
              />
              <div className="p-6 flex-1">
                <div className="mb-4">
                  <h2 className="text-primary text-2xl mb-2">{trip.name}</h2>
                  <div className="text-sm text-gray-600 mb-3">
                    Czas trwania: {trip.duration} dni | Całkowity koszt:{" "}
                    {trip.totalPrice} PLN
                  </div>

                  {/* Trip route */}
                  <div className="text-base text-primary font-medium">
                    {trip.destinations
                      .map((dest: any, idx: number) => {
                        const cities = [];
                        if (idx === 0) {
                          cities.push(dest.transport.from.city);
                        }
                        cities.push(dest.transport.destination.city);
                        return cities;
                      })
                      .flat()
                      .join(" → ")}
                  </div>
                </div>

                <Link
                  href={`/trip-propositions/${trip.id}`}
                  className="no-underline"
                >
                  <button className="mt-4 bg-primary text-white border-none rounded-lg px-8 py-3 text-base font-bold cursor-pointer hover:bg-primary transition-colors">
                    Sprawdź
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
