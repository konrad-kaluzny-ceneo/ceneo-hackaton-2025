import Image from "next/image";
import TripBox from "../trip/TripBox";
import { TripSet } from "@/types/trip-set";

export default function CreatedByOthers() {

    const tripsFromOthers = require("@/local-data/trip-propositions.json");
    
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex items-center gap-3">
        <Image src="/images/icons/loop.png" alt="Loop" width={50} height={50} />
        <p className="text-primary text-2xl font-semibold">Stworzone przez innych</p>
      </div>
      <div className="flex flex-col gap-2">
        {tripsFromOthers.map((trip: TripSet) => (
          <TripBox trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
}
