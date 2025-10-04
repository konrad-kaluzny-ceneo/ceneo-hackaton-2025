"use client";

import BackButton from "./BackButton";

export default function Navbar() {

  return (
    <div className="flex items-center p-4 gap-4">
      <BackButton />
      <div className="text-primary text-4xl mb-2 font-bold">Here.</div>
    </div>
  );
}
