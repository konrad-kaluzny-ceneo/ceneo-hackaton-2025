"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, History, MapPin } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50" role="navigation" aria-label="Główna nawigacja">
      <MaxWidthWrapper className="w-full">
        <div className="bg-white/95 rounded-full shadow-xl border border-gray-100 backdrop-blur-sm">
          <div className="flex justify-around items-center py-3 px-6 h-16 max-w-2xl mx-auto" role="menubar">
          {/* <Link href="/" className={`flex flex-col items-center gap-1 min-w-0 ${
            isActive('/') ? 'text-primary' : 'text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-xs">Here.</span>
          </Link> */}
          
          <Link 
            href="/trip-propositions" 
            className={`flex flex-col items-center gap-1 min-w-0 ${
              isActive('/trip-propositions') ? 'text-primary font-bold' : 'text-gray-600'
            }`}
            role="menuitem"
            aria-label="Strona główna z propozycjami podróży"
            aria-current={isActive('/trip-propositions') ? 'page' : undefined}
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs">Here.</span>
          </Link>
          
          <Link 
            href="/active-trips" 
            className={`flex flex-col items-center gap-1 min-w-0 ${
              isActive('/active-trips') ? 'text-primary font-bold' : 'text-gray-600'
            }`}
            role="menuitem"
            aria-label="Aktywne podróże"
            aria-current={isActive('/active-trips') ? 'page' : undefined}
          >
            <Calendar className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs">Aktywne</span>
          </Link>
          
          
          <Link 
            href="/rating" 
            className={`flex flex-col items-center gap-1 min-w-0 ${
              isActive('/rating') ? 'text-primary font-bold' : 'text-gray-600'
            }`}
            role="menuitem"
            aria-label="Oceń miejsce"
            aria-current={isActive('/rating') ? 'page' : undefined}
          >
            <MapPin className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs">Oceń</span>
          </Link>
          <Link 
            href="/trip-history" 
            className={`flex flex-col items-center gap-1 min-w-0 ${
              isActive('/trip-history') ? 'text-primary font-bold' : 'text-gray-600'
            }`}
            role="menuitem"
            aria-label="Historia podróży"
            aria-current={isActive('/trip-history') ? 'page' : undefined}
          >
            <History className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs">Historia</span>
          </Link>
        </div>
      </div>
        
      </MaxWidthWrapper>
      
    </nav>
  );
}
