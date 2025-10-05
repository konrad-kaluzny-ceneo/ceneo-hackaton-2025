"use client";

import { TripSet } from "@/types/trip-set";
import { buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Transport } from "@/types/transport";
import { Accommodation } from "@/types/accommodation";

interface TripModalProps {
  trip: TripSet;
  isOpen: boolean;
  onClose: () => void;
  itsHistory: boolean;
}

export default function TripModal({ trip, isOpen, onClose, itsHistory }: TripModalProps) {
  const allAccommodations = require("@/local-data/accommodations.json");
  const accommodations = trip.destinations.map((dest) => allAccommodations.find((accommodation: Accommodation) => accommodation.id === dest.accommodationId));
  const accommodationsToShow = accommodations.filter((accommodation: Accommodation) => accommodation !== undefined);

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
            {accommodationsToShow
              .map((accommodationsToShow: Accommodation) => {
                return accommodationsToShow.name;
              })
              .filter(Boolean)
              .join(" → ")}
          </div>
        </div>

        <div className="flex gap-2">
          <button className={buttonVariants({ variant: "default" })}>{itsHistory ? "Zobacz wycieczkę" : "Powtórz wycieczkę"}</button>
          <button className={buttonVariants({ variant: "outline" })}>Udostępnij</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
