"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === "/";

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      {isMainPage ? (
        <div className={cn(buttonVariants({ variant: "ghost" }))}>
          <HomeIcon className="w-8 h-8" aria-label="Strona główna" />
        </div>
      ) : (
        <Button onClick={handleBack} variant="ghost" size="icon">
          <ArrowLeftIcon className="w-8 h-8" aria-label="Wróć" />
        </Button>
      )}
    </div>
  );
}
