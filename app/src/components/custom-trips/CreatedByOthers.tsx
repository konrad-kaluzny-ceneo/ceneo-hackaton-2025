import Image from "next/image";
import TripBox from "../trip/TripBox";
import { TripSet } from "@/types/trip-set";

export default function CreatedByOthers() {

    const tripsFromOthers = require("@/local-data/trip-propositions.json");
    
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex items-center gap-2">
        <Image src="/images/icons/loop.png" alt="Loop" width={24} height={24} />
        <p>Stworzone przez innych</p>
      </div>
      <div className="flex flex-col gap-2">
        {tripsFromOthers.map((trip: TripSet) => (
          <TripBox trip={trip} />
        ))}
      </div>
    </div>
  );
}
