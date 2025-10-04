import { Destination, TripSet } from "@/types/trip-set";
import Image from "next/image";
import Link from "next/link";

interface TripBoxProps {
  trip: TripSet;
}

export default function TripBox({ trip }: TripBoxProps) {
  return (
    <div key={trip.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex gap-6">
      <Image src={trip.image || ""} alt={trip.name} className="object-cover" width={200} height={200} />
      <div className="p-6 flex-1">
        <div className="mb-4">
          <h2 className="text-primary text-2xl mb-2">{trip.name}</h2>
          <div className="text-sm text-gray-600 mb-3">
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
        </div>

        <Link href={`/trip-propositions/${trip.id}`} className="no-underline">
          <button className="mt-4 bg-primary text-white border-none rounded-lg px-8 py-3 text-base font-bold cursor-pointer hover:bg-primary transition-colors">Sprawdź</button>
        </Link>
      </div>
    </div>
  );
}
