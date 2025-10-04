"use client";

import { TripSet } from "@/types/trip-set";
import TripPropositionsClient from "@/components/trip/TripPropositionsClient";
import { useEffect, useState } from "react";

export default function TripPropositionsPage() {
  const [trips, setTrips] = useState<TripSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  if (loading) {
    return <div>Ładowanie tripów...</div>;
  }

  return <TripPropositionsClient initialTrips={trips} />;
}
