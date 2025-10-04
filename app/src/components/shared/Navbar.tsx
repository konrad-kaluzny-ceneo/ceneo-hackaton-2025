"use client";

import { Badge } from "../ui/badge";
import HomeButton from "./HomeButton";

export default function Navbar() {
  return (
    <div className="flex items-center p-2 w-full h-12 gap-2">
      <HomeButton />
      <p className="text-primary text-2xl font-bold mb-1">Here.</p>
      <Badge variant="default" className="bg-primary text-white">Plus</Badge>
      </div>
  );
}
