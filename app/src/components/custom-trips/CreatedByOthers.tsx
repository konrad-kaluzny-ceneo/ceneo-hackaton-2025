import Image from "next/image";
import TripBox from "../trip/TripBox";
import { TripSet } from "@/types/trip-set";
import { Skeleton } from "../ui/skeleton";

export default function CreatedByOthers({ isLoading = false }: { isLoading?: boolean }) {
  const tripsFromOthers = require("@/local-data/trip-propositions.json");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex items-center gap-3">
        <Image src="/images/icons/loop.png" alt="Loop" width={50} height={50} />
        <p className="text-primary text-2xl font-semibold">Stworzone przez innych</p>
      </div>
      <div className="flex flex-col gap-6">
        {tripsFromOthers.map((trip: TripSet) => (
          <TripBox trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
}
