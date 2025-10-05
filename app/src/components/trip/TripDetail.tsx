"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import BackButton from "@/components/shared/BackButton";
import { TripSet } from "@/types/trip-set";
import { TicketIcon, BedIcon, ClockIcon, Sparkles, PlaneIcon, TrainIcon, BusIcon, HomeIcon } from "lucide-react";
import { useUser } from "@/infrastructure/FrontendUserAccessor";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/images";
import { Friends } from "../user/Friends";

interface TripDetailProps {
  trip: TripSet;
}

function getAirportCode(city: string): string {
  const codes: { [key: string]: string } = {
    Wrocław: "WRO",
    Bergamo: "BGY",
    Berlin: "BER",
    Barcelona: "BCN",
    Kraków: "KRA",
    Praga: "PRG",
    Mediolan: "MIL",
  };
  return codes[city] || "XXX";
}

function getTransportIcon(transportName: string) {
  if (transportName.includes("Lot")) return <PlaneIcon className="w-6 h-6 text-primary" />;
  if (transportName.includes("Pociąg")) return <TrainIcon className="w-6 h-6 text-primary" />;
  return <BusIcon className="w-6 h-6 text-primary" />;
}

export default function TripDetail({ trip }: TripDetailProps) {
  return (
    <main className="flex flex-col gap-4">
      <div className="relative">
        <div className="relative h-64 w-full">
          <Image src={trip.image || DEFAULT_IMAGE} alt={trip.name} fill className="object-cover" priority />
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

          {trip.destinations.map((dest: any, idx: number) => (
            <div key={idx} className="mb-6 relative">
              <div className="absolute left-[23px] top-5 w-5 h-5 rounded-full bg-primary border-[3px] border-[#f5ecd7]" />

              <div className="ml-16">
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    {getTransportIcon(dest.transport.name)}
                    <h3 className="text-primary text-xl font-semibold">{dest.transport.name.split(" ")[0]}</h3>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {dest.transport.from.city}({getAirportCode(dest.transport.from.city)}) → {dest.transport.destination.city}({getAirportCode(dest.transport.destination.city)})
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

                  {dest.accommodation && (
                    <div className="bg-primary/10 rounded-2xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-12 h-12 text-primary" />
                        <p className="text-sm text-gray-700">Pamiętaj o czasie na odbiór bagażu i transfer z lotniska na dworzec kolejowy w {dest.transport.destination.city}.</p>
                      </div>
                    </div>
                  )}

                  {dest.accommodation && (
                    <div className="bg-primary/10 rounded-2xl p-6 mb-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <HomeIcon className="w-6 h-6 text-primary" />
                        <h3 className="text-primary text-xl font-semibold">Zakwaterowanie</h3>
                      </div>
                      <div className="text-sm font-bold text-gray-800 mb-1">{dest.accommodation.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{dest.accommodation.description}</div>
                      <div className="text-xs text-gray-500 mb-4">
                        {dest.accommodation.location.city} | {dest.accommodation.price} PLN | {dest.accommodation.beds} łóżka
                      </div>
                    </div>
                  )}
                </div>

                {idx === trip.destinations.length - 1 && (
                  <div className="bg-[#f5f5f5] rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-12 h-12 text-primary" />
                      <p className="text-sm text-gray-700">Jesteś na miejscu! Dobra robota. Pamiętaj, żeby w wolnej chwili odwiedzić pobliskie wodospady 💦</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
