"use client";

import ExampleOfDynamicButton from "@/components/examples/ExampleOfDynamicButton";
import { Friends } from "@/components/user/Friends";
import Link from "next/link";
import { useUserId } from "@/infrastructure/UserAccessor";
import { Repository } from "@/infrastructure/Repository";
import { inject } from "@/infrastructure/DIContainer";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/infrastructure/FrontendUserAccessor";

export default function Home() {
  const [completionResult, setCompletionResult] = useState<any>(null);
  const userId = useUser().id;

  useEffect(() =>{
    const userId = useUser().id;
    fetch('/api/questionnaire/completed')
      .then(response => response.json())
      .then(data => {
        setCompletionResult(data);
      });
  }, []);

  if (completionResult) {
    if (!completionResult.isCompleted) {
      redirect("/start");
    }

    if (completionResult.isGenerated) {
      redirect("/trip-propositions");
    }

    redirect("/generating-trips");
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <ExampleOfDynamicButton label="Click me" />
      <Link href="/test-route">Test Route</Link>
      <Link href="/start">Start</Link>
      <Link href="/questionnaire">Questionnaire</Link>
      <Link href="/trip-propositions">Trip Propositions</Link>
      <Link href="/trip-history">Trip History</Link>
      <Friends />
    </div>
  );
}
