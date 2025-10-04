"use client";

import { TripSet } from "@/types/trip-set";
import TripPropositionsClient from "@/components/trip/TripPropositionsClient";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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

  {loading ? (
    <div className="flex justify-center items-center w-full">
      <div className="flex items-center gap-3 py-4 mx-auto">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  ) : trips.length > 0 && (
    <div className="flex justify-center items-center w-full">
      <div className="flex items-center gap-3 py-4 mx-auto">
        <Image src="/images/icons/loop.png" alt="Loop" width={50} height={50} />
        <p className="text-primary text-2xl font-semibold">Specjalnie dla Ciebie</p>
      </div>
    </div>
  )}

  return <TripPropositionsClient initialTrips={trips} />;
}
