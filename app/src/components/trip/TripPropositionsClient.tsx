"use client";

import React, { useEffect, useState } from "react";
import TripBox from "@/components/trip/TripBox";
import TripBoxSkeleton from "@/components/trip/TripBoxSkeleton";
import { Destination, TripSet } from "@/types/trip-set";
import CreatedByOthers from "@/components/custom-trips/CreatedByOthers";
import SortFilters from "@/components/sort-filters/SortFilters";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_IMAGE } from "@/config/images";

interface TripPropositionsClientProps {
  initialTrips: TripSet[];
}

export default function TripPropositionsClient({ initialTrips }: TripPropositionsClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="flex flex-col gap-4 w-full">
      <MaxWidthWrapper className="pt-2 flex flex-col gap-4">
        <SortFilters isLoading={isLoading} />

        {isLoading ? (
          <div className="flex justify-center items-center w-full">
            <div className="flex items-center gap-3 py-4 mx-auto">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        ) : initialTrips.length > 0 && (
          <div className="flex justify-center items-center w-full">
            <div className="flex items-center gap-3 py-4 mx-auto">
              <Image src="/images/icons/loop.png" alt="Loop" width={50} height={50} />
              <p className="text-primary text-2xl font-semibold">Specjalnie dla Ciebie</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 w-full">
          {isLoading ? (
            <>
              <TripBoxSkeleton />
              <TripBoxSkeleton />
            </>
          ) : (
            initialTrips.map((trip: TripSet) => {
              return <TripBox trip={trip} key={trip.id} />;
            })
          )}
          <CreatedByOthers isLoading={isLoading} />
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
