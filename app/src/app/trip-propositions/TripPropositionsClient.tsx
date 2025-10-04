"use client";

import React, { useState } from "react";
import TripBox from "@/components/trip/TripBox";
import TripBoxSkeleton from "@/components/trip/TripBoxSkeleton";
import { Destination, TripSet } from "@/types/trip-set";
import CreatedByOthers from "@/components/custom-trips/CreatedByOthers";
import SortFilters from "@/components/sort-filters/SortFilters";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface TripPropositionsClientProps {
  initialTrips: TripSet[];
}

export default function TripPropositionsClient({ initialTrips }: TripPropositionsClientProps) {
  const [trips, setTrips] = useState<TripSet[]>(initialTrips);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main>
      <MaxWidthWrapper className="pt-2 flex flex-col gap-4">
        <SortFilters isLoading={isLoading} />

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3 py-4 mx-auto">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        ) : trips.length > 0 && (
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3 py-4 mx-auto">
              <Image src="/images/icons/loop.png" alt="Loop" width={50} height={50} />
              <p className="text-primary text-2xl font-semibold">Specjalnie dla Ciebie</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {isLoading ? (
            <>
              <TripBoxSkeleton />
              <TripBoxSkeleton />
            </>
          ) : (
            trips.map((trip: TripSet) => {
              const firstAccommodation = trip.destinations.find((dest: Destination) => dest.accommodation)?.accommodation;
              const tripImage = firstAccommodation?.images?.[0] || "/images/af6a75af62687873e61b92e6eb76db3517d4a3a8.png";

              return <TripBox trip={trip} key={trip.id} />;
            })
          )}
          <CreatedByOthers isLoading={isLoading} />
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
