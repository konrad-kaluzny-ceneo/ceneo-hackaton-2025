"use client";

import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { ActiveTrip } from "@/types/active-trip";
import ActiveTripCard from "./ActiveTripCard";

const mockActiveTrips: ActiveTrip[] = [
  {
    id: "active-trip-1",
    name: "Wrocław → Kraków",
    totalPrice: 550,
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
        location: "Kraków",
        date: "2024-02-16",
        moodRating: {
          peacefulness: 85,
          excitement: 90,
          comfort: 88,
          overall: 88,
        },
        description: "Kraków zachwyca swoją historią, architekturą i atmosferą. Spacer po Rynku Głównym to niezapomniane przeżycie.",
        photos: ["/images/mountains.webp"],
        tags: ["historia", "kultura", "architektura"],
      },
    ],
    currentLocation: "Kraków",
    destinations: [
      {
        order: 1,
        transport: {
          from: { country: "Polska", region: "Dolnośląskie", city: "Wrocław" },
          fromDate: "2024-02-15T08:00:00Z",
          destination: { country: "Polska", region: "Wielkopolskie", city: "Poznań" },
          destinationDate: "2024-02-15T10:30:00Z",
          price: 150,
          name: "Pociąg",
        },
        accommodation: null,
      },
      {
        order: 2,
        transport: {
          from: { country: "Polska", region: "Wielkopolskie", city: "Poznań" },
          fromDate: "2024-02-15T14:00:00Z",
          destination: { country: "Polska", region: "Mazowieckie", city: "Warszawa" },
          destinationDate: "2024-02-15T17:30:00Z",
          price: 80,
          name: "Pociąg",
        },
        accommodation: {
          location: { country: "Polska", region: "Mazowieckie", city: "Warszawa" },
          date: "2024-02-15",
          price: 250,
          beds: 2,
          name: "Hotel Warszawa Centrum",
          description: "Stolica Polski, centrum polityczne i kulturalne kraju.",
          images: [],
        },
      },
      {
        order: 3,
        transport: {
          from: { country: "Polska", region: "Mazowieckie", city: "Warszawa" },
          fromDate: "2024-02-16T09:00:00Z",
          destination: { country: "Polska", region: "Małopolskie", city: "Kraków" },
          destinationDate: "2024-02-16T12:00:00Z",
          price: 120,
          name: "Pociąg",
        },
        accommodation: {
          location: { country: "Polska", region: "Małopolskie", city: "Kraków" },
          date: "2024-02-16",
          price: 200,
          beds: 2,
          name: "Hotel Kraków Stare Miasto",
          description: "Historyczne miasto z zamkiem królewskim, Rynkiem Głównym i bogatym dziedzictwem kulturowym.",
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
