"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, History, MapPin } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-4 h-16 max-w-2xl mx-auto">

        
        <Link href="/trip-propositions" className={`flex flex-col items-center gap-1 min-w-0 ${
          isActive('/trip-propositions') ? 'text-primary font-bold' : 'text-gray-600'
        }`}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Here.</span>
        </Link>
        
        <Link href="/active-trips" className={`flex flex-col items-center gap-1 min-w-0 ${
          isActive('/active-trips') ? 'text-primary font-bold' : 'text-gray-600'
        }`}>
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Aktywne</span>
        </Link>
        
        
        <Link href="/rating" className={`flex flex-col items-center gap-1 min-w-0 ${
          isActive('/rating') ? 'text-primary font-bold' : 'text-gray-600'
        }`}>
          <MapPin className="w-6 h-6" />
          <span className="text-xs">Oceń</span>
        </Link>
        <Link href="/trip-history" className={`flex flex-col items-center gap-1 min-w-0 ${
          isActive('/trip-history') ? 'text-primary font-bold' : 'text-gray-600'
        }`}>
          <History className="w-6 h-6" />
          <span className="text-xs">Historia</span>
        </Link>
      </div>
    </div>
  );
}
