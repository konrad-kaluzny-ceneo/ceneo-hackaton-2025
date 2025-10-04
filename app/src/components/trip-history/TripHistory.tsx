"use client";

import { TripSet } from "@/types/trip-set";
import { useState } from "react";
import TripModal from "./TripModal";

interface TripHistoryProps {
  trips: TripSet[];
}

export default function TripHistory({ trips }: TripHistoryProps) {
  const [selectedTrip, setSelectedTrip] = useState<TripSet | null>(null);

  return (
    <div className="relative">
      {trips.map((trip, index) => (
        <div key={trip.id} className="relative flex items-start mb-6">
          <div className="flex flex-col items-center mr-4">
            <button onClick={() => setSelectedTrip(trip)} className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md z-10 relative hover:scale-110 transition-transform cursor-pointer"></button>
            {index < trips.length - 1 && <div className="w-0.5 h-16 bg-gray-300 absolute top-4"></div>}
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">{trip.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString("pl-PL")} • {trip.duration} dni • {trip.totalPrice} PLN
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {trips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Brak historii wycieczek</p>
          <p className="text-gray-400 text-sm mt-2">Twoje wycieczki pojawią się tutaj po ich zakończeniu</p>
        </div>
      )}

      {selectedTrip && <TripModal trip={selectedTrip} isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} />}
    </div>
  );
}
