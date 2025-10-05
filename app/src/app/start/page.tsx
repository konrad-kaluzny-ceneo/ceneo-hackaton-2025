import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPinHouse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StartPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="flex flex-col items-center w-full gap-8">
        <Image src="/logo.png" alt="Start" width={500} height={500} />

        <Link href="/questionnaire" className={cn(buttonVariants({ variant: "default" }), "w-fit")}>
          <MapPinHouse />
          Rozpocznij podróż
        </Link>
      </div>
    </div>
  );
}
