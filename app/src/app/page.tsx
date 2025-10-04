"use client";

import ExampleOfDynamicButton from "@/components/examples/ExampleOfDynamicButton";
import { Friends } from "@/components/user/Friends";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/questionnaire/completed')
      .then(response => response.json())
      .then(data => {
        if (data) {
          if (!data.isCompleted) {
            router.push("/start");
          } else if (data.isGenerated) {
            router.push("/trip-propositions");
          } else {
            router.push("/generating-trips");
          }
        }
      });
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
    </div>
  );
}
