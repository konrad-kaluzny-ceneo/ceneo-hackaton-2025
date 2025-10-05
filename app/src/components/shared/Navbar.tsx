"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, History, MapPin } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/95 rounded-full shadow-xl border border-gray-100 backdrop-blur-sm">
        <div className="flex justify-around items-center py-3 px-6 h-16 max-w-2xl mx-auto">
        {/* <Link href="/" className={`flex flex-col items-center gap-1 min-w-0 ${
          isActive('/') ? 'text-primary' : 'text-gray-600'
        }`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span className="text-xs">Here.</span>
        </Link> */}
        
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
    </div>
  );
}
