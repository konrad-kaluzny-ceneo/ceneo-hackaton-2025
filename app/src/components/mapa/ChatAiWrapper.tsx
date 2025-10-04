"use client";

import { ChatAiContextProvider } from "./ChatAiContext";
import ChatAiMessages from "./ChatAiMessages";
import ChatAiInput from "./ChatAiInput";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 h-[88vh]">
      <p className="text-gray-500">Ładowanie mapy...</p>
    </div>
  ),
});

type LocationData = {
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  tripName?: string;
};

type Props = {
  locationId: string;
  locations: LocationData[];
};

export default function ChatAiWrapper({ locationId, locations }: Props) {
  return (
    <ChatAiContextProvider locationId={locationId}>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <LocationMap locations={locations} maxHeight="88vh" />
        </div>

        <div className="relative mt-3 flex h-[59vh] w-full md:mt-0 md:h-[88vh] md:w-1/3">
          <div className="flex h-[47vh] w-full md:h-[78vh]">
            <ChatAiMessages />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <ChatAiInput />
          </div>
        </div>
      </div>
    </ChatAiContextProvider>
  );
}
