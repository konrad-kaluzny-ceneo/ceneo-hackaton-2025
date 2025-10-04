import { cn } from "@/lib/utils";
import { Destination, TripSet } from "@/types/trip-set";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { UserInfo } from "../user/UserInfo";
import { User } from "@/types/user";
import { HeartIcon, SparklesIcon, StarIcon } from "lucide-react";

interface TripBoxProps {
  trip: TripSet;
}

export default function TripBox({ trip }: TripBoxProps) {
  const user = require("@/local-data/users.json").find((user: User) => user.id === trip.userId);

  return (
    <div key={trip.id} className="bg-white w-full rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image src={trip.image || "/images/trip-train.webp"} alt={trip.name} fill className="object-cover rounded-t-2xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={true} loading="eager" />
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
            {trip.destinations
              .map((dest: Destination, idx: number) => {
                const cities = [];
                if (idx === 0 && dest.transport) {
                  cities.push(dest.transport.from.city);
                }
                if (dest.transport) {
                  cities.push(dest.transport.destination.city);
                }
                return cities;
              })
              .flat()
              .join(" → ")}
          </p>
        </div>

        <Link href={`/trip-propositions/${trip.id}`} className={cn(buttonVariants({ variant: "default" }))}>
          Sprawdź
        </Link>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">4.9</span>
          </div>

          <div className="flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">Poziom spokoju 100/100</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HeartIcon className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-sm font-medium">87</span>
          </div>
        </div>
      </div>
    </div>
  );
}
