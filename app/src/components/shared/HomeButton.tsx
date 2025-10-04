import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomeButton() {
  return (
    <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
      <HomeIcon className="w-8 h-8" />
    </Link>
  );
}
