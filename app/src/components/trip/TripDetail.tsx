"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import BackButton from "@/components/shared/BackButton";
import { TripSet } from "@/types/trip-set";
import { TicketIcon, BedIcon, ClockIcon, StarIcon } from "lucide-react";
import transports from "@/local-data/transport.json";
import locations from "@/local-data/locations.json";
import accommodations from "@/local-data/accommodations.json";
import { useUser } from "@/infrastructure/FrontendUserAccessor";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/images";
import { Friends } from "../user/Friends";
import { getLocationIdByCity } from "@/lib/locationMapper";

interface TripDetailProps {
  trip: TripSet;
}

function getAirportCode(city?: string): string {
  const codes: { [key: string]: string } = {
    Wrocław: "WRO",
    Bergamo: "BGY",
    Berlin: "BER",
    Barcelona: "BCN",
    Kraków: "KRA",
    Praga: "PRG",
    Mediolan: "MIL",
  };
  if (typeof city === "string") {
    return codes[city] || "XXX";
  }
  return "XXX";
}

function getTransportIcon(transportName?: string): string {
  if (transportName?.includes("flight")) return "✈️";
  if (transportName?.includes("train")) return "🚂";
  return "🚌";
}

const getCityById = (id?: string) => {
  return locations.find((location) => location.id === id)?.location.city ;
};
const getAccommodationById = (id: string | null) => {
  return accommodations.find((accommodation) => accommodation.id === id) ;
};

export default function TripDetail({ trip }: TripDetailProps) {
  return (
    <main className="flex flex-col gap-4">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors">
            <BackButton />
          </div>
        </div>

        <div className="relative h-64 w-full">
          <img
            src={trip.image || DEFAULT_IMAGE}
            alt={trip.name}
            className="object-cover w-full h-full absolute inset-0"
            loading="eager"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 pb-4">
            <h1 className="text-white text-2xl font-bold mb-2">{trip.name}</h1>
            <div className="text-white/90 text-sm">
              {trip.duration} dni • {trip.totalPrice} PLN
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg mx-4 mt-[-30px] z-100">
        <h2 className="text-primary text-xl font-bold mb-4">Opcje zakupu</h2>

        <div className="space-y-3 flex flex-col gap-2">
          <Button variant="default">Zakup cały zestaw - {trip.totalPrice} PLN</Button>
        </div>

        <div className="mt-6 space-y-4">
          <Friends />
        </div>
      </div>
      <MaxWidthWrapper className="flex flex-col gap-2">
        <div className="relative">
          <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-primary" />

          {trip.destinations.map((dest, idx: number) => {
            const transport = transports.find((t) => t.id === dest.transportId);
            const cityFrom = getCityById(transport?.fromLocationId);
            const cityTo = getCityById(transport?.toLocationId);
            const accommodation = getAccommodationById(dest.accommodationId);
            return (
            <div key={idx} className="mb-6 relative">
              <div className="absolute left-[23px] top-5 w-5 h-5 rounded-full bg-primary border-[3px] border-[#f5ecd7]" />

              <div className="ml-16">
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{getTransportIcon(transport?.type)}</span>
                    <h3 className="text-primary text-xl font-semibold">{transport?.name.split(" ")[0]}</h3>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {cityFrom}({getAirportCode(cityFrom)}) → {cityTo}({getAirportCode(cityTo)})
                  </div>

                  {idx < trip.destinations.length - 1 && (
                    <div className="bg-primary/10 rounded-2xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="w-5 h-5 text-primary" />
                        <h4 className="text-primary font-semibold">Czas na przesiadkę</h4>
                      </div>
                      <div className="text-sm text-gray-500">1h30m</div>
                    </div>
                  )}

                  {accommodation && (
                    <div className="bg-primary/10 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <StarIcon className="w-5 h-5 text-primary mt-0.5" />
                        <p className="text-sm text-gray-700">Pamiętaj o czasie na odbiór bagażu i transfer z lotniska na dworzec kolejowy w {cityTo}.</p>
                      </div>
                    </div>
                  )}

                  {accommodation && (
                    <div className="bg-primary/10 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <StarIcon className="w-5 h-5 text-primary mt-0.5" />
                        <p className="text-sm text-gray-700">Pamiętaj o czasie na odbiór bagażu i transfer z lotniska na dworzec kolejowy w {cityTo}.</p>
                      </div>
                      <div className="text-sm font-bold text-gray-800 mb-1">{accommodation.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{accommodation.description}</div>
                      <div className="text-xs text-gray-500 mb-4">
                        {cityTo} | {accommodation.price} PLN 
                      </div>
                    </div>
                  )}
                </div>

                {idx === trip.destinations.length - 1 && (
                  <div className="bg-[#f5f5f5] rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <StarIcon className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-gray-700">Jesteś na miejscu! Dobra robota. Pamiętaj, żeby w wolnej chwili odwiedzić pobliskie wodospady 💦</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )})}

        </div>
      </MaxWidthWrapper>
    </main>
  );
}
