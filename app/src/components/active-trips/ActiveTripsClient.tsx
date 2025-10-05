"use client";

import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { ActiveTrip } from "@/types/active-trip";
import ActiveTripCard from "./ActiveTripCard";
import userSets from "@/local-data/sample-sets.json";

// Konwertuj dane JSON na format ActiveTrip
const convertToActiveTrips = (): ActiveTrip[] => {
  const trips: ActiveTrip[] = [];
  
  // Dodaj przyszłą podróż jako aktywną
  userSets.filter(set => set.state === "future").forEach(futureSet => {
      trips.push({
        ...futureSet,
        state: "future",
        userId: "user-1",
        startDate: new Date(futureSet.startDate),
        endDate: new Date(new Date(futureSet.startDate).getTime() + futureSet.duration * 24 * 60 * 60 * 1000),
        isActive: true,
        currentStep: 1,
        currentLocation: "Kraków",
        bookingStatus: {
          transport: true,
          accommodation: true,
          overall: true,
        },
        experiences: [
          {
            id: "exp-1",
            location: "Kraków",
            date: "2025-10-15",
            moodRating: {
              peacefulness: 85,
              excitement: 90,
              comfort: 80,
              overall: 85,
            },
            description: "Magiczny start podróży w Krakowie. Rynek Główny zapiera dech w piersiach, a atmosfera miasta jest niesamowita!",
            photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
            tags: ["historia", "kultura", "architektura"],
          },
        ],
      });
    });
  
  // Dodaj historyczną podróż
  userSets.filter(set => set.state === "history").forEach(historySet => {
    trips.push({
      ...historySet,
      state: "history",
      id: "trip-set-002", // Unikalny ID
      userId: "user-1", 
      startDate: new Date("2025-09-20T12:15:00Z"),
      endDate: new Date("2025-09-27T12:15:00Z"),
      isActive: false,
      currentStep: historySet.destinations.length,
      currentLocation: "Karlowe Wary",
      bookingStatus: {
        transport: true,
        accommodation: true,
        overall: true,
      },
      experiences: [
        {
          id: "exp-hist-1",
          location: "Karlowe Wary",
          date: "2025-09-21",
          moodRating: {
            peacefulness: 95,
            excitement: 60,
            comfort: 90,
            overall: 88,
          },
          description: "Relaksujący weekend w Karlowych Warach. Termalne źródła i piękna architektura spa sprawiły, że to była idealna ucieczka od codzienności.",
          photos: ["https://cdn.tripzaza.com/pl/destinations/wp-content/uploads/2018/11/6-Karlovy_Vary_-_Market_Colonnade-e1541130456260.jpg"],
          tags: ["relaks", "spa", "zdrowie", "historia"],
        },
      ],
    });
  });
  return trips;
}


const activeTrips = convertToActiveTrips();

export default function ActiveTripsClient() {
  return (
    <main className="flex flex-col gap-4">
      <MaxWidthWrapper className="py-6">
        <h1 className="text-3xl font-bold text-primary">Twoja podróż</h1>
      </MaxWidthWrapper>

      {activeTrips.map((trip: ActiveTrip) => (
        <ActiveTripCard key={trip.id} trip={trip} />
      ))}
    </main>
  );
}
