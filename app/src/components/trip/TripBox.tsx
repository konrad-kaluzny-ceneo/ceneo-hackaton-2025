import { cn } from "@/lib/utils";
import { Destination, TripSet } from "@/types/trip-set";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface TripBoxProps {
  trip: TripSet;
}

export default function TripBox({ trip }: TripBoxProps) {
  return (
    <div key={trip.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col gap-4">
      <Image src={trip.image || ""} alt={trip.name} className="object-cover w-full h-42" width={300} height={300} />
      <div className="px-6 flex-1 pb-4 flex flex-col gap-2">
        <h2 className="text-primary text-2xl">{trip.name}</h2>
        <div className="text-sm text-gray-600">
          Czas trwania: {trip.duration} dni | Całkowity koszt: {trip.totalPrice} PLN
        </div>

        {/* Trip route */}
        <div className="text-base text-primary font-medium">
          {trip.destinations
            .map((dest: Destination, idx: number) => {
              const cities = [];
              if (idx === 0) {
                cities.push(dest.transport.from.city);
              }
              cities.push(dest.transport.destination.city);
              return cities;
            })
            .flat()
            .join(" → ")}
        </div>

        <Link href={`/trip-propositions/${trip.id}`} className={cn(buttonVariants({ variant: "default" }))}>
          Sprawdź
        </Link>
      </div>
    </div>
  );
}
