import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPinHouse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StartPage() {
  return (
    <div 
      className="flex justify-center items-center p-4 bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: 'url(/images/icons/background.png)' }}
    >
      <div className="flex flex-col items-center w-full gap-8 text-primary">
        <Image src="/images/icons/logo.png" alt="Start" width={150} height={150} className="animate-logo-subtle" />
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold">Here.</h1>
          <p className="text-lg font-medium">Travel slow. Feel more.</p>
        </div>

        <Link href="/questionnaire" className={cn(buttonVariants({ variant: "default" }), "w-fit")}>
          <MapPinHouse />
          Rozpocznij podróż
        </Link>
      </div>
    </div>
  );
}
