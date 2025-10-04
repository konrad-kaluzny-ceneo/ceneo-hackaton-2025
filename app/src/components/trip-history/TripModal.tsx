"use client";

import { TripSet } from "@/types/trip-set";
import { buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface TripModalProps {
  trip: TripSet;
  isOpen: boolean;
  onClose: () => void;
}

export default function TripModal({ trip, isOpen, onClose }: TripModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary mt-2">{trip.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500">Data rozpoczęcia</span>
            <p className="font-medium">{new Date(trip.startDate).toLocaleDateString("pl-PL")}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Czas trwania</span>
            <p className="font-medium">{trip.duration} dni</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Całkowity koszt</span>
            <p className="font-medium">{trip.totalPrice} PLN</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Liczba destynacji</span>
            <p className="font-medium">{trip.destinations.length}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Trasa wycieczki</h3>
          <div className="text-primary font-medium">
            {trip.destinations
              .map((dest, idx) => {
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
          </div>
        </div>

        <div className="flex gap-2">
          <button className={buttonVariants({ variant: "default" })}>Powtórz wycieczkę</button>
          <button className={buttonVariants({ variant: "outline" })}>Udostępnij</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
