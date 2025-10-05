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
      <div className="flex flex-col">
        <div className="w-full">
          <LocationMap locations={locations} maxHeight="33vh" />
        </div>

        <div className="relative mt-3 flex h-[43vh] w-full">
          <div className="flex h-[43vh] w-full">
            <ChatAiMessages />
          </div>
          <div className="absolute bottom-[-100px] left-0 w-full p-4">
            <ChatAiInput />
          </div>
        </div>
      </div>
    </ChatAiContextProvider>
  );
}
