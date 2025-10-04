"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export default function Header({ showBackButton = true, title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Ukryj przycisk wstecz na głównej stronie i stronie z propozycjami
  const shouldShowBackButton = showBackButton && pathname !== "/" && pathname !== "/trip-propositions" && pathname !== "/start";

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between py-3 px-4 h-16 max-w-2xl mx-auto">
        {/* Przycisk wstecz */}
        {shouldShowBackButton && (
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            aria-label="Wróć"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
        )}

        {/* Logo i tytuł */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Link href="/" className="text-primary text-2xl font-bold mb-1">Here.</Link>
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">
              {title}
            </h1>
          )}
        </div>

        {/* Placeholder dla symetrii gdy jest przycisk wstecz */}
        {shouldShowBackButton && <div className="w-10" />}
      </div>
    </div>
  );
}