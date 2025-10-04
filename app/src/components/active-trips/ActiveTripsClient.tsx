"use client";

import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { ActiveTrip } from "@/types/active-trip";
import ActiveTripCard from "./ActiveTripCard";

const mockActiveTrips: ActiveTrip[] = [
  {
    id: "active-trip-1",
    name: "Wrocław → Chiavenna",
    totalPrice: 1250,
    duration: 3,
    image: "/images/trip-train.webp",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-02-18"),
    userId: "user-1",
    isActive: true,
    currentStep: 0,
    bookingStatus: {
      transport: false,
      accommodation: false,
      overall: false,
    },
    experiences: [
      {
        id: "exp-1",
        location: "Chiavenna",
        date: "2024-02-16",
        moodRating: {
          peacefulness: 98,
          excitement: 75,
          comfort: 85,
          overall: 90,
        },
        description: "Prosto, w prowincji Sondrio, to niewielka alpejska miejscowość należąca do gminy Piuro, słynąca z urokliwych widoków i bliskości wodospadów Acquafraggia.",
        photos: ["/images/mountains.webp"],
        tags: ["góry", "spokój", "natura"],
      },
    ],
    currentLocation: "Chiavenna",
    destinations: [
      {
        order: 1,
        transport: {
          from: { country: "Polska", region: "Dolnośląskie", city: "Wrocław" },
          fromDate: "2024-02-15T08:00:00Z",
          destination: { country: "Włochy", region: "Lombardia", city: "Bergamo" },
          destinationDate: "2024-02-15T10:30:00Z",
          price: 450,
          name: "Lot",
        },
        accommodation: null,
      },
      {
        order: 2,
        transport: {
          from: { country: "Włochy", region: "Lombardia", city: "Bergamo" },
          fromDate: "2024-02-15T12:00:00Z",
          destination: { country: "Włochy", region: "Lombardia", city: "Mediolan" },
          destinationDate: "2024-02-15T13:30:00Z",
          price: 25,
          name: "Pociąg",
        },
        accommodation: {
          location: { country: "Włochy", region: "Lombardia", city: "Mediolan" },
          date: "2024-02-15",
          price: 200,
          beds: 2,
          name: "Hotel Milano Centrale",
          description: "Włoskie miasto znane jako stolica mody, designu i finansów.",
          images: [],
        },
      },
      {
        order: 3,
        transport: {
          from: { country: "Włochy", region: "Lombardia", city: "Mediolan" },
          fromDate: "2024-02-16T09:00:00Z",
          destination: { country: "Włochy", region: "Lombardia", city: "Chiavenna" },
          destinationDate: "2024-02-16T11:00:00Z",
          price: 30,
          name: "Pociąg",
        },
        accommodation: {
          location: { country: "Włochy", region: "Lombardia", city: "Chiavenna" },
          date: "2024-02-16",
          price: 150,
          beds: 2,
          name: "Hotel Chiavenna",
          description: "Malownicze włoskie miasteczko w Alpach, znane z historycznego centrum i pięknych górskich krajobrazów.",
          images: [],
        },
      },
    ],
  },
];

export default function ActiveTripsClient() {
  return (
    <main className="min-h-screen flex flex-col gap-4">
      <MaxWidthWrapper className="py-6">
        <h1 className="text-3xl font-bold text-primary">Twoja podróż</h1>
      </MaxWidthWrapper>

      {mockActiveTrips.map((trip) => (
        <ActiveTripCard key={trip.id} trip={trip} />
      ))}
    </main>
  );
}
