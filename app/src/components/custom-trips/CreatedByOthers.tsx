import Image from "next/image";
import TripBox from "../trip/TripBox";
import TripBoxSkeleton from "../trip/TripBoxSkeleton";
import { TripSet } from "@/types/trip-set";
import { Skeleton } from "../ui/skeleton";

export default function CreatedByOthers({ isLoading = false }: { isLoading?: boolean }) {
  const tripsFromOthers = require("@/local-data/trip-propositions.json");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex flex-col gap-6 w-full items-center">
          <TripBoxSkeleton />
          <TripBoxSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-3">
        <Image src="/images/icons/house.png" alt="Loop" width={50} height={50} />
        <p className="text-primary text-2xl font-semibold">Podróże społeczności</p>
      </div>
      <div className="flex flex-col gap-6 w-full items-center">
        {tripsFromOthers.map((trip: TripSet) => (
          <TripBox trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
}
