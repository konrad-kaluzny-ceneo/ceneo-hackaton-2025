"use client";

import { TripSet } from "@/types/trip-set";
import { useState } from "react";
import TripModal from "./TripModal";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";

interface TripHistoryProps {
  trips: TripSet[];
  futureTrips: TripSet[];
}

// Helper function to get historical date without mutating original data
function getHistoricalDate(startDate: Date | string): Date {
  const originalDate = new Date(startDate);
  originalDate.setDate(originalDate.getDate() - 30);
  return originalDate;
}

export default function TripHistory({ trips, futureTrips }: TripHistoryProps) {
  const [selectedTrip, setSelectedTrip] = useState<TripSet | null>(null);

  return (
    <div className="relative">
      {/* Central timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full"></div>

      {trips.map((trip, index) => {
        // Get historical date without mutating original data
        const historicalDate = getHistoricalDate(trip.startDate);
        const isEven = index % 2 === 0;

        return (
          <div key={trip.id} className="relative flex items-start mb-8">
            {/* Timeline dot */}
            {!isEven && (
              <div className={`w-1/2 text-right`}>
                <div className="p-4 transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                  <h3 className="font-semibold text-primary">{trip.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {historicalDate.toLocaleDateString("pl-PL")} • {trip.duration} dni • {trip.totalPrice} PLN
                  </p>
                </div>
              </div>
            )}

            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md z-10"></div>

            {/* Trip content - alternating sides */}
            <div className={`w-1/2 ${isEven ? "pr-8 text-right" : "pl-8 text-left ml-auto"}`}>
              {trip.image && (
                <div className="mb-4" onClick={() => setSelectedTrip(trip)}>
                  <Image src={trip.image} alt={trip.name} width={120} height={80} className="rounded-lg object-cover w-full aspect-video" />
                </div>
              )}
            </div>

            {isEven && (
              <div className={`w-1/2 text-left`}>
                <div className="p-4 transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                  <h3 className="font-semibold text-primary">{trip.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {historicalDate.toLocaleDateString("pl-PL")} • {trip.duration} dni • {trip.totalPrice} PLN
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {trips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Brak historii wycieczek</p>
          <p className="text-gray-400 text-sm mt-2">Twoje wycieczki pojawią się tutaj po ich zakończeniu</p>
        </div>
      )}

      {selectedTrip && <TripModal trip={selectedTrip} isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} />}

      <div className="relative font-bold text-primary mt-[-20px] mb-4 z-50 bg-white rounded-lg p-4 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-primary" />
        <p>Możliwe przyszłe wycieczki</p>
      </div>

      {futureTrips.map((trip, index) => {
        const isEven = index % 2 === 0;

        return (
          <div key={trip.id} className="relative flex items-start mb-8">
            {/* Timeline dot */}
            {!isEven && (
              <div className={`w-1/2 text-right`}>
                <div className="p-4 transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                  <h3 className="font-semibold text-primary">{trip.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(trip.startDate).toLocaleDateString("pl-PL")} • {trip.duration} dni • {trip.totalPrice} PLN
                  </p>
                </div>
              </div>
            )}

            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md z-10"></div>

            {/* Trip content - alternating sides */}
            <div className={`w-1/2 ${isEven ? "pr-8 text-right" : "pl-8 text-left ml-auto"}`}>
              {trip.image && (
                <div className="mb-4" onClick={() => setSelectedTrip(trip)}>
                  <Image src={trip.image} alt={trip.name} width={120} height={80} className="rounded-lg object-cover w-full aspect-video" />
                </div>
              )}
            </div>

            {isEven && (
              <div className={`w-1/2 text-left`}>
                <div className="p-4 transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                  <h3 className="font-semibold text-primary">{trip.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(trip.startDate).toLocaleDateString("pl-PL")} • {trip.duration} dni • {trip.totalPrice} PLN
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}