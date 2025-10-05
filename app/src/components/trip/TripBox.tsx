import { cn } from "@/lib/utils";
import { Destination, TripSet } from "@/types/trip-set";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { UserInfo } from "../user/UserInfo";
import { User } from "@/types/user";
import { TreeDeciduous, HeartIcon, StarIcon } from "lucide-react";
import { Transport } from "@/types/transport";
import { Accommodation } from "@/types/accommodation";

interface TripBoxProps {
  trip: TripSet;
}

export default function TripBox({ trip }: TripBoxProps) {
  const user = require("@/local-data/users.json").find((user: User) => user.id === trip.userId);
  
  const allAccommodations = require("@/local-data/accommodations.json");
  const accommodations = trip.destinations.map((dest) => allAccommodations.find((accommodation: Accommodation) => accommodation.id === dest.accommodationId));
  const accommodationsToShow = accommodations.filter((accommodation: Accommodation) => accommodation !== undefined);  

  return (
    <article key={trip.id} className="bg-white w-full rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <img
          src={trip.image || "/images/trip-train.webp"}
          alt={`Zdjęcie wycieczki: ${trip.name}`}
          className="object-cover rounded-t-2xl w-full h-full"
          style={{ objectFit: "cover" }}
          loading="eager"
        />
      </div>

      <div className="px-6 pb-4 flex flex-col gap-2 w-full mt-4">
        <h2 className="text-primary text-2xl font-bold">{trip.name}</h2>

        <p className="text-sm text-gray-600 leading-relaxed">Wybierz się na zapierającą dech w piersiach podróż pociągiem przez Szwajcarsko - Włoskie Alpy na wysokości 2200 m.n.p.m</p>

        {user && (
          <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <p>Autor</p>
            <UserInfo user={user} />
          </div>
        )}

        <div className="text-sm text-primary font-medium flex-col gap-1">
          <p className="font-bold">Podgląd podróży:</p>
          <p>
            {accommodationsToShow
              .map((accommodation: Accommodation) => {
                return accommodation.name;
              })
              .join(" → ")}
          </p>
        </div>

        <Link 
          href={`/trip-propositions/${trip.id}`} 
          className={cn(buttonVariants({ variant: "default" }))}
          aria-label={`Sprawdź szczegóły wycieczki: ${trip.name}`}
        >
          Sprawdź
        </Link>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
            <span className="text-sm font-medium" aria-label="Ocena: 4.9 gwiazdek">4.9</span>
          </div>

          <div className="flex items-center gap-1.5">
            <TreeDeciduous className="w-4 h-4 text-primary fill-primary" aria-hidden="true" />
            <span className="text-sm font-medium" aria-label="Poziom spokoju: 100 na 100">Poziom spokoju 100/100</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HeartIcon className="w-4 h-4 text-red-500 fill-red-500" aria-hidden="true" />
            <span className="text-sm font-medium" aria-label="87 polubień">87</span>
          </div>
        </div>
      </div>
    </article>
  );
}
